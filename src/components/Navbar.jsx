import { Link } from 'react-router-dom';
import dowellLogo from '../assets/dowell-logo.png';
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between w-full p-4 bg-[#1A8753] md:justify-center">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Link to="https://100035.pythonanywhere.com/home/" className="inline">
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
              ? 'https://100014.pythonanywhere.com/sign-out/?redirect_url=localhost:3000'
              : 'https://100014.pythonanywhere.com/sign-out/?redirect_url=https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/'
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
