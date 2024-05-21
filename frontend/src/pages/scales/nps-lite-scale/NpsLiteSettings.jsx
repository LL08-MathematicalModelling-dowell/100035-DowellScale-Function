/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import { Button } from '../../../components/button';
import UpdateNpsLite from './UpdateNpsLite';
import NPSLiteMasterLink from './NPSLiteMasterLink';
import dowellLogo from '../../../assets/dowell-logo.png';
import MasterlinkSuccessModal from '../../../modals/MasterlinkSuccessModal';
import ChannelNames from '../../../components/data/ChannelNames';

const NpsLiteSettings = () => {
  const { slug } = useParams();
  const [userInfo, setUserInfo] = useState();

  // const [searchParams] = useSearchParams();
  // const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showMasterLinkSuccessModal, setShowMasterLinkSuccessModal] =
    useState(false);
  const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
  const [masterLink, setMasterLink] = useState('');
  const [qrCodeURL, setQrCodeURL] = useState('');
  const [qrCodeId, setQrCodeId] = useState('');
  const [scale, setScale] = useState(null);
  const [scaleResponse, setScaleResponse] = useState([]);
  const [response, setResponse] = useState(null);
  const [publicLinks, SetpublicLinks] = useState(null);
  const [selectedScore, setSelectedScore] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const publicLink = queryParams.get('scale_type');
  const link_id = queryParams.get('link_id');
  const qrcode_id = queryParams.get('qrcode_id');
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const [scaleArr, setScaleArr] = useState([])
  const [instance, setInstance] = useState(false)
  const navigate = useNavigate()
  const userinfo = JSON.parse(sessionStorage.getItem('userInfo'));

  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let currentUserInstance = new URLSearchParams(window.location.search).get(
    'instance_id'
  )

  const handleButtonHideClick = () => {
    // Perform the click action

    // Hide the button after one click
    setIsButtonHidden(true);
  };

  const handleToggleUpdateModal = () => {
    ChannelNames.length = 0
    setShowUpdateModal(!showUpdateModal);
  };

  const handleToggleMasterlinkModal = () => {
    setShowMasterlinkModal(!showMasterlinkModal);
  };
  
  const handleToggleMasterlinkSuccessModal = () => {
    setShowMasterLinkSuccessModal(!showMasterLinkSuccessModal);
  };

  const handleSelectScore = (index) => {
      setSelectedScore(index + 1);
      setSelectedIndex(index + 1)

    submitResponse()
  };

  // const handleFetchSingleScale = async (scaleId) => {
  //   await fetchSingleScaleData(scaleId);
  // };

  const submitResponse = async (index) => {
    // e.preventDefault()
    // const info = await axios.post(
    //   'https://100093.pythonanywhere.com/api/userinfo/',
    //   {
    //     // session_id: "p1frwekqkwq05ia3fajjujwgvjjz1ovy",
    //     session_id: sessionStorage.getItem('session_id'),
    //   }
    // );

    // const result = info.data;
    // console.log(result.userinfo);
    // setUserInfo(result.userinfo);

    const payload = {
      scale_id: slug,
      score: index,
      workspace_id: new URLSearchParams(window.location.search).get('workspace_id'),
      username: new URLSearchParams(window.location.search).get('username'),
      user_type: new URLSearchParams(window.location.search).get('user'),
      scale_type: new URLSearchParams(window.location.search).get('scale_type'),
      channel: new URLSearchParams(window.location.search).get('channel'),
      instance: new URLSearchParams(window.location.search).get('instance'),
       };
    console.log(payload);
    // finalizeMasterlink();

    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://100035.pythonanywhere.com/nps-lite/api/v4/nps-lite-create-response/',
        payload
      );
      const result = response.data;

      console.log(result.success);
      if (result.error) {
        setIsLoading(false);
        return;
      } else {
        handleButtonHideClick();
        toast.success(result.message);
        finalizeMasterlink();
        console.log(result.redirect_url)
        window.location.replace(result.redirect_url);
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
    // const session_id = searchParams.get('session_id');
    // console.log(window.location.href);
    // if (!session_id) {
    //   window.location.href =
    //     'https://100014.pythonanywhere.com/?redirect_url=' +
    //     `${window.location.href}`;
    //   return;
    // }
    // // getUserInfo();
    // sessionStorage.setItem('session_id', session_id);

    const fetchData = async () => {
      //   await handleFetchSingleScale(slug);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://100035.pythonanywhere.com/nps-lite/api/v4/nps-lite-create-scale/?scale_id=${slug}`
        );
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhttttttt",response.data.settings);
        setScale(response.data.settings);
        let arr = []
        arr.push('🙁No')
        arr.push('🙂Maybe')
        arr.push('😃Yes')
        setScaleArr(arr)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {

    const fetchResponseData = async () => {
      //   await handleFetchSingleScale(slug);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://100035.pythonanywhere.com/nps-lite/api/nps-lite-response?id=${slug}`
        );
        
        (response.data.data.data).map((value) =>{
          if((value.process_id) === link_id) {
            setScaleResponse((value.score));
          if((value.score.instance_id).charAt(0) === currentUserInstance) {
            setInstance(true)
          }else {
            setInstance(false)
          }
        }
        })

        setResponse(response.data)
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if(publicLink) {
      fetchResponseData();
    }
  }, [slug]);
  
  console.log("This is the scale response", scaleResponse.score)
  console.log("This is the scale score", response)
  console.log("HHHHHHHHHHHHHHH",scaleArr)
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
      // const pub_links = await axios.post(
      //   'https://100093.pythonanywhere.com/api/userinfo/',
      //   {
      //     // session_id: "p1frwekqkwq05ia3fajjujwgvjjz1ovy",
      //     session_id: sessionStorage.getItem('session_id'),
      //   }
      // );

      // const result = pub_links.data;
      // console.log(result, "hhhhhhhhhhhhhhhhhhhhhhhhhb")
      // setUserInfo(result.userinfo);
      
      // const PublicLinks = [];
      const all_public_links = [];

      // Extract public links from user portfolio
      // result.selected_product.userportfolio.forEach((portfolio) => {
      //   if (
      //     portfolio.member_type === 'public' &&
      //     product === 'Living Lab Scales'
      //   ) {
      //     PublicLinks.push(portfolio.username);
      //   }
      // });

      // const flattenedArray = [].concat(...PublicLinks);

      // Generate modified URLs
      const modifiedUrl = window.location.href.slice(
        0,
        window.location.href.lastIndexOf('/')
      );
      const lastPart = window.location.href.slice(
        window.location.href.lastIndexOf('/') + 1
      );
      console.log(userinfo.userinfo.client_admin_id, "YYYYYYYYYYY")
      // console.log("nnnnnnnnnnnnbbbbbbbbbbb",flattenedArray.length)
      console.log("nnnnnnnnnnnnbbbbbbbbbbb",scale.scale_configs.no_of_responses)
      
      // if(flattenedArray.length < scale.scale_configs.no_of_responses) {
      //  return toast.error('Insufficient public members');
      // }
      
      let scaleCount = 0
      for (
        let i = 0;
        i < scale.scale_configs.no_of_responses;
        i++
      ) {
        for (
          let j = 0;
          j < (scale.scale_configs.channel_instance_list).length;
          j++
        ) {

          for (
            let k = 0;
            k < (scale.scale_configs.channel_instance_list[j]).instances_details.length;
            k++
          ) {
            scaleCount++
        // Append the current element to the current window.location.href
        const newUrl = `${modifiedUrl}/${lastPart}/?instance_id=${scaleCount}&user=${scale.scale_configs.user_type}&scale_type=${scale.scale_configs.scale_type}&channel=${(scale.scale_configs.channel_instance_list)[j].channel_name}&instance=${scale.scale_configs.channel_instance_list[j].instances_details[k].instance_name}&workspace_id=${userinfo.userinfo.client_admin_id}&username=${userinfo.userinfo.username}&scale_id=${slug}`;
        // const newUrl = `${modifiedUrl}/${flattenedArray[i]}/?public_link=${lastPart}`;
        all_public_links.push(newUrl);
      }
      }
      }

      SetpublicLinks(all_public_links);
    } catch (error) {
      setIsLoading(false);
      toast.error('Insufficient public members');
      // console.log("Error", "Insufficient public members");
    }
  };

  const handleMouseEnter = (index) =>{
    if(index === 0) {
      const btn = document.getElementById(0)
      btn.title = scale?.left
    } else if(index === 6) {
      const btn = document.getElementById(6)
      btn.title = scale?.center
    } else if(index === 10) {
      const btn = document.getElementById(10)
      btn.title = scale?.right
    }
  }
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

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <div className="flex flex-col items-center justify-center font-medium">
      {publicLink && (
        <img
          src={dowellLogo}
          alt="Dowell Logo"
          className="cursor-pointer w-52"
        />
      )}
      <div className="w-full py-4 m-auto md:px-5 lg:w-7/12">
        <h1 className="py-5 text-[2rem] font-small text-center">{scale?.name}</h1>
        <div
          className={`w-5/6  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2 justify-center rounded-lg`}
        >
          <div className="items-center justify-center flex-1 w-full h-full rounded-lg md:pt-10 md:p-2 stage lg:w-5/12 md:font-bold" style={{fontFamily: `${scale?.scale_customizations?.fontstyle}`, display: scale?.scale_customizations?.orientation === "Vertical" ? "flex" : "", flexDirection: scale?.scale_customizations?.orientation === "Vertical" ? "column" : ""}}>
            {scaleResponse.length === 0 && <h3 className="text-xl" style={{fontSize:'medium', marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
            Do you wish to recommend this application to your friends?
            </h3>}
            <div
              className={`text-sm/[17px] grid  gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center`}
              style={{display:'flex', flexDirection: scale?.scale_customizations?.orientation === "Vertical" ? "column" : "", alignItems:'center', justifyContent: 'center', overflow: 'auto', width:scale?.scale_customizations?.orientation === "Vertical" ? "50%" : "", borderRadius:"8px"}}
            >
              {scale &&  
                scaleArr.map((score, index) =>(
                  <button
                      key={index}
                      id = {index}
                      onClick={() => submitResponse(index)}
                      disabled = {scaleResponse.length === 0 ? false : true}
                      className={`rounded-lg ${index  === selectedScore
                        ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[3.8rem] font-size:1rem`}
                      style={
                        index == selectedIndex || (scaleResponse.score -1) === index && instance
                        ? {
                           backgroundColor: 'green',
                            color: 'white', width: '30%'
                          }
                        : {  backgroundColor: scale?.scale_customizations?.scalecolor, color: scale?.scale_customizations?.fontcolor, width: '30%' }
                      }
                    >
                      {score}
                    </button>
                ))}
            </div>

            {/* <div className="flex items-center justify-between my-3">
              <h4>{scale?.left}</h4>
              <h4>{scale?.center}</h4>
              <h4>{scale?.right}</h4>
            </div> */}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          {!publicLink && (
            <>
            <Button width={'3/4'} onClick={()=>navigate(`/100035-DowellScale-Function/generate-report/${slug}`)}>
              Generate Report
              </Button>
              <Button width={'3/4'} onClick={handleToggleUpdateModal}>
              Update scale
              </Button>
              <Button width={'3/4'} primary onClick={createMasterLink}>
                {isLoading ? 'Creating Masterlink' : 'Create Masterlink'}
              </Button>
            </>
          )}
        </div>
        {publicLink && (
          <>
            {/* {!isButtonHidden && (
              <div className="flex items-center justify-center my-4">
                {!instance && <Button width={'3/12'} primary onClick={submitResponse}>
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>
               }
              </div>
            )} */}
          </>
        )}
      </div>
      {showMasterLinkSuccessModal && (
        <MasterlinkSuccessModal
          handleToggleMasterlinkSuccessModal={
            handleToggleMasterlinkSuccessModal
          }
        />
      )}
      {showUpdateModal && (
        <UpdateNpsLite handleToggleUpdateModal={handleToggleUpdateModal} />
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
  );
};

export default NpsLiteSettings;