import { useState, useEffect } from 'react';

import { useSearchParams, Link } from 'react-router-dom';
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

  // const navigateTo = useNavigate();


  // const getUserInfo = async (session_id) => {
  //   const session = {
  //     session_id,
  //   };

  //   const res = await axios({
  //     method: 'post',
  //     url: 'https://100014.pythonanywhere.com/api/userinfo/',
  //     data: session,
  //   });

  //   sessionStorage.setItem('userInfo', JSON.stringify(res.data));
  // };
  // const [searchParams] = useSearchParams();

  // const localSession = sessionStorage.getItem('session_id')
  //   ? sessionStorage.getItem('session_id')
  //   : null;
  // // const localId = sessionStorage.getItem('id')
  // //   ? JSON.parse(sessionStorage.getItem('id'))
  // //   : null;

  // useEffect(() => {
  //   const session_id = searchParams.get('session_id');
  //   // const id = searchParams.get('id');

  //   if (session_id) {
  //     sessionStorage.setItem('session_id', session_id);
  //     getUserInfo(session_id);

  //     // if (id || localId) {
  //     //   sessionStorage.setItem('id', id);
  //     //   getUserInfoOther(session_id);
  //     // } else {
  //     //   getUserInfo(session_id);
  //     // }
  //   }
  //   if (!localSession && !session_id) {
  //     // cookie.remove('sessionid');
  //     window.location.replace(
  //       import.meta.env.DEV
  //         ? 'https://100014.pythonanywhere.com/?redirect_url=http://localhost:3000/'
  //         : 'https://100014.pythonanywhere.com/?redirect_url=https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/'
  //     );
  //   }
  // }, [localSession, searchParams]);

  const [searchParams] = useSearchParams();
  
  const [userInfo, setUserInfo] = useState()

  const getUserInfo = async () => {
    // setLoadingFetchUserInfo(true);
    const session_id = searchParams.get("session_id");
    axios
      .post("https://100014.pythonanywhere.com/api/userinfo/", {
        session_id: session_id
      })

      .then((response) => {
        console.log(response?.data);
        setUserInfo(response?.data?.userinfo);
        console.log(userInfo);
        sessionStorage.setItem('userInfo', JSON.stringify(response.data));
        // setLoadingFetchUserInfo(false);
      })
      .catch((error) => {
        // setLoadingFetchUserInfo(false);
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    console.log(window.location.href)
    if (!session_id) {
      window.location.href =
        "https://100014.pythonanywhere.com/?redirect_url=" +
        `${window.location.href}`;
      return;
    }
    getUserInfo();
    sessionStorage.setItem('session_id', session_id);
    // setLoggedIn(true);
  }, []);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid w-6/12 grid-cols-1 gap-4 lg:grid-cols-2">
        {scaleTypes.map((scale) => (
          <Link
            to={`/100035-DowellScale-Function/${scale.slug}`}
            key={scale.slug}
            className="w-full px-2 py-8 my-1 text-center text-white capitalize rounded-lg bg-primary hover:bg-gray-700/50"
          >
            {scale.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
