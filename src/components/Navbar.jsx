import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dowellLogo from '../assets/dowell-logo.png';
import { useSearchParams } from 'react-router-dom';

const Navbar = () => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState('');
  useEffect(() => {
    const session_id =
      searchParams.get('session_id') || sessionStorage.getItem('session_id');
    setSessionId(session_id);
  }, [searchParams]);

  return (
    <nav className="flex items-center justify-between w-full p-4 bg-[#1A8753] md:justify-center">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Link
          to={`/100035-DowellScale-Function/?session_id=${sessionId}`}
          // to={
          //   import.meta.env.DEV
          //     ? `http://localhost:3000/?session_id=${sessionId}`
          //     : `https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/?session_id=${sessionId}`
          // }
          className="inline"
        >
          <img
            src={dowellLogo}
            alt="Dowell Logo"
            className="inline w-10 cursor-pointer"
          />
          <span className="text-black uppercase">Home</span>
        </Link>
      </div>
      <div>
        <Link
          to={
            import.meta.env.DEV
              ? 'https://100014.pythonanywhere.com/sign-out?redirect_url=http://localhost:3000/'
              : 'https://100014.pythonanywhere.com/sign-out?redirect_url=https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/'
          }
        >
          <div className="bg-[#FFC007] uppercase py-2 px-7 mx-4 rounded-sm cursor-pointer text-black hover:bg-[#ffffff]">
            Logout
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
