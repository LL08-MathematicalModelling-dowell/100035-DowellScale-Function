import React from 'react'
import { useState, useEffect} from 'react';
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Booth = () => {

  const [boothInput, setBoothInput] = useState()
  const {slug}=useParams()
  console.log(slug)
  const search = useLocation().search;
  const scale_id =new URLSearchParams(search).get("scale_id");
  const workspace_id =new URLSearchParams(search).get("workspace_id");
  const username =new URLSearchParams(search).get("username");
  const chanelName =new URLSearchParams(search).get("channel_name");
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("scale_id"))
  let currentUrlParams = new URLSearchParams(window.location.search);

  // useEffect(()=>{
  //   setSearchParams({ scale_id: "665a8277d5d158ec8391aaf7" });
  // }, [])

  const handleGoButton = () =>{
    console.log(boothInput)
  }
  return (
    <div className='flex flex-col items-center mt-10 w-[320px] h-[550px] m-auto'>
      <img className='mt-10' src='https://i0.wp.com/dowellresearch.de/wp-content/uploads/2023/04/true-moments-logo-1-1-442919954-1538479590775-1.webp?w=382&ssl=1' alt='booth image'/>
      <h3 className='mt-[140px]'>Please enter your booth number</h3>
      <input name='boothInput' value={boothInput} onChange={(e) =>setBoothInput(e.target.value)} type='number' className='w-[150px] h-[30px] border-2 border-black mt-5' />
      <button className='w-[70px] h-[30px] rounded-lg mt-[100px] bg-[#FEC39C]'
      onClick={handleGoButton}><Link to={`https://100035.pythonanywhere.com/nps-lite/api/v5/nps-lite-create-scale/?user=False&scale_type=nps_lite&workspace_id=${workspace_id}&username=${username}&scale_id=${scale_id}&channel_name=${chanelName}&instance_id=${boothInput}`}>Go</Link></button>
    </div>
  )
}

export default Booth
