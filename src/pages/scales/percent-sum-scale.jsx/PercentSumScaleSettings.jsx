import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import { useSaveResponse } from "../../../hooks/useSaveResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";
import UpdateNpsLite from "../nps-lite-scale/UpdateNpsLite";
import NPSLiteMasterLink from "../nps-lite-scale/NPSLiteMasterLink";
import MasterlinkSuccessModal from "../../../modals/MasterlinkSuccessModal";
import UpdatePercentSumScale from "./UpdatePercentScale";
const PercentSumScaleSettings = () => {
  const [sliderValue,setSliderValue] = useState(0)
  const[sliderValue2,setSliderValue2] = useState(0)
    const { slug } = useParams();
    const [scale, setScale] = useState(null);
    const [selectedScore, setSelectedScore] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const saveResponse = useSaveResponse();
    const navigateTo = useNavigate();
    
    const [scores,setScores]=useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showMasterLinkSuccessModal, setShowMasterLinkSuccessModal] =
      useState(false);
    const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
    const [masterLink, setMasterLink] = useState('');
    const [qrCodeURL, setQrCodeURL] = useState('');
    const [qrCodeId, setQrCodeId] = useState('');
    const [userInfo, setUserInfo] = useState();
    // const [scale, setScale] = useState(null);
    const [publicLinks, SetpublicLinks] = useState(null);
    // const [selectedScore, setSelectedScore] = useState(-1);
    // const [isLoading, setIsLoading] = useState(false);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const publicLink = queryParams.get('public_link');
    const link_id = queryParams.get('link_id');
    const qrcode_id = queryParams.get('qrcode_id');
    const [isButtonHidden, setIsButtonHidden] = useState(false);
  
    // let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    console.log(scale, 'scale**')


//   const submitResponse = async()=>{

//     const payload = {
//         // user: "natan",
//         // scale_id: "64afe7d3aad77b181847190a",
//         // event_id: "1689249744727624",
//         // scale_category: "npslite scale",
//         // response: selectedScore
//         scale_id: "656b707c129273f39b974377", // scale_id of scale the response is for
//         score: "selectedScore", // user score selection
//         process_id: "LivingLabScales", 
//         instance_id:2,//no. of scales
//         brand_name:"livingLabScales",
//         product_name:"livingLabScales",
//         username:  sessionStorage.getItem('session_id') //session id

        
    
//     }

