import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import { useSaveStapleScaleResponse } from "../../../hooks/useSaveStapleScaleResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";
import NPSMasterlink from "../nps-scale/NPSMasterlink";
import MasterlinkSuccessModal from "../../../modals/MasterlinkSuccessModal";

const StapleScaleSettings = () => {
    const { slug } = useParams();
    // const { loading, singleScaleData, fetchSingleScaleData } = useGetSingleScale();
        const[singleScaleData,setSingleScaleData] = useState()
    const [scale, setScale] = useState(null);
    const [selectedScore, setSelectedScore] = useState(-6);
    const [isLoading, setIsLoading] = useState(false);
    // const [loading, setLoading] = useState(false);
    const saveResponse = useSaveStapleScaleResponse();
    const navigateTo = useNavigate();
    const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
    const [masterLink, setMasterLink] = useState('');
    const [qrCodeURL, setQrCodeURL] = useState('');
    const [qrCodeId, setQrCodeId] = useState('');
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
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showMasterLinkSuccessModal, setShowMasterLinkSuccessModal] =
      useState(false);
    

    const scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

    console.log(singleScaleData, 'singleScaleData **')

    const handleSelectScore = (score)=>{
      setSelectedScore(score);
  }

    const handleFetchSingleScale = async(scaleId)=>{
      await fetchSingleScaleData(scaleId);
  }
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
        setQrCodeURL(result.qrcodes[0].qrcode_image_url);
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

      const flattenedArray = [].concat(...PublicLinks);

      // Generate modified URLs
      const modifiedUrl = window.location.href.slice(
        0,
        window.location.href.lastIndexOf('/')
      );
      const lastPart = window.location.href.slice(
        window.location.href.lastIndexOf('/') + 1
      );

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


//   const handleSelectScore = (score) => {
//     setSelectedScore(score);
//   };

  const submitResponse = async()=>{

    const payload = {
        username: "Natan",
        scale_id : slug,
        score: selectedScore || 1,
        instance_id: 1,
        brand_name: "brand envue",
        product_name: "envue",
        process_id: "1"
    }

    try {
        setIsLoading(true);
        const response = await saveResponse(payload);
        console.log(response)
       
        // if(response.status===200){
        //     toast.success('successfully updated');
        //     setTimeout(()=>{
        //         navigateTo(`/staple-scale/${singleScaleData[0]?._id}`);
        //     },2000)
        //   }
    } catch (error) {
        console.log(error);
    }finally{
        setIsLoading(false);
    }
  }

  useEffect(() => {
      const fetchData = async () => {
        //   await handleFetchSingleScale(slug);
        try {
            setIsLoading(true);
            const response = await axios.get(`https://100035.pythonanywhere.com/ranking/api/ranking_settings_create?scale_id=${slug}`);
            setSingleScaleData(response.data); 
            console.log(response.data.settings.name)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
      }
      fetchData();
    //   console.log(scale.settings.name)
  }, [slug]);



  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className='flex flex-col items-center justify-center h-screen font-medium font-Montserrat'>
        <div className='w-full px-5 py-4 m-auto border border-primary lg:w-9/12'>
            <div className={`h-80 md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} 
            >
                <div className='flex-1 w-full h-full p-2 border stage lg:w-5/12'>
                    <h3 className='py-5 text-sm font-medium text-center'>Scale Name: {singleScaleData?.settings.name}</h3>
                    <div className='grid grid-cols-4 gap-3 px-2 py-6 bg-gray-300 md:grid-cols-11 md:px-1'>
                        {singleScaleData && (Array.isArray(singleScaleData.settings.fomat) ? singleScaleData.settings?.fomat : scores).map((score, index)=>(
                            <button 
                                key={index}
                                style={{borderRadius:"20%"}}
                                onClick={()=>handleSelectScore(score)}
                                className={` ${selectedScore === score? 'bg-primary text-white'  : 'bg-white text-primary'} text-primary h-[3.8rem] w-[3.8rem]`}
                            >{score}</button>
                        ))}
                    </div>
                    <div className='flex items-center justify-between my-3'>
                        <h4>{singleScaleData?.settings.left}</h4>
                        <h4>{singleScaleData?.settings.right}</h4>
                    </div>
            
                    <div className="flex justify-end gap-3">
                        {/* {singleScaleData && singleScaleData.map((scale, index)=>( */}
                            <Button width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/update-staple-scale/${singleScaleData._id}`)} >update scale</Button>
                        {/* ))} */}
                        <Button width={'3/4'} primary onClick={createMasterLink}>
                {isLoading ? 'Creating Masterlink' : 'Create Masterlink'}
              </Button>
                    </div>
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
        <UpdateNPSLite handleToggleUpdateModal={handleToggleUpdateModal} />
      )}
      {showMasterlinkModal && (
        <NPSMasterlink
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
  )
}

export default StapleScaleSettings