import React, { useState, useEffect } from 'react'
import dowellLogo from '../assets/dowell-logo.png';
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaPowerOff } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/Modal/Modal';
import { MdNewLabel } from "react-icons/md";
import { LiaCloudscale } from "react-icons/lia";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { useFetchUserContext } from "../contexts/fetchUserContext";

const SideBar = () => {

  // const {
  //   rSize,
  //   setRSize} = useFetchUserContext()
  
  const [searchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState()
  const [sessionId, setSessionId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo,setModalInfo] = useState()
  const [reduceSize, setReduceSize] = useState(false)
  const getUserInfo = async () => {
    // setLoadingFetchUserInfo(true);
    const session_id = searchParams.get("session_id");
    axios
      .post("https://100014.pythonanywhere.com/api/userinfo/", {
        session_id: session_id
      })

      .then((response) => {
        console.log(response?.data);
        setUserInfo(response?.data?.userinfo);
        setModalInfo(response?.data?.portfolio_info[0]);
        console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTT",userInfo);
        sessionStorage.setItem('userInfo', JSON.stringify(response.data));
        // setLoadingFetchUserInfo(false);
      })
      .catch((error) => {
        // setLoadingFetchUserInfo(false);
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const session_id =
      searchParams.get('session_id') || sessionStorage.getItem('session_id');
    setSessionId(session_id);
  }, [searchParams]);

  
  const handleSizeToggle = () =>{
    setReduceSize(!reduceSize)
  }
  

  const handlePageChange = () => {
    let link = import.meta.env.DEV
    ? 'https://100014.pythonanywhere.com/sign-out?redirect_url=http://localhost:3000/'
    : 'https://100014.pythonanywhere.com/sign-out?redirect_url=https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/'
    window.location.href= link
    }


    const handleProfile = () => {
      window.location.href= 'https://100093.pythonanywhere.com/'
    }

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    console.log(window.location.href)
    if (!session_id) {
      window.location.href =
        "https://100014.pythonanywhere.com/?redirect_url=" +
        `${window.location.href}`;
      return;
    }
    getUserInfo();
    sessionStorage.setItem('session_id', session_id);
  }, []);

  return (
    <div className='lg:w-3/12  overflow-y-auto h-screen' style={{backgroundColor:'#54595F', width: reduceSize ? '50px' :'250px', marginRight: '50px', position: 'fixed'}}>
     <div style={{color: '#D3D3D3', fontSize:'15px', fontWeight:'400', display: 'flex', flexDirection: reduceSize ? 'column' : 'row', alignItems:'center', justifyContent: 'center', marginTop: '20px'}}>
     <AiOutlineMenuUnfold onClick={handleSizeToggle} style={{fontSize: '25px', color:'#6D6E70', cursor: 'pointer', display: reduceSize ? 'block' : 'none'}}/>
     <img src= {dowellLogo} alt='image' style={{height: reduceSize ? '25px' : '60px', borderRadius:'8px'}}/>
     <h3 style={{marginRight: '15px', display: reduceSize ? 'none' : 'block'}}>DoWell Scales</h3>
     <AiOutlineMenuFold onClick={handleSizeToggle} style={{fontSize: '25px', color:'#6D6E70', cursor: 'pointer', display: reduceSize ? 'none' : 'block'}} />
     </div>
     <div style={{color: '#6D6E70', fontSize:'15px', display: 'flex', alignItems:'center', flexDirection: reduceSize ? 'column' : 'row', justifyContent: 'space-between', marginTop:'10px', padding: '15px'}}>
     <Link
          to={`/100035-DowellScale-Function/?session_id=${sessionId}`}
          className="inline"
          style={{display: reduceSize ? 'block' : 'none', marginBottom:'10px'}}
        >
     <FaHome style={{fontSize: '25px', cursor:'pointer'}} />
     </Link>
     <FaUser title={`Welcome, ${userInfo?.username}`} style={{fontSize: '25px', cursor:'pointer', marginBottom: '10px'}} onClick={handleProfile} />
     <FaPowerOff 
     style={{fontSize: '25px', cursor:'pointer'}} onClick={handlePageChange}/>
     <Link
          to={`/100035-DowellScale-Function/?session_id=${sessionId}`}
          className="inline"
          style={{display: reduceSize ? 'none' : 'block'}}
        >
     <FaHome style={{fontSize: '25px', cursor:'pointer'}} />
     </Link>
     <FaEllipsisV onMouseEnter={() => setIsModalOpen(true)} onMouseLeave={() => setIsModalOpen(false)} style={{marginRight: '15px', fontSize: '25px', cursor:'pointer', display: reduceSize ? 'none' : ''}} />
     
      {isModalOpen && <Modal modalInfo={modalInfo} />}
     </div>
     <div style={{color: '#D3D3D3', fontSize:'15px', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop:'40px'}}>
        <img src='https://www.scales.dowellstore.org/wp-content/uploads/2022/12/17.png' alt='User image' style={{height:'100px', borderRadius:'8px', marginBottom: '15px', display: reduceSize ? 'none' : ''}}/>
        <h2 style={{color: 'white', fontSize: '20px', display: reduceSize ? 'none' : 'block'}}>Welcome, {userInfo?.username}</h2>
     </div>
     <div style={{fontSize:'15px', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop:'15px'}}>
      <div className='flex mt-10 bg-[#013220] text-white w-5/6' style={{display: 'flex', alignItems:'center', justifyContent: 'center', height:'40px',  borderRadius: '4px', cursor: 'pointer'}}>
        <MdNewLabel style={{marginRight:'6px'}} />
        <button className='' style={{display: reduceSize ? 'none' : 'block'}}>New scale</button>
      </div>
      <div className='flex mt-5 bg-white text-black w-5/6' style={{display: 'flex', alignItems:'center', justifyContent: 'center', height:'40px',  borderRadius: '4px'}}>
       <LiaCloudscale style={{marginRight:'6px'}} />
       <button style={{display: reduceSize ? 'none' : 'block'}}>My scales</button>
      </div>
     </div>
    </div>
  )
}

export default SideBar
