import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { FetchUserContextProvider } from './contexts/fetchUserContext';
import Navbar from './components/Navbar';
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <FetchUserContextProvider>
        <Outlet />
      </FetchUserContextProvider>
    </div>
  );
}

export default App;