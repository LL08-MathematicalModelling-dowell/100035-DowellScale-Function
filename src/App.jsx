import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { FetchUserContextProvider } from './contexts/fetchUserContext';
import Navbar from './components/Navbar';
import { Outlet } from "react-router-dom";
import {
  useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import SideBar from './pages/SideBar';

function App() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const publicLink = queryParams.get('scale_type');
  const location = useLocation();
  const isHome = location.pathname === '/100035-DowellScale-Function/';
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    function handleResize() {
      setIsSidebarVisible(window.innerWidth > 600);
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial width
    return () => window.removeEventListener('resize', handleResize);
  }, []); 
   
  
  return (
    <div>
      {!publicLink   &&  <Navbar />}
    <div className='flex'>
      <ToastContainer />
      <FetchUserContextProvider>
      {!publicLink   &&  <SideBar />}
        <Outlet />
      </FetchUserContextProvider>
    </div>
    </div>
  );
}

export default App;