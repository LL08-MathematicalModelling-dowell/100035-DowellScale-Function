import React, { useState, useEffect } from 'react'
import dowellLogo from '../assets/dowell-logo.png';
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaPowerOff } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const SideBar = () => {

  const [searchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState()
  const [sessionId, setSessionId] = useState('');

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
    <div className='lg:w-3/12 overflow-y-auto' style={{backgroundColor:'#54595F', width:'600px', marginRight: '50px'}}>
     <div style={{color: '#D3D3D3', fontSize:'15px', fontWeight:'400', display: 'flex', alignItems:'center', justifyContent: 'center', marginTop: '20px'}}>
     <img src= {dowellLogo} alt='image' style={{height:'60px', borderRadius:'8px', marginRight: '15px'}}/>
     <h3 style={{marginRight: '15px'}}>DoWell Scales</h3>
     <AiOutlineMenuFold style={{fontSize: '25px', color:'#6D6E70'}} />
     </div>
     <div style={{color: '#6D6E70', fontSize:'15px', display: 'flex', alignItems:'center', justifyContent: 'right', marginTop:'40px'}}>
     <FaPowerOff 
     style={{marginRight: '15px', fontSize: '25px', cursor:'pointer'}} onClick={handlePageChange}/>
     <FaUser style={{marginRight: '15px', fontSize: '25px', cursor:'pointer'}} onClick={handleProfile} />
     <Link
          to={`/100035-DowellScale-Function/?session_id=${sessionId}`}
          className="inline"
        >
     <FaHome style={{marginRight: '15px', fontSize: '25px', cursor:'pointer'}} />
     </Link>
     <FaEllipsisV style={{marginRight: '15px', fontSize: '25px', cursor:'pointer'}} />
     </div>
     <div style={{color: '#D3D3D3', fontSize:'15px', display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'right', marginTop:'40px'}}>
        <img src='https://www.scales.dowellstore.org/wp-content/uploads/2022/12/17.png' alt='User image' style={{height:'100px', borderRadius:'8px', marginRight: '15px', marginBottom: '15px'}}/>
        <h2>{userInfo?.username}</h2>
     </div>
    </div>
  )
}

export default SideBar
