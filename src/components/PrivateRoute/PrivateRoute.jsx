import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const PrivateRoutes = () => {
  const cookies = new Cookies();
  let session_id = cookies.get('session_id');
  return session_id ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
