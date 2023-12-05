import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useGetSingleScale from '../../../hooks/useGetSingleScale';
import { useSaveResponse } from '../../../hooks/useSaveResponse';
import Fallback from '../../../components/Fallback';
import { Button } from '../../../components/button';
import UpdateNPSScale from './UpdateNPSScale';
import NPSMasterlink from './NPSMasterlink';

const NPSScaleSettings = () => {
  const { slug } = useParams();
  // const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
  const [masterLink, setMasterLink] = useState('');
  const [scale, setScale] = useState(null);
  const [selectedScore, setSelectedScore] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const saveResponse = useSaveResponse();
  const navigateTo = useNavigate();

  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleToggleUpdateModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };
  const handleToggleMasterlinkModal = () => {
    setShowMasterlinkModal(!showMasterlinkModal);
  };

  const handleSelectScore = (score) => {
    setSelectedScore(score);
  };

  const handleFetchSingleScale = async (scaleId) => {
    await fetchSingleScaleData(scaleId);
  };

  const submitResponse = async () => {
    const payload = {
      // document_responses: [
      //     {
      //         scale_id:slug,
      //         score:10
      //     },
      //     {
      //         scale_id:"64f6fc2c7ab91b2af12c3958",
      //         score:10
      //     }],
      // instance_id:1,
      // brand_name:"question",
      // product_name:"answer",
      // username: "tall",
      // action: "document",
      // authorized: "Ambrose",
      // cluster: "Documents",
      // collection: "CloneReports",
      // command: "update",
      // database: "Documentation",
      // document: "CloneReports",
      // document_flag: "processing",
      // document_right: "add_edit",
      // field: "document_name",
      // function_ID: "ABCDE",
      // metadata_id: "64f568426bcc87ef0c75d43c",
      // process_id: "64f5683c3270cf0e74824fe7",
      // role: "single step role",
      // team_member_ID: "1212001",
      // content: "",
      // document_name: "name",
      // page: "",
      // user_type: "public",
      // _id: slug,

      user: 'natan',
      scale_id: '64afe7d3aad77b181847190a',
      event_id: '1689249744727624',
      scale_category: 'npslite scale',
      response: '9',
    };

    try {
      setIsLoading(true);
      const response = await saveResponse(payload);
      console.log(response);
      // if(status===200){
      //     toast.success('successfully updated');
      //     setTimeout(()=>{
      //         navigateTo(`/nps-scale/${sigleScaleData[0]?._id}`);
      //     },2000)
      //   }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      //   await handleFetchSingleScale(slug);
      try {
        setLoading(true);
        const response = await axios.get(
          `https://100035.pythonanywhere.com/api/nps_create/?scale_id=${slug}`
        );
        console.log(response.data.success);
        setScale(response.data.success);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const createMasterLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    var requestData = {
      qrcode_type: 'Link',
      quantity: 1,
      company_id: 'gee',
      document_name: 'Vader Doc',
      links: [
        {
          link: `https://${window.location.host}/100035-DowellScale-Function/nps-response/${slug}`,
        },
      ],
    };

    try {
      const data = await axios.post(
        'https://www.qrcodereviews.uxlivinglab.online/api/v3/qr-code/',
        // '',
        requestData
      );
      const result = await data.data;
      console.log(result.qrcodes[0].masterlink);

      if (result.error) {
        setIsLoading(false);
        return;
      } else {
        setMasterLink(result.qrcodes[0].masterlink);
        handleToggleMasterlinkModal();

        setIsLoading(false);
        toast.success(result.response);
      }
    } catch (error) {
      setIsLoading(false);

      console.log('Error', error.response);
    }
    // https://www.qrcodereviews.uxlivinglab.online/api/v3/qr-code/
  };

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen font-medium font-Montserrat">
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
              {/* {scale &&
                scale.map((scale, index) => ( */}
              <Button
                width={'3/4'}
                onClick={handleToggleUpdateModal}
                // key={index}
              >
                update scale
              </Button>
              {/* ))} */}
              <Button width={'3/4'} primary onClick={createMasterLink}>
                {isLoading ? 'Creating Masterlink' : 'Create Masterlink'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showUpdateModal && (
        <UpdateNPSScale handleToggleUpdateModal={handleToggleUpdateModal} />
      )}
      {showMasterlinkModal && (
        <NPSMasterlink
          handleToggleMasterlinkModal={handleToggleMasterlinkModal}
          link={masterLink}
        />
      )}
    </div>
  );
};

export default NPSScaleSettings;
