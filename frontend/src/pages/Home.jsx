import { useState, useEffect } from 'react';
import SideBar from './SideBar';
import { useFetchUserContext } from "../contexts/fetchUserContext";
import { useSearchParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';
import ScaleCard from './ScaleCard';
// import Cookies from 'universal-cookie';

const Home = () => {
console.log(sessionStorage.getItem("session_id"))
  const {  
    popuOption, 
    setPopupOption,
    sName,
    setSName,
    BtnLink,
    setBtnLink,
    scaleIndex,
    setScaleIndex,
    rSize, 
    setRSize } = useFetchUserContext()

    console.log(useFetchUserContext())

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
      name: 'NPS LITE SCALE',
      slug: 'nps-lite-scale',
      btnLink: 'npsLiteBtnLink',
      description: 'Net promoter score (NPS) is a widely used market research metric that is based on a single survey question. We can also provide more information like use cases of this scale...',
      image: 'https://www.mailerlite.com/img/containers/assets/SEO/cover-automation-nps-1571391762.png/03e0db977bad2866419531ed9874a4eb.png'
    },
    {
      name: 'NPS SCALE',
      slug: 'nps-scale',
      btnLink: 'npsBtnLink',
      description: 'Net promoter score (NPS) is a widely used market research metric that is based on a single survey question',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReCfr4WXocJI77qnwOLn2JDbXPqRhMefS9WQ&usqp=CAU'
    },
    {
      name: 'STAPLE SCALE',
      slug: 'staple-scale',
      btnLink: 'stapelBtnLink',
      description: 'Stapel Scale is a unipolar rating scale designed to measure the respondent’s attitude towards the object or event',
      image: 'data:image/png;base64,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'
    },
    {
      name: 'RANKING SCALE',
      slug: 'ranking-scale',
      description: 'Ranking scales are commonly used to identify customer preferences, prioritize product features, and understand the importance of different factors',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHCE4KhwOp1ho_jL5nWhJ2SdWI2c0DtBOsIw&usqp=CAU'
    },
    {
      name: 'PAIRED COMPARISON',
      slug: 'pc-scale',
      description: 'A paired comparison scale presents the respondent with two choices and calls for a preference . For example, the respondent is asked which color he or she likes better, red or blue, and a similar process is repeated throughout the scale items',
      image: 'data:image/jpeg;base64,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'
    },
    {
      name: 'PERCEPTUAL MAPPING',
      slug: 'pm-scale',
      description: 'Perceptual mapping or market mapping is a diagrammatic technique used by asset marketers that attempts to visually display the perceptions of customers or potential customers',
      image: 'data:image/png;base64,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'
    },
    {
      name: 'LIKERT SCALE',
      slug: 'likert-scale',
      btnLink: 'likertBtnLink',
      description: 'A Likert scale is a psychometric scale commonly involved in research that employs questionnaires.',
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAACjCAMAAAA3vsLfAAAB4FBMVEVYvNX/////4ACL5QD/syX/Qx0Arjr/4gBUvNdUud5Hvd1Hud7/OAD/Qhr/sgh+ur9Hwt5+q75+wr1HRkVcvd1iw72I4wv2tC723gsArSr2SSZOusAEr0JeXVxZwtz4+Pja2tqcm5tycnH/5wBGjqDSz87n5eSOjo3w8PBNpbqzrqymoJ5qaWi7u7pAPz5StMxJma0/eog5ZXA8U1hBS01NTEtFi5xXVlWsp6Vwb28esWLftlr/diD/sCb/2A3Y4gBPWVuCfHo9cn87XmZaVFI0Sk+GhYUpKCZHaGkAAABwZFlWXkssV06IQzh3WySSx6JgZkdmyq4iVRiTIwBvs8iAWBx8eX+8zG1y0oItVCo+uqamJgCaoKyIXRSyvZjn3D5/4F00uI+yjJHHu35Uay+F5DkVYSMnt3nOMAC3fxTPuXJkWiZWhBQTeCl1hYbemhGbiBJxtQAAmStZOjSri5DXugCvNRxQcyB61m6JgY16yABty5vEfHpgqqzDqwhasaQ6lZBoRhKEchrP1WJkoRnbTDTdaFmqex6u0pWPoK14bn7Ucmp5iImEMCDotU1YUTFVgRivzofiYVFwOzJ8byMnYDMRgjCbuqQXr1SW1eXS7/am70XK96LH7M72eSlyyYsQqwpVAAAKgElEQVR4nO2bi3fTRhaHJezYiu0Yk5gQJ2gk25H8iGU7doxjaGmcpKElu2zphtCm4V3eSYFQHoEu3aVQ2LA8ul3Ko7vLv7ojyXIsaSRZidPD6d7vnB5SyI+Z+XTvzMhpKQoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfvcghKhCQfml/QjjLoG/tVAoMG4ChUxxuJgptB1REsVihnKxjo2DCnumJmr1eo2dGs20NSCihksTuXo9wZbbSyBUnCznEvV6bqJUZNpKZCYn6iNZKTuSmGhzjGKpqiTitfJoYavFocxUQkrTCpwwUy46DogKpZyWoPnUxLBTAlGj1RG+ERCz7KTjolCxnBJpDX6m7CgODY+NrCeE+tQWiyvV10eTzY2UnQacTOgSdNZhUahYkXQBgd1jP0RhKsXpEul6yTaACuVxXYAWE6Nb5w1lKjxtIJ2zWxQqjAnGBFe3myIqpYwBbNrlpGhhrGCTKLJpU0KyG2NToGKOMw1H0ylrCyhTNU+QpkdK1t7KEiHAW1tAmWnSpNIV68RwghCgxbG2RbgjkyMNR9NxS2+FaXIiO2mRQGVTcTqsyWoIrs/CGyrWyIkt8mY1QZquFy0ieVIhKKbJnY1KpFqT4csWoseshhA/JieslyHYNMGGQWXRajy6Qk6UyKUjwxJroThjGcgSRaNJ6yGyxCawW0bc6vFvguKI5XC0QGy6TN06IU4REmjMOkAWbTcEOVGM2yTGOl5utkuic4QZoinScaAxkzEnhrM2AdKjQSXr0sEJQrmhslVTy2SHO6GqlUzcThtphoW6XUI0byToY7sAzTLmISwOqQZVwjKstwEMZ7WDbhT750oqbzRqve0oFswSbJdEZ807z7DVCaIyYkqgUfMdr5W6zXVvI6Cq8tcKrMEeN6PeTmdM49m3A16TsUvRHnvPoqlLUcluG8DHr6kHUNk2QEsd7lKt49KJmVYb41XecjytgURdSQja4zb19bqErE5484XWdKNAE83vaX21kOKNLzjzuaNNKl1rNR7XNlXzo9kcmeZLXOJAXFuV1HdA+5I3jVfQVjJyoFVCn/bb6U+M2rRKED/VddKn2poOGifFNLc2qfXiP950OGualLYPpHWvL6nm6v7QWW3ru0hCEhpfi+Ppqtaz4h+N42VsLiwy3CGjtgn7AF37k+FQKBDfklr47LAhkTG/8Or5fGiLtJFJ/3nOkLC758lwR3r1a2JYhyXNHw0YtNUdErNfRA3a4g6JLxfM5/UmKNpdqTDiV4vGB+uk7dhxfcKx2uZPBA2zsni7bDJ70qCt4FhtpzqqzUkC/9VpQ885XCdo8dgZffE4nXI0mzRUG3KoT+7rs92GdTiITp87bxC9OQz9IKXqcd2+LV0waqPsr6K0cPGSQZvD1ZC+nDRUApqyv+OIS/0GbU4VLSzv7ag23bsVX8mKaT7Ftkz6m5BRm9OaFq8YtFF77PdP/qpJm8ONWrpmrDbt0UhVVk9dTcRXOlttaHK9uIRGb4iV9UP8euhbozb97ZXjJUFXTWz4jLsdfvHGgCHg8KpE1/pNTVpUrhqiqVclde+uxDqrreXoTlfNXwk3Q8YjQXc9EHK1kWw2VW1e+Wj+WPi4sXjs3yuqSdOR0EwYgurjFG95bhslMBXlz003F1WbcC620Flt62tq+ZGKpF0TJ3pCc0Zt63sVl9N0CVWtEeevhHuNCds7i3Q1abyArCdY3UabU+t89Y7nrlECGlUmMGPs7ooa9MWGOnqS4hmmNActozXaVbrZMxgxJQqNVkhXWrozFVd+4Y94w6ZAS7kJuYRCrVnk1W1+43VXTqQbk1rfF8Wq6oS/5fEQJKiCqvrjR9UuLPtiHbZGoenGE61JvMa46oDr6wl9Z9aGPlHXktO9cKeU36x6vftMtcP8Zb15OI3Gvy/e8/vNk2K+1x7iOCsp38rPaG+blX6PaWvDib8q+yHHtlxEefXNmhvz+Tq8tWEJi9fVJXDjcY3GI04Mdpl7FM+w92+kTyjkv2X+ijf8ypxAVxcJAaUQ7if9Pxi3NjnxQEtwUoLNsbm4VkZr1zzmHpVZVmedrY4rstJSrvHpRG6l8z2KZ/iwalyMyjc3e3p+NBcbRQX29ZE/2Vl85PU+MxUbDjy+T76E8Jf9fr9pL8REv1gim1594PH0k6xFT33eGENI1Vg2NyM1Cnr+F5+vs7c2BebvoQrJArZGLDac2B7uI30suIqtmQ8EmcDAfZIF6fI2v/8oodgoqrt/aZWQWMPWPIfJEnwvx80BjsXWtqDYKCryJHTdVAx85QK2dppUbNjCmfAh08usOHERWzNe2lSY3uTVNdM1ZBV3qH+AvCJmyHNt2vhshModbO22eWdTE7HlNePzl/Ir2FqHbx8N0MPQzZxuiuI/nnZha8QWlQnsCz9idYd9OnVoF7b2zOKxBh8nbzxf1H9MWbmR3LaN2KIy0cOe/ltrrbMS1l5gaZ6zVg6iC7GVL1OtR6nALvuwtY6fByoM9TDU9ZTN8uqyRCnxdLCny8YajjwLex9NLzYSaWn+0BWvbI2y6obgT8nkvcurjY9008Lqc3yEytaI1SkTvevx3FmaXRTENJfmpdXZpX7FmnW/RU/FfCsvcyOCyCmJMVnallmTvf0z1NNz4ebP02xu+uenD3GldfWEnlhboxjmUtjrvfLo0EE2d/D5kYsfemVr+xjrNQUf+/3J/ffuf4YDs/+6egP35zb/gLU1pd4wdx68ePH1i6UHcnvKHWrnANcb9rSyfO7ly3PnflnxKdZObZU1TOR0CItr0CVL64rbWMMEjofD3lbC4eM2DrC33hP42Ewmk9vwP0ql+X+wLE6FKHXSo6f/MHlf02CG9sZ8rcReD22hNext7oksrkumpycU+o5y+vQ9QJ1pERcOX6JsreE1BR8PyLoUsMETvUGnA657Z6u4/neMkwMmisVp5mKx1wvRLThDdQNGqG9/xL4wg08WKftSUxMB6tWlXWEZ76VXVMB5goFg71G55GRnPzlLk8fopu7ePos3tbMn3+3sbqdwsNmF83t3+3a/Pr8wtNXSFFAkQs3tmKMikXZ/zsMEAtT27dupQBvOGoFgYKh351Aw2G6Cika7ZaLtK4hq/BbSVBibXb1DCcb9GAAAAAAAAAAAAO3CwDvHBmDevH379o3950+AAQZxUm06N869+Y29OQzX8sfMewjipvP5vnw+L75pP7QZXZG5HW7Z7ppe9+x0Bcfm+xTy3FDbbKKj0emQWz4Iu2a/3y0fedzwq9Cw1pfPvou1zfcb9hYJqR9/u+ADr1s+3K99At427rT9e7WpLfcf/c8Q7Hi94Z8uoJBba++ltnlNW1/FhbbdG9YWGexxy/uoLd6stlr72mIb/w9CmB0PB13y312u2T/glo/63fArf0DTJr3z7W6TvZv5Pzsirgm4JuiebjcE39bVcstXuUC0bTZh7XcCVz+Ab215lkPwnuCGt3yqnhLAmksYhF9K38DLvFs2+7oEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/F/xPwly0jbXFMHoAAAAAElFTkSuQmCC'
    },
    {
      name: 'PERCENT SCALE',
      slug: 'percent-scale',
      description: 'A percentage point or percent point is the unit for the arithmetic difference between two percentages.',
      image: 'data:image/jpeg;base64,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'
    },
    {
      name: 'PERCENT SUM SCALE',
      slug: 'percent-sum-scale',
      description: 'A percentage sum scale',
      image: 'https://www.scales.dowellstore.org/wp-content/uploads/2022/12/percentage-scale-150x150.png'
    }
  ];
  const navigateTo = useNavigate();



  const handleStartCreating = () =>{
    setPopupOption(false)
    navigateTo(`/100035-DowellScale-Function/home/${scaleTypes[scaleIndex].slug}`)
  }


  
  const [userInfo, setUserInfo] = useState()

  const screenWidth = screen.width

  const getUserInfo = async () => {
    // setLoadingFetchUserInfo(true);
    const session_id = sessionStorage.getItem("session_id");
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
  
    getUserInfo();
    // setLoggedIn(true);
  }, []);
