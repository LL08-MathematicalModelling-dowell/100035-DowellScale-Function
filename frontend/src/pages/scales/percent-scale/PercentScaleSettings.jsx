import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios, { all } from "axios";
import dowellLogo from '../../../assets/dowell-logo.png';
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
  const [sliderValues,setSliderValues]= useState([])
  const [sliderValue,setSliderValue] = useState([])
  const [firstVal,setFirstVal] = useState()
  // const[sliderValue2,setSliderValue2] = useState([])
    const { slug } = useParams();
    const [scale, setScale] = useState(null);
    const [selectedScore, setSelectedScore] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const saveResponse = useSaveResponse();
    const navigateTo = useNavigate();
    const [instance,setInstance] = useState(false)
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
    const[scaleResponse,setScaleResponse] = useState()
    const [isButtonHidden, setIsButtonHidden] = useState(false);
    const [response,setResponse] = useState()
    const navigate = useNavigate()

    // let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let currentUserInstance = new URLSearchParams(window.location.search).get(
      'instance_id'
    )
  
    console.log(scale, 'scale**')


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
    
    valuesSubArray = sliderValue.map(item => item[1]);
    console.log(valuesSubArray)
    const parsedSliderVal = valuesSubArray.flat().map(val => parseInt(val));

// Create the new array with firstVal followed by sliderVal elements
const newArr = [parseInt(firstVal),parseInt(...valuesSubArray)];
    console.log(newArr)
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
console.log(pub_links.data)
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
      console.log("nnnnnnnnnnnnbbbbbbbbbbb",scale?.settings?.no_of_scales)
      if(flattenedArray.length < scale?.settings?.no_of_scales) {
       return toast.error('Insufficient public members');
      }
      console.log(scale.settings.no_of_scales)
      for (
        let i = 0;
        i < scale.settings.no_of_scales && i < flattenedArray.length;
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
      console.log(error)
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
    let valuesSubArray = sliderValue.map(item => item[1]);
    const arr = [firstVal,...valuesSubArray];
     const newArr = arr.map(item => parseInt(item));
    // if(newArr.length !== scale?.settings?.product_names)
    // {
    //   toast.error("Rate the scales First!")

    // }
    // else{
      console.log(new URLSearchParams(window.location.search).get(
        'instance_id'
      ))
console.log(newArr)

    const payload = {
     
      scale_id : scale._id, // scale_id of scale the response is being made to
      username : "pfactorial", // your username
      brand_name : "dowell",
      product_name : "workflowAI",
      instance_id : new URLSearchParams(window.location.search).get(
          'instance_id'),
      process_id : "1",
      score :newArr // score for each product
     
      // scale_id: scale._id, // scale_id of scale settings this response is for
      // score: newArr, // score for each product in the product list
      //   // total must not exceed 100
      // username: "natan", // name of user
      // instance_id: new URLSearchParams(window.location.search).get(
      //   'instance_id'
      // ),
      
      // process_id: "1",
      // brand_name: "envue",
      // product_name: "testprod"
      
    };
    console.log(payload);
    console.log("processID:",link_id)
    // finalizeMasterlink();

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://100035.pythonanywhere.com/percent/api/percent_responses_create/",
        // 'https://100035.pythonanywhere.com/api/nps_responses_create',
        payload
      );
      const result = response.data;
      console.log(result);
      if (result.error) {
        setIsLoading(false);
        toast.error("error")
        return;
      } else {
        handleButtonHideClick();
        toast.success('Response has been saved');
        finalizeMasterlink();
      }
    } catch (error) {
      console.log(error.response.data)
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  // }
  };
  useEffect(() => {

    const fetchResponseData = async () => {
      //   await handleFetchSingleScale(slug);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://100035.pythonanywhere.com/percent/api/percent_responses_create?scale_id=${slug}`
        );
        
        console.log(currentUserInstance)
        console.log("L",response.data.data.score.instance_id.charAt(0))
        // (response.data.data.data).map((value) =>{
          if((response.data.data.process_id) === link_id) {
            setScaleResponse((response.data.data.score));
          }
          if(response.data.data.score.instance_id.charAt(0) === currentUserInstance) {
            setInstance(true)
          }
          
        
        // })

        setResponse(response.data)
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if(publicLink) {
      fetchResponseData();
    }
  }, [slug,publicLink]);

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
            setScores(newArray);
            console.log(response.data)
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
let valuesSubArray=[]
  const handleChange = (e,index) =>{
    if(index===0)
    {
        setFirstVal(e.target.value)
        console.log(e.target.value)
    }
    else{
    const value = e.target.value
    const existingIndex = sliderValue.findIndex(item => item[0] === index);
    

    if (existingIndex !== -1) {
      // If the index exists, update its corresponding value
      const updatedSliderValue = [...sliderValue];
      updatedSliderValue[existingIndex] = [index, value];
      setSliderValue(updatedSliderValue);
      setSliderValues(updatedSliderValue.map(m=>m[1]))
      console.log(sliderValues)
    } else {
      // If the index doesn't exist, add a new entry to sliderValue
      setSliderValue([...sliderValue, [index, value]]);
      setSliderValues([...sliderValues,value])
      console.log(sliderValues)
    }
    console.log(sliderValue)
     valuesSubArray = sliderValue.map(item => item[1]);
    console.log(valuesSubArray)
  }
  }
      {/* scale && (Array.isArray(scale?.[0]?.settings?.fomat) ? scale?.[0]?.settings?.fomat : scores).map((score, index)=>( */}
  return (
    <div className="flex flex-col items-center justify-center h-screen font-medium" >
     {publicLink && (
        <img
          src={dowellLogo}
          alt="Dowell Logo"
          className="cursor-pointer w-52"
        />
      )}
        <div className='w-full px-5 py-4 m-auto  lg:w-9/12'>
            <div className={`h-80 md:h-80 w-full  mb-28 flex flex-col lg:flex-row items-center shadow-lg p-2`} style={{blockSize: "fit-content"}}
            >
                <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                    <h3 className='text-center py-5 text-sm font-medium'>{scale?.settings?.name}</h3>
                    <div className='flex justify-center md:grid-cols-11 gap-3 bg-gray-300 py-6 px-2 md:px-1 az' >
                    <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2' >
                    <div style={{display:"flex",justifyContent:"center"}}>
                    
                    </div>
                <h1 style={{textAlign:'center'}}>Percent Scale</h1>
                <div  style={{ display: scale?.settings.orientation === "Vertical" && "flex", justifyContent: "center" }}>
                {
                scale?.settings?.product_names && scale?.settings?.product_names.map((m, index) => (
                  <div style={{display: scale?.settings.orientation === "Vertical" && "flex"}}>
                    <input
                      type="range" disabled={instance}
                      min="0"
                      max="100"
                      onChange={e=>handleChange(e,index)}
                      style={{
                        accentColor: scale?.settings.scale_color,
                        WebkitAppearance: scale?.settings.orientation === "Vertical" ? 'slider-vertical' : "slider-horizontal",
                        height: scale?.settings.orientation === "Vertical" && "100%",
                        width: scale?.settings.orientation === "Horizontal" && "100%",
                      }}
                    />
                    <div style={{display:scale?.settings.orientation === "Vertical" ? "grid" : "flex",justifyContent:"space-between"}}>
                    { scale?.settings.orientation === "Vertical" ? <><h4>{index===0 ? firstVal  : sliderValues[index-1]}</h4><h4>{m}</h4><h4>{0}</h4></>
                    : <><h4>{0}</h4><h4>{m}</h4><h4>{index===0 ? firstVal  : sliderValues[index-1]}</h4></>
                    }
                    </div>
                  </div>
                ))
}
</div>
                </div>                  </div>
                  
                    <div className="flex gap-3 justify-end">
                        {!publicLink && (
            <>
            <Button width={'3/4'} onClick={()=>navigate(`/100035-DowellScale-Function/generate-report/${slug}`)}>
              Generate Report
              </Button>
              <Button  onClick={handleToggleUpdateModal}>
              Update scale
              </Button>
              <Button  primary onClick={createMasterLink}>
                {isLoading ? 'Creating Masterlink' : 'Create Masterlink'}
              </Button>
            </>
          )}
          {publicLink && (
          <>
            {!isButtonHidden && (
              <div className="flex items-center justify-center my-4" >
                {!instance && <Button primary onClick={submitResponse}>
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>
               }
              </div>
            )}
          </>
        )}
          {/* {publicLink && (
          <>
            {!isButtonHidden && (
              <div className="flex items-center justify-center my-4" style={{paddingBottom:"2%"}}>
                <Button  primary onClick={submitResponse}>
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>
              </div>
            )}
          </>
        )} */}
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