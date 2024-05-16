import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dowellLogo from '../assets/dowell-logo.png';
import { useSearchParams } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { useFetchUserContext } from "../contexts/fetchUserContext";

const Navbar = () => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState('');
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

  return (
    <nav className="navbar flex items-center justify-between w-full p-4 bg-[#FFF] md:justify-center" style={{display: screenWidth > 639 ? 'none': ''}}>
      <div className="md:flex-[0.5] flex justify-center items-center bg-red">
      <IoMdMenu className='w-10'/>
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
    </nav>
  );
};

export default Navbar;
