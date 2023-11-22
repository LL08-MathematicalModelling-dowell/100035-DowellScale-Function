import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
// import Cookies from 'universal-cookie';

const Home = () => {
  // const cookie = new Cookies();
  const scaleTypes = [
    {
      name: 'nps lite scale',
      slug: 'nps-lite-scale',
    },
    {
      name: 'nps scale',
      slug: 'nps-scale',
    },
    {
      name: 'staple scale',
      slug: 'staple-scale',
    },
    {
      name: 'ranking scale',
      slug: 'ranking-scale',
    },
    {
      name: 'paired scale comparison',
      slug: 'pc-scale',
    },
    {
      name: 'perceptual mapping scale',
      slug: 'pm-scale',
    },
  ];

  const navigateTo = useNavigate();
  // const getUserInfoOther = async (session_id) => {
  //   const session = {
  //     session_id,
  //   };

  //   const res = await axios({
  //     method: 'post',
  //     url: 'https://100093.pythonanywhere.com/api/userinfo/',
  //     data: session,
  //   });

  //   sessionStorage.setItem('userInfo', JSON.stringify(res.data));
  // };

  const getUserInfo = async (session_id) => {
    const session = {
      session_id,
    };

    const res = await axios({
      method: 'post',
      url: 'https://100014.pythonanywhere.com/api/userinfo/',
      data: session,
    });

    sessionStorage.setItem('userInfo', JSON.stringify(res.data));
  };
  const [searchParams] = useSearchParams();

  const localSession = sessionStorage.getItem('session_id')
    ? sessionStorage.getItem('session_id')
    : null;
  // const localId = sessionStorage.getItem('id')
  //   ? JSON.parse(sessionStorage.getItem('id'))
  //   : null;

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    // const id = searchParams.get('id');

    if (session_id) {
      sessionStorage.setItem('session_id', session_id);
      getUserInfo(session_id);

      // if (id || localId) {
      //   sessionStorage.setItem('id', id);
      //   getUserInfoOther(session_id);
      // } else {
      //   getUserInfo(session_id);
      // }
    }
    if (!localSession && !session_id) {
      // cookie.remove('sessionid');
      window.location.replace(
        import.meta.env.DEV
          ? 'https://100014.pythonanywhere.com/?redirect_url=http://localhost:3000/'
          : 'https://100014.pythonanywhere.com/?redirect_url=https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/'
      );
    }
  }, [localSession, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid w-6/12 grid-cols-1 gap-4 lg:grid-cols-2">
        {scaleTypes.map((scale) => (
          <button
            onClick={() => navigateTo(`/${scale.slug}`)}
            key={scale.slug}
            className="w-full px-2 py-8 my-1 text-white capitalize rounded-lg bg-primary hover:bg-gray-700/50"
          >
            {scale.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
