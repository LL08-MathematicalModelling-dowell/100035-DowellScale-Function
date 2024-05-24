// import React from 'react'
// import { useState, useEffect } from 'react';
// import { useFetchUserContext } from "../../../contexts/fetchUserContext";
// import { MdOutlineArrowBackIosNew } from "react-icons/md"
// import { IoIosSearch } from "react-icons/io";
// import useGetScale from '../../../hooks/useGetScale';
// import ButtonImage from '../../../assets/ButtonImage.png';
// import { IoIosArrowDown } from "react-icons/io";
// import { IoIosArrowUp } from "react-icons/io";
// import Fallback from '../../../components/Fallback';
// import { useNavigate } from 'react-router';

// function Report() {

//   const {  
//     popuOption, 
//     setPopupOption,
//     sName,
//     setSName,
//     BtnLink,
//     setBtnLink,
//     scaleIndex,
//     setScaleIndex,
//     rSize, 
//     setRSize } = useFetchUserContext()

//     const { isLoading, scaleData, fetchScaleData } = useGetScale();

//     // const [screenWidth, setScreenWidth] = useState(screen.width)
//     const [openSlider, setOpenSlider] = useState(false)
//     const [sliderKey, setSliderKey] = useState()
//     const navigateTo = useNavigate();

//     useEffect(()=>{
//       fetchScaleData('nps-lite-scale');
//   },[]);

//   const handleSlideOpen = (index) =>{
//     setOpenSlider(!openSlider)
//     setSliderKey(index)
//   }

//   const handleUserReport = (scale) =>{
//     navigateTo(`/100035-DowellScale-Function/home/scale-report-settings/${scale._id}`)
//   }

//   console.log(scaleData, 'scaleData ***');

//     // window.onresize = function(){
//     //   setScreenWidth(screen.width)
//     //   }

//     if (isLoading) {
//       return <Fallback />;
//   }

//   return (
//     <div className='flex flex-col justify-start w-5/6 mt-5 ml-[10%] lg:ml-[20%]'>
//       <div className='flex justify-start'>
//         <MdOutlineArrowBackIosNew className='hidden lg:block' style={{width:"25px", height:'30px', marginRight: '5px'}} />
//         <div className='flex flex-col justify-start'>
//         <h4 style={{width: '188px', height: '18px', fontFamily:'Roboto', fontWeight:'700', fontSize:'16px', lineHeight: '18.75px'}}>Previously created scales</h4>
//          <p style={{fontFamily:"Roboto", fontWeight:'400', fontSize: '12px', lineHeight:'14.06px'}}>Update and delete scales from the list of previosly created scales</p>
//          <p style={{fontFamily:"Roboto", fontWeight:'400', fontSize: '12px', lineHeight:'14.06px'}}>View detailed analytics report for your scale</p>
//       </div>
//       </div>
//       <div className='w-[95%] mt-10 rounded-lg bg-[#E8E8E8]' style={{marginLeft: '0'}}>
//         <div className='flex flex-wrap justify-between w-full flex mt-10 mb-10'>
//         <div className='flex items-center justify-start bg-[#FFF] rounded-lg w-1/3 ml-5'>
//           <input className='rounded-lg w-full ml-5 outline-none' style={{height: '29px'}}/>
//           <IoIosSearch className='w-10 cursor-pointer' />
//         </div>
//         <div className='flex'>
//           <p style={{fontWeight: '400', fontSize: '12px', marginRight:'20px'}}>Filter by:</p>
//           <select style={{fontWeight: '400', fontSize: '12px', width: '105px', marginRight:'25px', outline:'none'}}>
//           <option>1</option>
//           <option>2</option>
//           <option>3</option>
//           </select>
//         </div>
//         </div>
//         <div>
//         {scaleData && scaleData?.map((scale, index)=>(
//           <div onClick={() =>handleSlideOpen(index)} key={index} className='flex items-center justify-between w-[95%] mt-[10px] bg-[white] m-auto rounded-lg cursor-pointer pl-10 pr-5 pb-1' style={{WebkitBoxShadow: "0 10px 6px -6px #777"}}>
//           <div className=''>
//             <div className='flex items-center'>
//             <p>{index + 1}</p><div className='ml-[17%] w-full' >{scale?.settings?.name}</div>
//             </div>
//             <div className='ml-[20%]' style={{display: openSlider && index == sliderKey ? 'block' : 'none' }}>
//             <div className='flex'>
//             <h3>150+ </h3>
//             <p style={{fontSize: 'small', color: 'black'}}>responses</p>
//             </div>
//             <div className='flex items-center justify-center bg-[#129561] w-[180px] text-[white]'>
//             <img src={ButtonImage} className='' alt='ButtonImage' />
//             <button onClick={() =>handleUserReport(scale)} className='rounded-lg cursor-pointer outline-none'>
//             Generate user report</button>
//         </div>
//         </div>
//           </div>
//           <div className='flex items-center justify-between'>
//             <div className='' style={{display: openSlider && index == sliderKey ? 'none' : 'block'}}>
//             <h3>150+ </h3>
//             <p style={{fontSize: 'small', color: 'lightgray'}}>responses</p>
//             </div>
//             <div className='' style={{display: openSlider && index == sliderKey ? 'flex' : 'none'}}>
//             <div className='mr-5 flex flex-col items-center justify-center'>
//               <p style={{fontWeight:'400', fontSize:'12px'}}>Created on:</p>
//               <p style={{fontWeight: '300', fontSize:'12px'}}>2/4/2023</p>
//             </div>
//             <div className='flex flex-col items-center justify-center mr-3'>
//               <p style={{fontWeight:'400', fontSize:'12px'}}>Date modified:</p>
//               <p style={{fontWeight: '300', fontSize:'12px'}}>2/4/2023</p>
//             </div>
//           </div>
//           <div>
//           <IoIosArrowDown style={{display: openSlider && index == sliderKey ? 'none' : 'block'}} />
//           <IoIosArrowUp style={{display: openSlider && index == sliderKey ? 'block' : 'none'}} />
//           </div>
//           </div>
//           </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Report


import React from 'react'
import construction from '../../../assets/construction.jpg';

function Report() {
  return (
    <div className='w-full flex flex-wrap justify-center'>
      <img src={construction} alt='construction' className='w-1/2'/>
    </div>
  )
}

export default Report