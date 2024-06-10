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
import { Link, useParams, useLocation, useSearchParams } from "react-router-dom";
import logo from "../../../../src/assets/dowell.png"
import MapComponent from './MapComponent';
import axios from 'axios';
const Booth = () => {

const [boothInput, setBoothInput] = useState(0)
const[boothErr,setBoothErr]=useState(false)
const [searchParams, setSearchParams] = useSearchParams();
const[submitted,setSubmitted]=useState(false)
const[latitude,setLatitude]=useState("")
const[longitude,setLongitude]=useState("")
const[locationLoading,setLocationLoading]=useState(0)
const[valid,setValid]=useState(0)

  const workspaceId=searchParams.get("workspace_id")
  const scaleId=searchParams.get("scale_id")
  const scaleType =searchParams.get("scale_type")
  const channelName=searchParams.get("channel_name")

  const myParam = new URLSearchParams(location.search).get('scale_type');

  console.log(myParam, "GGGGG")

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c * 1000; 
    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}


  const handleGoButton = async() =>{
    setSubmitted(true)
    if(boothInput<=0 || isNaN(boothInput))
      {
        setSubmitted(false)
        setBoothErr(true)
        return
      }else{
     const response=await axios.get(`https://100035.pythonanywhere.com/addons/register/?shop_number=${boothInput}`)
     console.log(response.data.data)
      const distance=calculateDistance(latitude,longitude,latitude,longitude)
      console.log(distance)
      if(distance<=3){
        if(scaleType === 'nps_lite'){
       window.location.href=`https://100035.pythonanywhere.com/nps-lite/api/v5/nps-lite-create-scale/?user=False&scale_type=${scaleType}&workspace_id=${workspaceId}&username=HeenaK&scale_id=${scaleId}&channel_name=${channelName}&instance_id=${boothInput}`
        }else if(scaleType === 'nps'){
          window.location.href=`https://100035.pythonanywhere.com/nps/api/v5/nps-create-scale/?user=False&scale_type=${scaleType}&workspace_id=${workspaceId}&username=HeenaK&scale_id=${scaleId}&channel_name=${channelName}&instance_id=${boothInput}`
        }
      }else{
        setValid(-1)
        setSubmitted(false)
      }
      }
    
  }


  
  useEffect(()=>{
    fetchLocation()
   },[])

   async function fetchLocation(){
        const response=await axios.get("https://www.qrcodereviews.uxlivinglab.online/api/v6/qrcode-data/22-56d63b0b-5d6c-4d6e-b011-d19a9aa8773b")
        const detailedReport = response.data.response.detailed_report;
console.log(response.data)
   if (Array.isArray(detailedReport) && detailedReport.length > 0) {
    
       
       setLatitude(detailedReport[detailedReport.length - 1].lat+"")
       setLongitude(detailedReport[detailedReport.length - 1].long+"")
       setLocationLoading(1)
   } else {
       console.log("detailed_report is either not an array or is empty");
       setLocationLoading(-1)
   }
   }


  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <img className='mt-5 w-[150px] sm:w-[250px]' src={logo} alt='booth image'/>
      <div className="flex flex-col gap-2 mt-[20px] sm:mt-[50px]"> 
          <label htmlFor="boothNumber" className="text-[14px] sm:text-[16px] font-medium self-center">Please enter your shop number</label>
          <input id="boothNumber" name="boothNumber" value={boothInput}
          placeholder="enter shop/stand number"  onChange={(e) => {
           setBoothInput(e.target.value);
           setBoothErr(false)
           setValid(0)
          }
        }
        disabled={submitted==true}
          className={`border rounded-full p-2 px-6 sm:text-base text-sm ${setSubmitted==true ? "bg-gray-300" : ""}`}/>
          </div>
          {boothErr && <p className="text-red-500 text-[12px] sm:text-[14px]">**Shop number is not valid**</p>}
          <div className="w-[300px] sm:w-[500px] h-[250px] m-5 sm:m-10">
            {locationLoading==0 ? (
              <>
              <p className="text-[18px] w-full h-full flex justify-center items-center bg-gray-100">Fetching location details...</p>
            </>
          ):(
          <>
          {locationLoading==1 ? (
            <>
            <MapComponent lat={latitude} lng={longitude}/>
            </>
          ):(
          <>
           <p className="text-[18px] w-full h-full flex justify-center items-center bg-gray-100">Failed to Load Location details</p>
          </>
        )}
          </>
        )}
          
         </div>
      <button className='w-[70px] h-[30px] rounded-lg mt-5  bg-orange-500 font-medium'
      onClick={handleGoButton}>GO</button>
      {valid==-1 && <p className='text-red-600 p-2 mt-2 text-[12px] sm:text-[16px]'>Please check the details and try again</p>}
    </div>
    
  )
}

export default Booth
