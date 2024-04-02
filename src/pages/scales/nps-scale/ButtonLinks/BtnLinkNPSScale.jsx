import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { MdManageHistory } from 'react-icons/md';
import { BsArrowLeft} from 'react-icons/bs';
import { toast } from 'react-toastify';
import useGetScale from '../../../../hooks/useGetScale';
import useGetSingleScale from '../../../../hooks/useGetSingleScale';
import Fallback from '../../../../components/Fallback';
import { Button } from '../../../../components/button';


const BtnLinkNPSScale = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData } = useGetScale();
    const [selectedScore, setSelectedScore] = useState(-1);
    const navigateTo = useNavigate();

    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    console.log("HHHHHHHHHHHHHHHHHH", scaleData && scaleData?.data?.data.slice())
    useEffect(()=>{
        fetchScaleData('nps-scale');
    },[]);

    const handleSelectScore = (score)=>{
        setSelectedScore(score)
    }
    

    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='flex flex-col items-center justify-center h-screen font-medium font-Montserrat'>
        <div className='w-full h-full flex items-center'>
            <div className={`h-full md:h-full w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            // style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}
            >
                <div className={`h-full w-full lg:w-3/12 border overflow-y-auto`}>
                    <h2 className='flex items-center gap-2 p-2 font-medium'>
                        <span className=''>
                        <MdManageHistory className='text-primary'/>
                        </span> Scale History
                    </h2>
                    {/* {scaleData && scaleData?.data?.data.map((scale, index)=>(
                        <>
                            <Button width={'full'} onClick={()=>navigateTo(`/nps-scale-settings/${scale._id}`)} key={index}>{scale?.settings?.name}</Button>
                        </>
                    ))} */}

                    {scaleData && scaleData?.data?.data
                    .slice()
                    .sort((a, b) => {
                        const nameA = a?.settings?.name;
                        const nameB = b?.settings?.name;
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    })
                    .map((scale, index) => (
                        <Button
                        width={'full'}
                        onClick={() => navigateTo(`/100035-DowellScale-Function/nps-scale-settings/${scale._id}`)}
                        key={index}
                        >
                        {scale?.settings?.name}
                        </Button>
                    ))
                    }

                </div>
                <div className='flex-1 flex flex-col items-center justify-center w-full h-full p-2 border stage lg:w-5/12'>
                    <h3 className='py-5 text-sm font-medium text-center'>SCALE</h3>
                    <div className= 'w-full grid  md:gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center bg-gray-300'>
                        {scores.map((score, index)=>(
                            // <button 
                            //     key={index}
                            //     onClick={()=>handleSelectScore(score)}
                            //     className={`rounded-full ${index  > selectedScore ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[3.8rem]`}
                            // >{score}</button>
                            <button
                            key={index}
                            onClick={() => handleSelectScore(score)}
                            className={`rounded-lg ${
                            index == selectedScore
                            ? 'bg-white' : 'bg-primary text-white'
                            }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
                    >
                      {score}
                    </button>
                        ))}
                    </div>
                    <div className='w-full flex items-center justify-between my-3'>
                        <h4>Very unlikely</h4>
                        <h4>Select score</h4>
                        <h4>Very likely</h4>
                    </div>
            
                    <div className='flex items-center justify-end w-full my-4'>
                        <Button primary width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/create-nps-scale-links`)}>create new scale</Button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default BtnLinkNPSScale