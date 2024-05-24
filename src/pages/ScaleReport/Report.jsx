import React from 'react'
import { useState, useEffect } from 'react';
import { useFetchUserContext } from "../../contexts/fetchUserContext";
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { IoIosSearch } from "react-icons/io";
import useGetScale from './../../hooks/useGetScale';

function Report() {

  const {  
    popuOption, 
    setPopupOption,
    sName,
    setSName,
    BtnLink,
    setBtnLink,
    scaleIndex,
    setScaleIndex,
    rSize, 
    setRSize } = useFetchUserContext()

    const { isLoading, scaleData, fetchScaleData } = useGetScale();

    const [screenWidth, setScreenWidth] = useState(screen.width)

    const between = (x, min, max) => {
      return x >= min && x <= max;
    }

    useEffect(()=>{
      fetchScaleData('nps-lite-scale');
  },[]);

  console.log(scaleData, 'scaleData ***');

    window.onresize = function(){
      setScreenWidth(screen.width)
      }

  return (
    <div className=' flex flex-col justify-start w-5/6 mt-5' style={{marginLeft: '20%'}}>
      <div className='flex justify-start'>
        <MdOutlineArrowBackIosNew className='hidden lg:block' style={{width:"25px", height:'30px', marginRight: '5px'}} />
        <div className='flex flex-col justify-start'>
        <h4 style={{width: '188px', height: '18px', fontFamily:'Roboto', fontWeight:'700', fontSize:'16px', lineHeight: '18.75px'}}>Previously created scales</h4>
         <p style={{fontFamily:"Roboto", fontWeight:'400', fontSize: '12px', lineHeight:'14.06px'}}>Update and delete scales from the list of previosly created scales</p>
         <p style={{fontFamily:"Roboto", fontWeight:'400', fontSize: '12px', lineHeight:'14.06px'}}>View detailed analytics report for your scale</p>
      </div>
      </div>
      <div className='w-5/6 mt-10 rounded-lg bg-[#E8E8E8]' style={{marginLeft: '0'}}>
        <div className='flex flex-wrap justify-between w-full flex mt-10'>
        <div className='flex items-center justify-start bg-[#FFF] rounded-lg w-1/3 ml-5'>
          <input className='rounded-lg w-full ml-5' style={{height: '29px'}}/>
          <IoIosSearch className='w-10 cursor-pointer' />
        </div>
        <div className='flex'>
          <p>Filter by</p>
          <select>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          </select>
        </div>
        </div>
        <div>
        {scaleData && scaleData?.map((scale, index)=>(
          <div>
          <div className='flex'>
            {index + 1}. <div className='border m-5 bg-[red] ' onClick={()=>navigateTo(`/100035-DowellScale-Function/nps-lite-scale-settings/${scale._id}`)} key={index}>{scale?.settings?.name}</div>
          </div>
          <div className=''>
            <div>Created on</div>
            <div>Date modified</div>
          </div>
          </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Report