//     console.log(payload)
//     try {
//         setIsLoading(true);
//         const response = await saveResponse(payload);
//         console.log(response)
//         // if(status===200){
//         //     toast.success('successfully updated');
//         //     setTimeout(()=>{
//         //         navigateTo(`/nps-scale/${sigleScaleData[0]?._id}`);
//         //     },2000)
//         //   }
//     } catch (error) {
//         console.log(error);
//     }finally{
//         setIsLoading(false);
//     }
//   }
const MasterLinkFunction = async () => {
    try {
      // Prepare request data for master link creation
      const requestData = {
        qrcode_type: 'Link',
        quantity: 1,
        company_id: 'Living Lab Scales',
        document_name: 'Living Lab Scales',
        links: publicLinks.map((link) => ({ link })),
      };

      console.log(requestData);

      // Post request to create master link
      const data = await axios.post(
        'https://www.qrcodereviews.uxlivinglab.online/api/v3/qr-code/',
        requestData
      );

      const result = data.data;

      if (result.error) {
        setIsLoading(false);
        return;
      } else {
        // Set master link and handle modal toggle
        setMasterLink(result.qrcodes[0].masterlink);
        console.log('result.qrcodes[0].qrcode_id');
        setQrCodeURL(result.qrcodes[0].qrcode_id);
        console.log(result.qrcodes[0].qrcode_id);
        console.log('result.qrcodes[0].links[0].response.link_id');
        console.log(result.qrcodes[0].links[0].response.link_id);
        handleToggleMasterlinkModal();
        setIsLoading(false);
        toast.success(result.response);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response);

      // console.log("Error", error.response);
    }
  };

  const createMasterLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const session_id = sessionStorage.getItem('session_id');
    console.log(session_id);
    try {
      // Fetch user information
      const pub_links = await axios.post(
        'https://100093.pythonanywhere.com/api/userinfo/',
        {
          // session_id: "p1frwekqkwq05ia3fajjujwgvjjz1ovy",
          session_id: sessionStorage.getItem('session_id'),
        }
      );

      const result = pub_links.data;
      setUserInfo(result.userinfo);
      console.log(result, "hhhhhhhhhhhhhhhhhhhhhtttttttttttt")
      const PublicLinks = [];
      const all_public_links = [];

      // Extract public links from user portfolio
      result.selected_product.userportfolio.forEach((portfolio) => {
        if (
          portfolio.member_type === 'public' &&
          portfolio.product === 'Living Lab Scales'
        ) {
          PublicLinks.push(portfolio.username);
        }
      });
      console.log(PublicLinks, "TTTTTTTTTTTTHHHHHHHHHHH")
      const flattenedArray = [].concat(...PublicLinks);

      // Generate modified URLs
      const modifiedUrl = window.location.href.slice(
        0,
        window.location.href.lastIndexOf('/')
      );
      const lastPart = window.location.href.slice(
        window.location.href.lastIndexOf('/') + 1
      );
      console.log("nnnnnnnnnnnnbbbbbbbbbbb",flattenedArray.length)
      console.log("nnnnnnnnnnnnbbbbbbbbbbb",scale?.[0].settings?.no_of_scales)
      if(flattenedArray.length < scale?.[0].settings?.no_of_scales) {
       return toast.error('Insufficient public members');
      }
      for (
        let i = 0;
        i < scale.no_of_scales && i < flattenedArray.length;
        i++
      ) {
        // Append the current element to the current window.location.href
        const newUrl = `${modifiedUrl}/${lastPart}/?public_link=${
          flattenedArray[i]
        }&code=${qrCodeURL}&instance_id=${i + 1}`;
        // const newUrl = `${modifiedUrl}/${flattenedArray[i]}/?public_link=${lastPart}`;
        all_public_links.push(newUrl);
      }

      SetpublicLinks(all_public_links);
    } catch (error) {
      setIsLoading(false);
      toast.error('Insufficient public members');
      // console.log("Error", "Insufficient public members");
    }
  };

  const getTextColorForCategory = (category) => {
    switch (category) {
      case 'Bad':
        return selectedScore >= 0 && selectedScore <= 3 ? 'white' : 'black';
      case 'Good':
        return selectedScore >= 4 && selectedScore <= 6 ? 'white' : 'black';
      case 'Best':
        return selectedScore >= 7 && selectedScore <= 10 ? 'white' : 'black';
      default:
        return 'black';
    }
  };

  const handleButtonHideClick = () => {
    // Perform the click action

    // Hide the button after one click
    setIsButtonHidden(true);
  };

  const handleToggleUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };
  const handleToggleMasterlinkModal = () => {
    setShowMasterlinkModal(!showMasterlinkModal);
  };
  const handleToggleMasterlinkSuccessModal = () => {
    setShowMasterLinkSuccessModal(!showMasterLinkSuccessModal);
  };

  const handleSelectScore = (score) => {
    setSelectedScore(score);
  };

  // const handleFetchSingleScale = async (scaleId) => {
  //   await fetchSingleScaleData(scaleId);
  // };

  const submitResponse = async () => {
    const info = await axios.post(
      'https://100093.pythonanywhere.com/api/userinfo/',
      {
        // session_id: "p1frwekqkwq05ia3fajjujwgvjjz1ovy",
        session_id: sessionStorage.getItem('session_id'),
      }
    );

    // const result = info.data;
    // console.log(result.userinfo);
    // setUserInfo(result.userinfo);

    const payload = {
      scale_id: slug,
      score: selectedScore[1],
      // process_id: link_id,
      // instance_id: new URLSearchParams(window.location.search).get(
      //   'instance_id'
      // ),
      // brand_name: 'Living Lab Scales',
      // product_name: 'Living Lab Scales',
      // username: new URLSearchParams(window.location.search).get('public_link'),
      // scale_id: "65806be4b3e62ca5274d5e03", // scale_id of scale the response is for
    // score: "Good", // user score selection
    process_id: "sefwef5444", 
    instance_id:1,
    brand_name:"question",
    product_name:"answer",
    username: "ndoneambse"
    };
    console.log(payload);
    console.log("processID:",link_id)
    // finalizeMasterlink();

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://100035.pythonanywhere.com/nps-lite/api/nps-lite-response",
        // 'https://100035.pythonanywhere.com/api/nps_responses_create',
        payload
      );
      const result = response.data;
      console.log(result.success);
      if (result.error) {
        setIsLoading(false);
        return;
      } else {
        handleButtonHideClick();
        toast.success('Response has been saved');
        finalizeMasterlink();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeMasterlink = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const response = await axios.put(
        `https://www.qrcodereviews.uxlivinglab.online/api/v3/masterlink/?link_id=${link_id}`
      );

      console.log(response.response.data);

      handleToggleMasterlinkSuccessModal();
    } catch (error) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
      console.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  // SetpublicLinks triggers a re-render, so use useEffect to call MasterLinkFunction after state update
  useEffect(() => {
    // handleToggleMasterlinkModal();
    MasterLinkFunction();
  }, [publicLinks]);

  
  useEffect(() => {
      const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://100035.pythonanywhere.com/percent/api/percent_settings_create/?scale_id=${slug}`);
            setScale(response.data); 
            console.log(response.data)
            // const newArray = response.new.settings.label_selection.map((item, index) => [index + 1, item]);
            // setScores(newArray);
            console.log(scores)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
      }
      fetchData();
      console.log(scores)
  }, [slug]);
  if (loading) {
    return <Fallback />;
  }
      {/* scale && (Array.isArray(scale?.[0]?.settings?.fomat) ? scale?.[0]?.settings?.fomat : scores).map((score, index)=>( */}
  return (
    <div className='flex flex-col items-center justify-center h-screen font-medium font-Montserrat'>
        <div className='w-full px-5 py-4 m-auto border border-primary lg:w-9/12'>
            <div className={`h-80 md:h-80 w-full  mb-28 flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            >
                <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                    <h3 className='text-center py-5 text-sm font-medium'>{scale?.settings?.name}</h3>
                    <div className='flex justify-center md:grid-cols-11 gap-3 bg-gray-300 py-6 px-2 md:px-1 az'>
                    <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                <h1 style={{textAlign:'center'}}>Percent Sum Scale</h1>
                <div class="slidecontainer" style={{marginTop:"3em"}}>
                <input type="range" min="1" max="100" className="slider" id="myRange"/>
                <h4 style={{textAlign:"center"}}>{sliderValue}%</h4>
                </div>
                    
                <div class="slidecontainer" style={{marginTop:"2em"}}>
                <input type="range" min="1" max={100-sliderValue}  className="slider" id="myRange"/>
                <h4 style={{textAlign:"center"}}>{sliderValue2}%</h4>
                </div>
                
                </div>                  </div>
                    {/* <div className='flex items-center justify-between my-3'>
                        <h4>Very unlikely</h4>
                        <h4>Select score</h4>
                        <h4>Very likely</h4>
                    </div>
             */}
                    <div className="flex gap-3 justify-end">
                        {/* {scale && scale.map((scale, index)=>(
                            <Button width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/update-nps-lite-scale/${scale._id}`)} key={index}>update scale</Button>
                        ))}
                        <Button 
                            onClick={submitResponse}
                            width={'3/4'} 
                            primary
                        >   
                            {isLoading ? 'Saving Response' : 'Save Response'}
                        </Button> */}
                        {!publicLink && (
            <>
              <Button width={'3/4'} onClick={handleToggleUpdateModal}>
              Update scale
              </Button>
              <Button width={'3/4'} primary onClick={createMasterLink}>
                {isLoading ? 'Creating Masterlink' : 'Create Masterlink'}
              </Button>
            </>
          )}
          {publicLink && (
          <>
            {!isButtonHidden && (
              <div className="flex items-center justify-center my-4">
                <Button width={'3/12'} primary onClick={submitResponse}>
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>
              </div>
            )}
          </>
        )}
        {showMasterLinkSuccessModal && (
        <MasterlinkSuccessModal
          handleToggleMasterlinkSuccessModal={
            handleToggleMasterlinkSuccessModal
          }
        />
      )}
      {showUpdateModal && (
        <UpdatePercentSumScale handleToggleUpdateModal={handleToggleUpdateModal} />
      )}
      {showMasterlinkModal && (
        <NPSLiteMasterLink
          handleToggleMasterlinkModal={handleToggleMasterlinkModal}
          link={masterLink}
          publicLinks={publicLinks}
          image={qrCodeURL}
        />
      )}
  
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default PercentSumScaleSettings