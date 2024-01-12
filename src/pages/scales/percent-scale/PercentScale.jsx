import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { MdManageHistory } from 'react-icons/md';
import { BsArrowLeft} from 'react-icons/bs';
import { toast } from 'react-toastify';
import useGetScale from '../../../hooks/useGetScale';
import useGetSingleScale from '../../../hooks/useGetSingleScale';
import Fallback from '../../../components/Fallback';
import "./style.css"
import { Button } from '../../../components/button';


const PercentScale = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData } = useGetScale();
    const [selectedScore, setSelectedScore] = useState(-1);
    const navigateTo = useNavigate();
    const [sliderValue,setSliderValue] = useState(50)

    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const level=[[0,"Left"],[1,"Center"],[2,"Right"]]

    console.log(scaleData, 'scaleData ***');

    

    useEffect(()=>{
        fetchScaleData('percent-scale');
    },[]);

    const handleSelectScore = (score)=>{
        setSelectedScore(score)
    }
    

    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='flex flex-col items-center justify-center h-screen font-medium font-Montserrat'>
    <div className='w-full px-5 py-4 m-auto border border-primary lg:w-10/12'>
        <div className={`h-80 md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
        // style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}
        >
            <div className={`h-full w-full lg:w-3/12 border overflow-y-auto`}>
                <h2 className='flex items-center gap-2 p-2 font-medium'>
                        <span className=''>
                        <MdManageHistory className='text-primary'/>
                        </span> Scale History
                    </h2>
                    {scaleData && scaleData?.map((scale, index)=>(
                        <>
                            <Button width={'full'} onClick={()=>navigateTo(`/100035-DowellScale-Function/nps-lite-scale-settings/${scale._id}`)} key={index}>{scale?.settings?.name}</Button>
                        </>
                    ))}

                </div>
                <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                <h1 style={{textAlign:'center'}}>Percent Scale</h1>
                <div class="slidecontainer" style={{marginTop:"9em"}}>
  
  
  <input type="range" min="1" max="100" onChange={e=>setSliderValue(e.target.value)} className="slider" id="myRange"/>
  <h4 style={{textAlign:"center"}}>{sliderValue}%</h4>
</div>
                    
            
                    <div className='flex items-center justify-end w-full my-4'>
                        <Button primary width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/create-percent-scale`)}>create new scale</Button>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default PercentScale