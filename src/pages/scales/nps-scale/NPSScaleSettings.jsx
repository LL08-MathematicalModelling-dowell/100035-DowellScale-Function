import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import { useSaveResponse } from "../../../hooks/useSaveResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";

const NPSScaleSettings = () => {
    const { slug } = useParams();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const [selectedScore, setSelectedScore] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const saveResponse = useSaveResponse();
    const navigateTo = useNavigate();

    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


    const handleSelectScore = (score)=>{
      setSelectedScore(score)
  }

    const handleFetchSingleScale = async(scaleId)=>{
      await fetchSingleScaleData(scaleId);
  }


  const submitResponse = async()=>{

    const payload = {
        document_responses: [
            {
                scale_id:slug,
                score:10
            },
            {
                scale_id:"64f6fc2c7ab91b2af12c3958",
                score:10
            }],
        instance_id:1,
        brand_name:"question",
        product_name:"answer",
        username: "tall",
        action: "document",
        authorized: "Ambrose",
        cluster: "Documents",
        collection: "CloneReports",
        command: "update",
        database: "Documentation",
        document: "CloneReports",
        document_flag: "processing",
        document_right: "add_edit",
        field: "document_name",
        function_ID: "ABCDE",
        metadata_id: "64f568426bcc87ef0c75d43c",
        process_id: "64f5683c3270cf0e74824fe7",
        role: "single step role",
        team_member_ID: "1212001",
        content: "",
        document_name: "name",
        page: "",
        user_type: "public",
        _id: slug
    }

    try {
        setIsLoading(false);
        const response = await saveResponse(payload);
        console.log(response)
        // if(status===200){
        //     toast.success('successfully updated');
        //     setTimeout(()=>{
        //         navigateTo(`/nps-scale/${sigleScaleData[0]?._id}`);
        //     },2000)
        //   }
    } catch (error) {
        console.log(error);
    }finally{
        setIsLoading(false);
    }
  }

  useEffect(() => {
      const fetchData = async () => {
          await handleFetchSingleScale(slug);
      }
      fetchData();
  }, [slug]);


  if (loading) {
    return <Fallback />;
  }
  return (
    <div className='h-screen  flex flex-col items-center justify-center font-Montserrat font-medium font-Montserrat'>
        <div className='border border-primary w-full lg:w-9/12 m-auto py-4 px-5'>
            <div className={`h-80 md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            >
                <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                    <h3 className='text-center py-5 text-sm font-medium'>Scale Name: {sigleScaleData?.[0].settings.name}</h3>
                    <div className='grid grid-cols-4 md:grid-cols-11 gap-3 bg-gray-300 py-6 px-2 md:px-1'>
                        {scores.map((score, index)=>(
                            <button 
                                key={index}
                                onClick={()=>handleSelectScore(score)}
                                className={`rounded-full ${index  > selectedScore ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[3.8rem]`}
                            >{score}</button>
                        ))}
                    </div>
                    <div className='flex items-center justify-between my-3'>
                        <h4>Very unlikely</h4>
                        <h4>Select score</h4>
                        <h4>Very likely</h4>
                    </div>
            
                    <div className="flex gap-3 justify-end">
                        {sigleScaleData && sigleScaleData.map((scale, index)=>(
                            <Button width={'3/4'} onClick={()=>navigateTo(`/update-nps-scale/${scale._id}`)} key={index}>update scale</Button>
                        ))}
                        <Button 
                            onClick={submitResponse}
                            width={'3/4'} 
                            primary
                        >   
                            {isLoading ? 'Saving Response' : 'Save Response'}
                        </Button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default NPSScaleSettings