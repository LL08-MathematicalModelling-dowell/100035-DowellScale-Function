// import React from 'react'
// import { useState, useEffect} from 'react';
// import { Link, useParams, useSearchParams } from "react-router-dom";

// const Booth = () => {

//   const [boothInput, setBoothInput] = useState()

//   const [searchParams, setSearchParams] = useSearchParams();
//   const workspaceId=searchParams.get("workspace_id")
//   const scaleId=searchParams.get("scale_id")
//   const channelName=searchParams.get("channel_name")
//   console.log(searchParams.get("scale_id"))


//   const handleGoButton = () =>{
//     console.log(boothInput)
//   }
//   return (
//     <div className='flex flex-col items-center mt-10 w-[320px] h-[550px] m-auto'>
//       <img className='mt-10' src='https://cdn.discordapp.com/attachments/1108341894162952192/1247115439675277424/image.png?ex=665eda43&is=665d88c3&hm=f56e39dc3fdcc0568aaa30ee96283958693cb3909acc5dea18373633d5fc9f07&' alt='booth image'/>
//       <h3 className='mt-[140px]'>Please enter your booth number</h3>
//       <input name='boothInput' value={boothInput} onChange={(e) =>setBoothInput(e.target.value)} type='number' className='w-[150px] h-[30px] border-2 border-black mt-5' />
//       <button className='w-[70px] h-[30px] rounded-lg mt-[50px] bg-orange-500 font-medium'
//       onClick={handleGoButton}><Link to={`http://127.0.0.1:8000/nps-lite/api/v5/nps-lite-create-scale/?user=True&scale_type=nps_lite&workspace_id=${workspaceId}&username=Paolo&scale_id=${scaleId}&channel_name=${channelName}&instance_name=${boothInput}`}>Go</Link></button>
//     </div>
    
//   )
// }

// export default Booth


import React from 'react'
import { useState, useEffect} from 'react';
import { Link, useParams, useSearchParams } from "react-router-dom";
import logo from "../../../../public/dowell.png"
const Booth = () => {

  const [boothInput, setBoothInput] = useState(0)

  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId=searchParams.get("workspace_id")
  const scaleId=searchParams.get("scale_id")
  const channelName=searchParams.get("channel_name")
  console.log(scaleId,channelName,workspaceId)


  const handleGoButton = () =>{
    window.location.href=`https://100035.pythonanywhere.com/nps-lite/api/v5/nps-lite-create-scale/?user=False&scale_type=nps_lite&workspace_id=${workspaceId}&username=HeenaK&scale_id=${scaleId}&channel_name=${channelName}&instance_id=${boothInput}`
  }
  return (
    <div className='flex flex-col items-center mt-10 w-[320px] h-[550px] m-auto'>
      <img className='mt-10' src={logo} alt='booth image'/>
      <h3 className='mt-[140px]'>Please enter your booth number</h3>
      <input name='boothInput' value={boothInput} onChange={(e) =>setBoothInput(e.target.value)} type='number' className='w-[150px] h-[30px] border-2 border-black mt-5' />
      <button className='w-[70px] h-[30px] rounded-lg mt-[50px] bg-orange-500 font-medium'
      onClick={handleGoButton}>GO</button>
    </div>
    
  )
}

export default Booth
