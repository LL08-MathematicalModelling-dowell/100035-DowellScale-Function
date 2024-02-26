import { useState, useEffect } from 'react';
import SideBar from './SideBar';

import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ScaleCard from './ScaleCard';
// import Cookies from 'universal-cookie';

const Home = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    function handleResize() {
      setIsSidebarVisible(window.innerWidth > 600);
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial width
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // const cookie = new Cookies();
  const scaleTypes = [
    {
      name: 'nps lite scale',
      slug: 'nps-lite-scale',
      description: 'Net promoter score (NPS) is a widely used market research metric that is based on a single survey question',
      image: 'https://www.scales.dowellstore.org/wp-content/uploads/2022/12/nps-scale-150x150.png'
    },
    {
      name: 'nps scale',
      slug: 'nps-scale',
      description: 'Net promoter score (NPS) is a widely used market research metric that is based on a single survey question',
      image: 'https://www.scales.dowellstore.org/wp-content/uploads/2022/12/nps-scale-150x150.png'
    },
    {
      name: 'staple scale',
      slug: 'staple-scale',
      description: 'Stapel Scale is a unipolar rating scale designed to measure the respondent’s attitude towards the object or event',
      image: 'https://www.scales.dowellstore.org/wp-content/uploads/2022/12/staple-scale-150x150.png'
    },
    {
      name: 'ranking scale',
      slug: 'ranking-scale',
      description: 'Ranking scales are commonly used to identify customer preferences, prioritize product features, and understand the importance of different factors',
      image: 'https://www.scales.dowellstore.org/wp-content/uploads/2022/12/staple-scale-150x150.png'
    },
    {
      name: 'paired comparison',
      slug: 'pc-scale',
      description: 'A paired comparison scale presents the respondent with two choices and calls for a preference . For example, the respondent is asked which color he or she likes better, red or blue, and a similar process is repeated throughout the scale items',
      image: 'https://storage.googleapis.com/fplswordpressblog/2023/06/Paired-Comparison-Scale-in-Surveys-Purpose-Implementation-Analysis.jpg'
    },
    {
      name: 'perceptual mapping',
      slug: 'pm-scale',
      description: 'Perceptual mapping or market mapping is a diagrammatic technique used by asset marketers that attempts to visually display the perceptions of customers or potential customers',
      image: 'https://www.perceptualmaps.com/wp-content/uploads/2023/05/example-perceptual-map-for-fast-food-1-1.png'
    },
    {
      name: 'Likert scale',
      slug: 'likert-scale', 
      description: 'A Likert scale is a psychometric scale commonly involved in research that employs questionnaires.',
      image: 'https://www.scales.dowellstore.org/wp-content/uploads/2022/12/Likert-Scale-150x150.jpg'
    },
    {
      name: 'Percent Scale',
      slug: 'percent-scale',
      description: 'A percentage point or percent point is the unit for the arithmetic difference between two percentages.',
      image: 'https://www.scales.dowellstore.org/wp-content/uploads/2022/12/percentage-scale-150x150.png'
    },
    {
      name: 'Percent Sum Scale',
      slug: 'percent-sum-scale',
      description: 'A percentage sum scale',
      image: 'https://www.scales.dowellstore.org/wp-content/uploads/2022/12/percentage-scale-150x150.png'
    }
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
    console.log("HHHHHHHHHHHHHHHHHHH",window.location.href)
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
    <div className="flex">
       {/* <div className='sidebar' > */}
       {isSidebarVisible && <SideBar />}
        {/* </div> */}
      <div className="" style={{display:'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
        {scaleTypes.map((scale) => (
          <ScaleCard scaleName={scale.name} 
          description={scale.description}
          imageSource={scale.image}
          slug={scale.slug} 
          key={scale.slug}/>
          // <Link
          //   to={`/100035-DowellScale-Function/${scale.slug}`}
          //   key={scale.slug}
          //   className="w-full px-2 py-8 my-1 text-center text-white capitalize rounded-lg bg-primary hover:bg-gray-700/50"
          // >
          //   {scale.name}
          // </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
