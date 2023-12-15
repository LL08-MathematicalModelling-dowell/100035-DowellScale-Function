import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { FetchUserContextProvider } from './contexts/fetchUserContext';
import Navbar from './components/Navbar';
import { Outlet } from "react-router-dom";
import {
  useLocation,
} from 'react-router-dom';

function App() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const publicLink = queryParams.get('public_link');
  return (
    <div>
      <ToastContainer />
      {!publicLink && <Navbar />}
      <FetchUserContextProvider>
        <Outlet />
      </FetchUserContextProvider>
    </div>
  );
}

export default App;