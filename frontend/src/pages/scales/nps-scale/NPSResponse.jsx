import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useSearchParams,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import axios from 'axios';
import { useSaveResponse } from '../../../hooks/useSaveResponse';
import Fallback from '../../../components/Fallback';
import { Button } from '../../../components/button';

const NPSResponse = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [userInfo, setUserInfo] = useState();

  const { slug } = useParams();
  // const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
  const [scale, setScale] = useState(null);
  const [selectedScore, setSelectedScore] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const saveResponse = useSaveResponse();
  const navigateTo = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const publicLink = queryParams.get('public_link');
  console.log(publicLink);

  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleSelectScore = (score) => {
    setSelectedScore(score);
    console.log(score);
  };

  const submitResponse = async () => {
    const payload = {
      username: userInfo.username,
      scale_id: slug,
      score: selectedScore,
      process_id: 'process_id879895',
      instance_id: 1,
      brand_name: 'question',
      product_name: 'answer',
    };
    console.log(payload);

    try {
      setIsLoading(true);
      const response = await saveResponse(payload);
      console.log(response);
      if (response.payload.isSuccess === 'true') {
        toast.success('successfully updated');
        //   setTimeout(()=>{
        //       navigateTo(`/nps-scale/${sigleScaleData[0]?._id}`);
        //   },2000)
      }
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
    const session_id = searchParams.get('session_id');
    console.log(window.location.href);
    if (!session_id) {
      window.location.href =
        'https://100014.pythonanywhere.com/?redirect_url=' +
        `${window.location.href}`;
      return;
    }
    getUserInfo();
    sessionStorage.setItem('session_id', session_id);
  }, [slug]);

  const getUserInfo = async () => {
    // setLoadingFetchUserInfo(true);
    const session_id = searchParams.get('session_id');
    axios
      .post('https://100014.pythonanywhere.com/api/userinfo/', {
        session_id: session_id,
      })

      .then((response) => {
        console.log(response?.data);
        setUserInfo(response?.data?.userinfo);
        // setLoadingFetchUserInfo(false);
      })
      .catch((error) => {
        // setLoadingFetchUserInfo(false);
        console.error('Error:', error);
      });
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
              {/* <Button
                width={'3/4'}
                onClick={handleToggleUpdateModal}
                // key={index}
              >
                update scale
              </Button> */}
              {/* ))} */}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center my-4">
          <Button width={'1/2'} primary onClick={submitResponse}>
            {isLoading ? 'Saving' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NPSResponse;
