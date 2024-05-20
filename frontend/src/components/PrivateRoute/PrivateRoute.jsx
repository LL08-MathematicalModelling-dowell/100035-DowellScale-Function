import { Outlet, Navigate, useSearchParams } from 'react-router-dom';
// import Cookies from 'universal-cookie';

const PrivateRoutes = () => {
  // const cookies = new Cookies();

  // const [searchParams, setSearchParams] = useSearchParams();
  // const localSession = sessionStorage.getItem('session_id')
  //   ? JSON.parse(sessionStorage.getItem('session_id'))
  //   : null;
  // const localId = sessionStorage.getItem('id')
  //   ? JSON.parse(sessionStorage.getItem('id'))
  //   : null;

    
  let session_id = sessionStorage.getItem('session_id');
  console.log('====================================');
  console.log(session_id);
  console.log('====================================');
  return session_id ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        import.meta.env.DEV
          ? window.location.replace(
              'https://100014.pythonanywhere.com/?redirect_url=http://localhost:3000/'
            )
          : 'https://100014.pythonanywhere.com/?redirect_url=https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/'
      }
    />
  );
};

export default PrivateRoutes;
