import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import useGetSingleScale from '../../../hooks/useGetSingleScale';
import { useSaveResponse } from '../../../hooks/useSaveResponse';
import Fallback from '../../../components/Fallback';
import { Button } from '../../../components/button';
import UpdateNPSScale from './UpdateNPSScale';
import NPSMasterlink from './NPSMasterlink';
import dowellLogo from '../../../assets/dowell-logo.png';
import MasterlinkSuccessModal from '../../../modals/MasterlinkSuccessModal';

const NPSScaleSettings = () => {
  const { slug } = useParams();
  const [userInfo, setUserInfo] = useState();

  // const [searchParams] = useSearchParams();
  // const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showMasterLinkSuccessModal, setShowMasterLinkSuccessModal] =
    useState(false);
  const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
  const [masterLink, setMasterLink] = useState('');
  const [qrCodeId, setQrCodeId] = useState('');
  const [scale, setScale] = useState(null);
  const [publicLinks, SetpublicLinks] = useState(null);
  const [selectedScore, setSelectedScore] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const saveResponse = useSaveResponse();
  const navigateTo = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const publicLink = queryParams.get('public_link');
  const link_id = queryParams.get('link_id');

  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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

  const handleFetchSingleScale = async (scaleId) => {
    await fetchSingleScaleData(scaleId);
  };

  const submitResponse = async () => {
    const info = await axios.post(
      'https://100093.pythonanywhere.com/api/userinfo/',
      {
        session_id: '28ceuiogadioveenkuxiy76em0x4bgdy',
        // sessionStorage.getItem("session_id")
      }
    );

    const result = info.data;
    setUserInfo(result.userinfo);
    
    const payload = {
      scale_id: slug,
      score: selectedScore,
      process_id: 'process_id879895',
      instance_id: 1,
      brand_name: 'question',
      product_name: 'answer',
      username: qrCodeId,
    };
    console.log(payload);
    finalizeMasterlink();

    // try {
    //   setIsLoading(true);
    //   const response = await axios.post(
    //     'https://100035.pythonanywhere.com/api/nps_responses_create',
    //     payload
    //   );
    //   console.log(response.data);
    //   if (response.data.success === 'true') {
    //     toast.success('successfully updated');
    //     finalizeMasterlink();
    //   }
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const finalizeMasterlink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `https://www.qrcodereviews.uxlivinglab.online/api/v3/masterlink/?link_id=${link_id}`
      );
      console.log(response.response.data);
      // if (response.error) {
      //   setIsLoading(false);
      //   toast.error(response.message);
      //   return;
      // } else {
      //   // Set master link and handle modal toggle
      //   setIsLoading(false);
      //   handleToggleMasterlinkSuccessModal();

      //   toast.success(response.response);
      // }
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
          `https://100035.pythonanywhere.com/api/nps_create/?scale_id=${slug}`
        );
        console.log(response.data.success);
        setScale(response.data.success);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

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
        setQrCodeId(result.qrcodes[0].qr_code_id);
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

    try {
      // Fetch user information
      const pub_links = await axios.post(
        'https://100093.pythonanywhere.com/api/userinfo/',
        {
          session_id: '28ceuiogadioveenkuxiy76em0x4bgdy',
          // sessionStorage.getItem("session_id")
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
        const newUrl = `${modifiedUrl}/${lastPart}/?public_link=${flattenedArray[i]}`;
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

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen font-medium font-Montserrat">
      {publicLink && (
        <img
          src={dowellLogo}
          alt="Dowell Logo"
          className="cursor-pointer w-52"
        />
      )}
      <div className="w-full px-5 py-4 m-auto border border-primary lg:w-9/12">
        <div
          className={`h-80 md:h-80 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`}
        >
          <div className="flex-1 w-full h-full p-2 border stage lg:w-5/12">
            <h3 className="py-5 text-sm font-medium text-center">
              Scale Name: {scale?.name}
            </h3>
            <div
              className={`grid grid-cols-4 gap-3 px-2 py-6  bg-${scale?.scalecolor} md:grid-cols-11 md:px-1`}
              style={{ backgroundColor: scale?.scalecolor }}
            >
              {scale &&
                (Array.isArray(scale?.fomat) ? scale.fomat : scores).map(
                  (score, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectScore(score)}
                      className={`rounded-full ${
                        index > selectedScore
                          ? `bg-[${scale.roundcolor}]`
                          : `bg-primary text-[${scale?.fontcolor}]`
                      } text-[${scale?.fontcolor}] h-[3.8rem] w-[3.8rem]`}
                      style={
                        index > selectedScore
                          ? {
                              backgroundColor: scale?.roundcolor,
                              color: scale?.fontcolor,
                            }
                          : { color: 'white' }
                      }
                    >
                      {score}
                    </button>
                  )
                )}
            </div>
            <div className="flex items-center justify-between my-3">
              <h4>{scale?.left}</h4>
              <h4>{scale?.center}</h4>
              <h4>{scale?.right}</h4>
            </div>

            <div className="flex justify-end gap-3">
              {!publicLink && (
                <>
                  <Button width={'3/4'} onClick={handleToggleUpdateModal}>
                    update scale
                  </Button>
                  <Button width={'3/4'} primary onClick={createMasterLink}>
                    {isLoading ? 'Creating Masterlink' : 'Create Masterlink'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        {publicLink && (
          <div className="flex items-center justify-center my-4">
            <Button width={'1/2'} primary onClick={submitResponse}>
              {isLoading ? 'Saving' : 'Save'}
            </Button>
          </div>
        )}
      </div>
      {showMasterLinkSuccessModal && (
        <MasterlinkSuccessModal
          handleToggleMasterlinkModal={handleToggleMasterlinkSuccessModal}
        />
      )}
      {showUpdateModal && (
        <UpdateNPSScale handleToggleUpdateModal={handleToggleUpdateModal} />
      )}
      {showMasterlinkModal && (
        <NPSMasterlink
          handleToggleMasterlinkModal={handleToggleMasterlinkModal}
          link={masterLink}
          publicLinks={publicLinks}
        />
      )}
    </div>
  );
};

export default NPSScaleSettings;
