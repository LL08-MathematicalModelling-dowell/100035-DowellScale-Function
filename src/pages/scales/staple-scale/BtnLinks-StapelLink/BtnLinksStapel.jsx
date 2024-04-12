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


const BtnLinksStapel = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData } = useGetScale();
    const [selectedScore, setSelectedScore] = useState(-6);
    const navigateTo = useNavigate();

    // const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    
    console.log(scaleData, 'scaleData')
    useEffect(()=>{
        fetchScaleData('staple-scale');
    },[]);

    const handleSelectScore = (score)=>{
        setSelectedScore(score)
    }
    

    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className=' h-screen font-medium font-Montserrat'>
      <div style={{width:"100%",}} className='w-full px-5 py-4 m-auto border border-primary lg:w-10/12'>
        <div  style={{height:"50em"}} className={` md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            // style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}
            >
                <div className={`h-full w-full lg:w-3/12 border overflow-y-auto`}>
                    <h2 className='flex items-center gap-2 p-2 font-medium'>
                        <span className=''>
                        <MdManageHistory className='text-primary'/>
                        </span> Scale History
                    </h2>
                    {scaleData && scaleData?.data?.map((scale, index) => (
                        <Button
                        width={'full'}
                        onClick={() => navigateTo(`/100035-DowellScale-Function/staple-scale-settings/${scale._id}`)}
                        key={index}
                        >
                        {scale?.settings?.name}
                        </Button>
                    ))
                    }

                </div>
                <div className='flex-1 w-full h-full p-2 border stage lg:w-5/12'>
                    <h3 className='py-5 text-sm font-medium text-center'>SCALE</h3>
                    <div  className= 'grid gap-3 md:gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center bg-gray-300'
                style={{display:'flex', alignItems:'center',fontSize: 'small', overflow: 'auto',marginTop:"20%",gap:"2%",justifyContent:"space-evenly"}}>
                        {scores.map((score, index)=>(
                            <button 
                                key={index}
                                style={{borderRadius:"10%"}}
                                onClick={()=>handleSelectScore(score)}
                                 className={` ${selectedScore === score? 'bg-primary text-white'  : 'bg-white text-primary'} text-primary h-[3.8rem] w-[3.8rem]`}
                            >{score}</button>
                        ))}
                    </div>
                    <div className='flex items-center justify-between my-3'>
                        <h4>Very unlikely</h4>
                        <h4></h4>
                        <h4>Very likely</h4>
                    </div>
            
                    <div className='flex items-center justify-end w-full my-4'>
                        <Button primary width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/create-staple-scale-btnLink`)}>create new scale</Button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default BtnLinksStapel