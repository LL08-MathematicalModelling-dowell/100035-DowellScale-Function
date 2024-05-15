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

const SideBar = () => {

  const [searchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState()
  const [sessionId, setSessionId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo,setModalInfo] = useState()
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
    <div className='lg:w-3/12  overflow-y-auto h-screen' style={{backgroundColor:'#54595F', width:'250px', marginRight: '50px', position: 'fixed'}}>
     <div style={{color: '#D3D3D3', fontSize:'15px', fontWeight:'400', display: 'flex', alignItems:'center', justifyContent: 'center', marginTop: '20px'}}>
     <img src= {dowellLogo} alt='image' style={{height:'60px', borderRadius:'8px', marginRight: '15px'}}/>
     <h3 style={{marginRight: '15px'}}>DoWell Scales</h3>
     <AiOutlineMenuFold style={{fontSize: '25px', color:'#6D6E70'}} />
     </div>
     <div style={{color: '#6D6E70', fontSize:'15px', display: 'flex', alignItems:'center', justifyContent: 'center', marginTop:'40px'}}>
     <FaPowerOff 
     style={{marginRight: '15px', fontSize: '25px', cursor:'pointer'}} onClick={handlePageChange}/>
     <FaUser style={{marginRight: '15px', fontSize: '25px', cursor:'pointer'}} onClick={handleProfile} />
     <Link
          to={`/100035-DowellScale-Function/?session_id=${sessionId}`}
          className="inline"
        >
     <FaHome style={{marginRight: '15px', fontSize: '25px', cursor:'pointer'}} />
     </Link>
     <FaEllipsisV onMouseEnter={() => setIsModalOpen(true)} onMouseLeave={() => setIsModalOpen(false)} style={{marginRight: '15px', fontSize: '25px', cursor:'pointer'}} />
     
      {isModalOpen && <Modal modalInfo={modalInfo} />}
     </div>
     <div style={{color: '#D3D3D3', fontSize:'15px', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop:'40px'}}>
        <img src='https://www.scales.dowellstore.org/wp-content/uploads/2022/12/17.png' alt='User image' style={{height:'100px', borderRadius:'8px', marginBottom: '15px'}}/>
        <h2 style={{color: 'white', fontSize: '20px'}}>Welcome, {userInfo?.username}</h2>
     </div>
     <div style={{fontSize:'15px', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop:'15px'}}>
      <div className='flex mt-10 bg-[#013220] text-white w-5/6' style={{display: 'flex', alignItems:'center', justifyContent: 'center', height:'40px',  borderRadius: '4px'}}>
        <MdNewLabel style={{marginRight:'6px'}} />
        <button className=''>New scale</button>
      </div>
      <div className='flex mt-5 bg-white text-black w-5/6' style={{display: 'flex', alignItems:'center', justifyContent: 'center', height:'40px',  borderRadius: '4px'}}>
       <LiaCloudscale style={{marginRight:'6px'}} />
       <button>My scales</button>
      </div>
     </div>
    </div>
  )
}

export default SideBar