console.log(BtnLink, "YYYYYYYYYYYYYYYYYYYYYYYYYYYYy")

  return (
    <div className="w-4/5" style={{position: 'relative', left: rSize || screenWidth <= 600 ? '10%': '19%', backgroundColor: 'red'}}>
       {/* <div className='sidebar' > */}
       {/* {isSidebarVisible && <SideBar />} */}
        {/* </div> */}
      <div>
        <h1></h1>
      </div>
      <div className="" style={{ filter: popuOption ? 'blur(8px)' : '', pointerEvents: popuOption ? 'none' : '', display:'flex', flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'white'}}>
        {scaleTypes.map((scale, index) => (
          <ScaleCard scaleName={scale.name} 
          description={scale.description}
          imageSource={scale.image}
          slug={scale.slug}
          index={index}
          btnLinks = {scale.btnLink}
          key={scale.slug}/>
        ))}
      </div>

      {popuOption && 
      <div className='popup' style={{width: '550px', height: '240px', display: 'flex', left: '53%', top: '25%', WebkitTransform:'translate(-50%, -50%)', MozTransformStyle: 'translate(-50%, -50%)', transform: 'translate(-50%, -50%)', position: 'fixed', backgroundColor:'white', borderRadius: '8px'}}>
      <button
          onClick={() => setPopupOption(false)}
          className="absolute px-2 text-black bg-white rounded-full right-2 top-2"
        >
          X
        </button>
        <div className='border' style={{ marginRight: '40px', width: '100px',height:"100px", marginTop: '30px', marginLeft: '40px' }}>
            <img src={scaleTypes[scaleIndex].image} style={{ width: '100px',height:"100px",objectFit:"cover",background:"black", marginRight: '10px' }} alt={scaleTypes[scaleIndex].name} />
          </div>

          <div style={{marginTop: '20px'}}>
            <h3 style={{ fontFamily:"Changa, sans-serif", fontWeight:'500' }}>{scaleTypes[scaleIndex].name}</h3>
            <p className="text-black-600" style={{ width: '340px', fontSize: 'medium' }}>{scaleTypes[scaleIndex].description}</p>
            <button
              className="text-center text-white capitalize bg-primary"
              style={{ width: '200px', marginTop:"10px", height: '40px' }}
              onClick={handleStartCreating}
             >
             Start creating
          </button>
          </div>
      {/* <Link
        className="w-full py-3 text-center text-white capitalize rounded-lg bg-primary hover:bg-gray-700/50"
        style={{ width: '250px', marginTop:"10px" }}
        to={`/100035-DowellScale-Function/${sName}`}
        onClick={() => setPopupOption(false)}
      >
        Create a masterlink
      </Link> */}
      {/* <Link
        className="w-full py-3 text-center text-white capitalize rounded-lg bg-primary hover:bg-gray-700/50"
        style={{ width: '250px', marginTop:"30px" }}
        to={`/100035-DowellScale-Function/${BtnLink}`}
        onClick={() => setPopupOption(false)}
      >
        Create Button Link
      </Link> */}
      </div>
      }
    </div>
  );
};

export default Home;
