/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import { Button } from '../../../components/button';
import UpdateLikertScale from './UpdateLikertScale';
import LikertScaleMasterink from './LikertScaleMasterink';
import dowellLogo from '../../../assets/dowell-logo.png';
import MasterlinkSuccessModal from '../../../modals/MasterlinkSuccessModal';

const LikertScaleSettings = () => {
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
  const [disableOnMouseEnter, setDisableOnMouseEnter] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const publicLink = queryParams.get('public_link');
  const link_id = queryParams.get('link_id');
  const qrcode_id = queryParams.get('qrcode_id');
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const [buttonBgColor, setButtonBgColor] = useState(false);
  const [btnText, setBtnText] = useState("");
  const navigate = useNavigate()

  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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

  const handleSelectScore = (score, index) => {
    setSelectedScore(index);
    setSelectedIndex(index)
    setDisableOnMouseEnter(true)
    if(disableOnMouseEnter === true) {
      document.getElementById('score-button').removeEventListener('mouseleave', setDisableOnMouseEnter(true));
      document.getElementById('score-button').removeEventListener('mouseenter', setDisableOnMouseEnter(true));
    }
  };

  // const handleFetchSingleScale = async (scaleId) => {
  //   await fetchSingleScaleData(scaleId);
  // };

  const submitResponse = async (e) => {

    e.preventDefault()
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
      score: selectedScore,
      process_id: link_id,
      instance_id: new URLSearchParams(window.location.search).get(
        'instance_id'
      ),
      brand_name: 'Living Lab Scales',
      product_name: 'Living Lab Scales',
      username: new URLSearchParams(window.location.search).get('public_link'),
    };
    console.log(payload, "HHHHH");
    // finalizeMasterlink();

    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://100035.pythonanywhere.com/likert/likert-scale_response/',
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
      toast.error(error);
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
          `https://100035.pythonanywhere.com/likert/likert-scale_create?scale_id=${slug}`
        );
        console.log(response.data.success, "hhhhhhhhhhbbbbbbbbbbbffttt");
        setScale(response.data.success);
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
          `https://100035.pythonanywhere.com/likert/likert-scale_response/662d3490c08f5d3309f29ebc`
        );
        setScaleResponse((response.data));
        setResponse(response.data.success)
        console.log(response.data.success, "hhhhhhhhhhhhhhhhhhhhhhhhhh")
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
        console.log(data.data.qrcode_image_url)
      const result = data.data;
        console.log(result.qrcodes[0].qrcode_image_url)
      if (result.error) {
        setIsLoading(false);
        return;
      } else {
        // Set master link and handle modal toggle
        setMasterLink(result.qrcodes[0].masterlink);
        console.log('result.qrcodes[0].qrcode_id');
        setQrCodeURL(result.qrcodes[0].qrcode_image_url);
        console.log(result.qrcodes[0].qrcode_id,"                 ##ED#E#");
        console.log('result.qrcodes[0].links[0].response.link_id');
        console.log(result.qrcodes[0].qrcode_image_url);
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
      console.log("nnnnnnnnnnnnbbbbbbbbbbb",flattenedArray.length)
      console.log("nnnnnnnnnnnnbbbbbbbbbbb",scale.no_of_scales)
      if(flattenedArray.length < scale.no_of_scales) {
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

  const handleButtonBgColor = (score) => {
    setButtonBgColor(true)
    setBtnText(score)
}

const handleButtonBgColor2 = (score) => {
  setButtonBgColor(false)
  setBtnText(score)
}

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen font-medium" >
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
          className={`w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2 justify-center rounded-lg`}
        >
          <div className="items-center justify-center flex-1 w-full h-full border rounded-lg md:pt-10 md:p-2 stage lg:w-5/12" style={{fontFamily: `${scale?.fontstyle}`, display: scale?.orientation === "Vertical" ? "flex" : "", flexDirection: scale?.orientation === "Vertical" ? "column" : ""}}>
            {scaleResponse.length === 0 && <h3 className="text-sm font-small" style={{fontSize:'medium', marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
            How likely are you to recommend the product to your friends?
            </h3>}
            <div
              className={`grid gap-3 md:gap-3 md:px-2 py-6  bg-${scale?.scalecolor} grid-cols-11 md:px-1 items-center justify-center place-items-center`}
              style={{ backgroundColor: scale?.scalecolor ,display:'flex', flexDirection: scale?.orientation === "Vertical" ? "column" : "",alignItems:'center', justifyContent: 'center', fontSize: 'small', overflow: 'auto', width:scale?.orientation === "Vertical" ? "7rem" : ""}}
            >
              {scale &&
                (scale?.label_input).map(
                  (score, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectScore(score, index)}
                      disabled = {scaleResponse.length === 0 ? false : true}
                      id = "score-button"
                      className={`rounded-lg ${
                        index == selectedScore
                          ? `bg-primary`
                          : `bg-[${scale.round_color}] text-[${scale?.fontcolor}]`
                      }  h-[3rem] w-[5rem] md:h-[3rem] md:w-[5rem]`}
                      onMouseEnter={() => handleButtonBgColor(score)}
                      onMouseLeave = {() => handleButtonBgColor2(score)}
                      style={
                        index == selectedIndex || scaleResponse.score === index
                          ? {
                             backgroundColor: 'green',
                              color: 'white',
                            }
                          : {backgroundColor: buttonBgColor === true && scale?.label_input[index] === btnText ? 'green' : scale?.round_color , color: buttonBgColor === true && scale?.label_input[index] === btnText ? "white" : scale?.fontcolor }
                      }
                    >
                      {score}
                    </button>
                  )
                )}
            </div>
            <div className="flex items-center justify-between my-3">
              <h4
                style={{
                  fontSize: '0.9rem', // Adjust the font size as needed
                  color: '#000000',
                  background: 'transparent',
                  border:
                    selectedScore >= 0 && selectedScore <= 3
                      ? 'none'
                      : 'none',
                  padding: '5px 20px', // Adjust the padding as needed
                  borderRadius: '10px', // Adjust the border radius as needed
                }}
              >
                {scale?.left}
              </h4>
              <h4
                style={{
                  fontSize: '0.9rem',
                  color: '#000000',
                  background: 'transparent',
                  border:
                    selectedScore >= 4 && selectedScore <= 6 ? 'none' : 'none',
                  padding: '5px 20px', // Adjust the padding as needed
                  borderRadius: '10px', // Adjust the border radius as needed
                }}
              >
                {scale?.center}
              </h4>
              <h4
                style={{
                  fontSize: '0.9rem', // Adjust the font size as needed
                  color: '#000000',
                  background: 'transparent',
                  border:
                    selectedScore >= 7 && selectedScore <= 10
                      ? 'none'
                      : 'none',
                  padding: '5px 20px', // Adjust the padding as needed
                  borderRadius: '10px', // Adjust the border radius as needed
                }}
              >
                {scale?.right}
              </h4>
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
            {!isButtonHidden && (
              <div className="flex items-center justify-center my-4">
                {scaleResponse.length === 0 && <Button width={'3/12'} primary onClick={submitResponse}>
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>
               }
              </div>
            )}
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
        <UpdateLikertScale handleToggleUpdateModal={handleToggleUpdateModal} />
      )}
      {showMasterlinkModal && (
        <LikertScaleMasterink
          handleToggleMasterlinkModal={handleToggleMasterlinkModal}
          link={masterLink}
          publicLinks={publicLinks}
          image={qrCodeURL}
        />
      )}
    </div>
  );
};

export default LikertScaleSettings;
