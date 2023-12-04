import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import { useSaveResponse } from "../../../hooks/useSaveResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";

const NpsLiteSettings = () => {
    const { slug } = useParams();
    const [scale, setScale] = useState(null);
    const [selectedScore, setSelectedScore] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const saveResponse = useSaveResponse();
    const navigateTo = useNavigate();

    let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const handleSelectScore = (score)=>{
      setSelectedScore(score)
  }

  console.log(scale, 'scale**')


  const submitResponse = async()=>{

    const payload = {
        user: "natan",
        scale_id: "64afe7d3aad77b181847190a",
        event_id: "1689249744727624",
        scale_category: "npslite scale",
        response: "9"
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
        try {
            setLoading(true);
            const response = await axios.get(`https://100035.pythonanywhere.com/nps-lite/api/nps-lite-settings/?scale_id=${slug}`);
            setScale(response.data); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
      }
      fetchData();
  }, [slug]);



  if (loading) {
    return <Fallback />;
  }
  return (
    <div className='flex flex-col items-center justify-center h-screen font-medium font-Montserrat'>
        <div className='w-full px-5 py-4 m-auto border border-primary lg:w-9/12'>
            <div className={`h-80 md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            >
                <div className='flex-1 w-full h-full p-2 border stage lg:w-5/12'>
                    <h3 className='py-5 text-sm font-medium text-center'>Scale Name: {scale?.[0].settings?.name}</h3>
                    <div className='grid grid-cols-4 gap-3 px-2 py-6 bg-gray-300 md:grid-cols-11 md:px-1'>
                        {scale && (Array.isArray(scale?.[0]?.settings?.fomat) ? scale?.[0]?.settings?.fomat : scores).map((score, index)=>(
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
            
                    <div className="flex justify-end gap-3">
                        {scale && scale.map((scale, index)=>(
                            <Button width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/update-nps-lite-scale/${scale._id}`)} key={index}>update scale</Button>
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

export default NpsLiteSettings