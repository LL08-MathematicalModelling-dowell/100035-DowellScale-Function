import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import { useSaveResponse } from "../../../hooks/useSaveResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";

const StapleScaleSettings = () => {
    const { slug } = useParams();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const [scale, setScale] = useState(null);
    const [selectedScore, setSelectedScore] = useState(-6);
    const [isLoading, setIsLoading] = useState(false);
    // const [loading, setLoading] = useState(false);
    const saveResponse = useSaveResponse();
    const navigateTo = useNavigate();

    const scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

    console.log(sigleScaleData)



    const handleSelectScore = (score)=>{
      setSelectedScore(score)
  }

    const handleFetchSingleScale = async(scaleId)=>{
      await fetchSingleScaleData(scaleId);
  }


  const submitResponse = async()=>{

    const payload = {
        
    }

    try {
        setIsLoading(true);
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
        // try {
        //     setLoading(true);
        //     const response = await axios.get(`http://100035.pythonanywhere.com/ranking/api/ranking_settings_create?scale_id=${slug}`);
        //     setScale(response.data); 
        // } catch (error) {
        //     console.error(error);
        // } finally {
        //     setLoading(false);
        // }
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
                        {sigleScaleData && sigleScaleData?.[0].settings?.scale?.slice(0, 10).map((score, index)=>(
                            <button 
                                key={index}
                                onClick={()=>handleSelectScore(score)}
                                className={`rounded-full ${index - 5  > selectedScore ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[3.8rem]`}
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
                            <Button width={'3/4'} onClick={()=>navigateTo(`/update-staple-scale/${scale._id}`)} key={index}>update scale</Button>
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

export default StapleScaleSettings