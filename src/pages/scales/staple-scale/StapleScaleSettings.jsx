import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import { useSaveStapleScaleResponse } from "../../../hooks/useSaveStapleScaleResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";
import StapelMasterLink from "./StapelMasterLink";
import dowellLogo from '../../../assets/dowell-logo.png';
import MasterlinkSuccessModal from "../../../modals/MasterlinkSuccessModal";

const StapleScaleSettings = () => {
    const { slug } = useParams();
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState();
    // const { loading, singleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const[singleScaleData,setSingleScaleData] = useState()
    const [scale, setScale] = useState(null);
    const [selectedScore, setSelectedScore] = useState();
    const [isLoading, setIsLoading] = useState(false);
    // const [loading, setLoading] = useState(false);
    const saveResponse = useSaveStapleScaleResponse();
    const [scaleResponse, setScaleResponse] = useState([]);
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
    const  [response, setResponse] = useState([]);
    const [instance, setInstance] = useState(false)
    let currentUserInstance = new URLSearchParams(window.location.search).get(
      'instance_id'
    )
    
const [score,setScore] =useState()
    // const scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
console.log(score)
    // console.log(singleScaleData.settings.scale, 'singleScaleData **')

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
      console.log("result", result)
      setQrCodeURL(result.qrcodes[0].qrcode_image_url);

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
    let product = 'Living Lab Scales'
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
      console.log(result, "hhhhhhhhhhhhhhhhhhhhhhhhhb")
      setUserInfo(result.userinfo);
      
      const PublicLinks = [];
      const all_public_links = [];

      // Extract public links from user portfolio
      result.selected_product.userportfolio.forEach((portfolio) => {
        if (
          portfolio.member_type === 'public' &&
          product === 'Living Lab Scales'
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
      console.log("nnnnnnnnnnnnbbbbbbbbbbb", flattenedArray.length)
      console.log("nnnnnnnnnnnnbbbbbbbbbbb", singleScaleData?.settings.no_of_scales)
      if(flattenedArray.length < singleScaleData?.settings.no_of_scales) {
       return toast.error('Insufficient public members');
      }
      for (
        let i = 0;
        i < singleScaleData?.settings.no_of_scales && i < flattenedArray.length;
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
      console.log(all_public_links)
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
        score: selectedScore,
        instance_id: new URLSearchParams(window.location.search).get(
          'instance_id'),
        brand_name: "brand envue",
        product_name: "envue",
        process_id: link_id
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

  const handleMouseEnter = (index) =>{
    if(index === 0) {
      const btn = document.getElementById(0)
      btn.title = singleScaleData?.settings.left
    } else if(index === ((singleScaleData?.settings.scale).length) - 1) {
      const btn = document.getElementById(((singleScaleData?.settings.scale).length) - 1)
      btn.title = singleScaleData?.settings.right
    }
  }

  useEffect(() => {
      const fetchData = async () => {
        //   await handleFetchSingleScale(slug);
        try {
            setIsLoading(true);
            const response = await axios.get(`https://100035.pythonanywhere.com/ranking/api/ranking_settings_create?scale_id=${slug}`);
            setSingleScaleData(response.data); 
            console.log(response.data.settings,'s')
            setScore(response.data.settings.scale)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
      }
      if(!score)
      fetchData();
    //   console.log(scale.settings.name)
  }, [slug,score]);

  useEffect(() => {

    const fetchResponseData = async () => {
      //   await handleFetchSingleScale(slug);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://100035.pythonanywhere.com/stapel/api/stapel_responses_create?scale_id=${slug}`
        );

        // console.log(response.data.data.data, "SSSSSSSSSSSSSSSSSSS")
        (response.data.data.data).map((value) =>{
          if((value.process_id) === link_id) {
            setScaleResponse((value.score));
            console.log(value.process_id, "YYYYYYYYYYYYYYYYYYYYYYYY")
          if((value.score.instance_id).charAt(0) === currentUserInstance) {
            setInstance(true)
          }else {
            setInstance(false)
          }
        }
        })

        setResponse((response.data.data.data))
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if(publicLink) {
      fetchResponseData();
    }
  }, [slug]);


console.log(instance, "TTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
  // if (isLoading) {
  //   return <Fallback />;
  // }
  return (
    <div className='h-screen flex flex-col items-center justify-center font-medium font-Montserrat'>
      {publicLink && (
        <img
          src={dowellLogo}
          alt="Dowell Logo"
          className="cursor-pointer w-52"
        />
      )}
        <div className=' py-4 m-auto border border-primary ' style={{marginTop: singleScaleData?.settings.orientation === "Vertical" ? "40px" : "", display: singleScaleData?.settings.orientation === "Vertical" ? "flex" : "", flexDirection: singleScaleData?.settings.orientation === "Vertical" ? "column" : "", alignItems: 'center'}}>
          <div className='flex-1 w-full h-full p-2 border stage' style={{fontFamily: `${singleScaleData?.settings.fontstyle}`, display: singleScaleData?.settings.orientation === "Vertical" ? "flex" : "", flexDirection: singleScaleData?.settings.orientation === "Vertical" ? "column" : "", alignItems: 'center'}}>
              <h3 className='py-5 text-sm font-medium text-center'>How likely are you to recommend the product to your friends?</h3>
              <div className='`grid gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center' style={{ backgroundColor: singleScaleData?.settings.scalecolor, display:'flex', flexDirection: singleScaleData?.settings.orientation === "Vertical" ? "column" : "",alignItems:'center', justifyContent: 'center', fontSize: 'small', overflow: 'auto', width: singleScaleData?.settings.orientation === "Vertical" ? "7rem" : ""}}>
                        {singleScaleData && singleScaleData?.settings.fomat !== 'emoji' ?  score?.map((sco, index)=>(
                            <button 
                                key={index}
                                id= {index}
                                // style={{borderRadius:"20%",width:"2em",height:"2em",alignItems:"center",marginTop:"1.5em"}}
                                onClick={()=>handleSelectScore(sco)}
                                className={`rounded-lg ${
                                  score[index] == selectedScore
                                    ? `bg-primary`
                                    : `bg-[${singleScaleData?.settings.roundcolor}] text-[${singleScaleData?.settings.fontcolor}]`
                                }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
                                style={
                                  score[index] === selectedScore || (scaleResponse.score === score[index]) && instance
                                    ? {
                                       backgroundColor: 'green',
                                        color: 'white',
                                      } 
                                    : {backgroundColor: singleScaleData?.settings.roundcolor, color: singleScaleData?.settings?.fontcolor}
                                }

                                onMouseEnter={() => {singleScaleData?.settings.orientation === "Vertical" ? handleMouseEnter(index) : ""}}
                            >{sco}</button>
                        )): score?.map((sco, index)=>(
                          <button 
                              key={index}
                              id={index}
                              // style={{borderRadius:"20%",width:"2em",height:"2em",alignItems:"center",marginTop:"1.5em"}}
                              onClick={()=>handleSelectScore(sco)}
                              className={`rounded-lg ${
                                score[index] == selectedScore
                                  ? `bg-primary`
                                  : `bg-[${singleScaleData?.settings.roundcolor}] text-[${singleScaleData?.settings.fontcolor}]`
                              }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
                              style={
                                score[index] === selectedScore || (scaleResponse.score === score[index])
                                  ? {
                                     backgroundColor: 'green',
                                      color: 'white',
                                    } 
                                  : {backgroundColor: singleScaleData?.settings.roundcolor, color: singleScaleData?.settings?.fontcolor}
                              }
                              onMouseEnter={() => {singleScaleData?.settings.orientation === "Vertical" ? handleMouseEnter(index) : ""}}
                          >{(singleScaleData?.settings.custom_emoji_format)[index]}</button>
                      ))}
                    </div>
                    {
                    singleScaleData?.settings.orientation !== "Vertical" && <div className='flex items-center justify-between my-3'>
                        <h4>{singleScaleData?.settings.left}</h4>
                        <h4>{singleScaleData?.settings.right}</h4>
                    </div>
                    }
            
                    {!publicLink && <div className="w-full flex justify-end gap-3">
                        {/* {singleScaleData && singleScaleData.map((scale, index)=>( */}
            <Button width={'3/4'} onClick={()=>navigate(`/100035-DowellScale-Function/generate-report/${slug}`)}>
              Generate Report
              </Button>
                            <Button width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/update-staple-scale/${singleScaleData._id}`)} >update scale</Button>
                        {/* ))} */}
                        <Button width={'3/4'} primary onClick={createMasterLink}>
                {isLoading ? 'Creating Masterlink' : 'Create Masterlink'}
              </Button>
                    </div>}
                    {publicLink && (
          <>
            {!isButtonHidden && (
              <div className="flex items-center justify-center my-4">
                {
                !instance &&<Button primary onClick={submitResponse}>
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>
                }
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
        <StapelMasterLink
          handleToggleMasterlinkModal={handleToggleMasterlinkModal}
          link={masterLink}
          publicLinks={publicLinks}
          image={qrCodeURL}
        />
      )}
  
                </div>
            
        </div>
    </div>
  )
}

export default StapleScaleSettings