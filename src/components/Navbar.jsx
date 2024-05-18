import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import dowellLogo from '../assets/dowell-logo.png';
import { IoSpeedometerSharp } from "react-icons/io5";
import { useSearchParams } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { MdSpeed } from "react-icons/md";
import { useNavigate } from 'react-router';
import { LuLogOut } from "react-icons/lu";


const Navbar = () => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState('');
  const [showSideBar, setShowSideBar] = useState(false)
  const refOne = useRef(null)
  const navigateTo = useNavigate();
  // const {  
  //   popuOption, 
  //   setPopupOption,
  //   sName, 
  //   setSName,
  //   scaleLinks,
  //   setScaleLinks,
  //   isModalOn, 
  //   setIsNodalOn } = useFetchUserContext()
    const screenWidth = screen.width
    console.log(screenWidth)
    console.log(screenWidth, "HHHHHHHHHHHHHHHHHHHHHHhhhh")
  useEffect(() => {
    const session_id =
      searchParams.get('session_id') || sessionStorage.getItem('session_id');
    setSessionId(session_id);
  }, [searchParams]);

  const handleSidebar = () =>{
    setShowSideBar(!showSideBar)
  }

  useEffect(()=>{
    document.addEventListener('click', handleClickOutside, true)
  }, [])


  const handleClickOutside = (e) =>{
    if(!refOne.current.contains(e.target)){
      setShowSideBar(false)
    }
  }

  const handleProfile = () => {
    setShowSideBar(false)
    window.location.href= 'https://100093.pythonanywhere.com/'
  }

  const handleLogout = () => {
    setShowSideBar(false)
    let link = import.meta.env.DEV
    ? 'https://100014.pythonanywhere.com/sign-out?redirect_url=http://localhost:3000/'
    : 'https://100014.pythonanywhere.com/sign-out?redirect_url=https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/'
    window.location.href= link
    }

  const handleHome = () =>{
    setShowSideBar(false)
    navigateTo(`/100035-DowellScale-Function/?session_id=${sessionId}`)
  }

  return (
    <nav className="lg:hidden w-full flex bg-[#FFF]" >
      <div className="navbar flex items-center justify-between w-full p-4 bg-[#FFF] md:justify-center">
      <div className="md:flex-[0.5] flex justify-center items-center bg-red">
      <IoMdMenu ref={refOne} className='w-10 cursor-pointer' onClick={handleSidebar}/>
        <Link
          to={`/100035-DowellScale-Function/?session_id=${sessionId}`}
          className="inline"
        >
          <img
            src={dowellLogo}
            alt="Dowell Logo"
            className="inline w-10 cursor-pointer"
          />
        </Link>
        <h3 style={{}}>DoWell Scales</h3>
      </div>
      <IoPersonCircle />
      </div>
      <div ref={refOne} className='h-screen' style={{width: '250px', backgroundColor: 'white', position: 'fixed', zIndex: '1', borderRight: '1px solid lightgray', marginLeft: showSideBar ? '0' : '70px', opacity: showSideBar ? '1' : '0', visibility: showSideBar ? 'visible' : 'hidden', transition: 'all .3s ease-in .3s'}}>
        <img src={dowellLogo} style={{height: '60px', borderRadius:'8px', marginLeft: '180px'}}/>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
        <div onClick={handleHome} className='flex mt-10 hover:bg-[#013220] hover:text-white w-5/6 text-black' style={{display: 'flex', alignItems:'center', justifyContent: 'center', height:'40px',  borderRadius: '4px', cursor: 'pointer', }}>
        <IoSpeedometerSharp style={{marginRight:'6px'}} />
        <button className='' style={{}}>NEW SCALE</button>
      </div>
      <div className='flex mt-5 hover:bg-[#013220] hover:text-white w-5/6' style={{display: 'flex', alignItems:'center', justifyContent: 'center', height:'40px',  borderRadius: '4px'}}>
       <MdSpeed style={{marginRight:'6px'}} />
       <button style={{}}>MY SCALES</button>
      </div>
      <div onClick={handleProfile} className='flex mt-5 hover:bg-[#013220] hover:text-white text-black w-5/6' style={{display: 'flex', alignItems:'center', justifyContent: 'center', height:'40px',  borderRadius: '4px'}}>
       <FaUsers style={{marginRight:'6px'}} />
       <button style={{}}>CLIENT ADMIN</button>
      </div>
      </div>
      <div onClick={handleLogout} className='flex mt-5 bg-white text-black w-5/6' style={{display: 'flex', alignItems:'center', justifyContent: 'center', height:'40px',  borderRadius: '4px', color: 'red', marginTop: '200px'}}>
       <LuLogOut style={{marginRight:'6px'}} />
       <button style={{}}>LOGOUT</button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
