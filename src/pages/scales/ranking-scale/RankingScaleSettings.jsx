
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { BsArrowLeft} from 'react-icons/bs';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import useCreateRankingScalesResponse from "../../../hooks/useCreateRankingScalesResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";
import NPSMasterlink from "../nps-scale/NPSMasterlink";
import UpdateNPSScale from "../nps-scale/UpdateNPSScale";
import MasterlinkSuccessModal from "../../../modals/MasterlinkSuccessModal";
import axios from "axios";


const RankingScaleSettings = ()=>{
    const { slug } = useParams();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const { CreateRankingScalesResponse } = useCreateRankingScalesResponse();
    const [currentStage, setCurrentStage] = useState(0);
    const [itemsAvailableSchema, setItemsAvailableSchema] = useState([]);
    const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
  const [masterLink, setMasterLink] = useState('');
  const [qrCodeURL, setQrCodeURL] = useState('');
  const [qrCodeId, setQrCodeId] = useState('');
  const [scale, setScale] = useState(null);
  const [scaleResponse, setScaleResponse] = useState([]);
  const [response, setResponse] = useState(null);
  const [publicLinks, SetpublicLinks] = useState(null);
  const [selectedScore, setSelectedScore] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const publicLink = queryParams.get('public_link');
  const link_id = queryParams.get('link_id');
  const qrcode_id = queryParams.get('qrcode_id');
  const [isButtonHidden, setIsButtonHidden] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showMasterLinkSuccessModal, setShowMasterLinkSuccessModal] =
    useState(false);
    // console.log(sigleScaleData?.settings?.stages[2], 'sigleScaleData')

    // const stagess = sigleScaleData?.settings?.stages || {};
    const stagesObject = sigleScaleData?.settings?.stages || {};
    const dataStages = Object.values(stagesObject);
      
    const dataItems = sigleScaleData && sigleScaleData?.settings?.item_list?.map((list)=>{
            return list;
        })
 
    
    const stages = sigleScaleData ? dataStages[0] : ['City 5', 'City 6'];
    const itemsAvailable = dataItems ? dataItems[0] : ['item 111', 'item 222'];
    const rankings = [0, 1];

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
              `https://100035.pythonanywhere.com/ranking/api/ranking_settings_create/?scale_id=${slug}`
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
    
      useEffect(() => {
    
        const fetchResponseData = async () => {
          //   await handleFetchSingleScale(slug);
          try {
            setIsLoading(true);
            const response = await axios.get(
              `https://100035.pythonanywhere.com/ranking/api/ranking_response_submit/`,slug
            );
            setScaleResponse((response.data.data.data[0]).score);
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
    
          const flattenedArray = [].concat(...PublicLinks);
    
          // Generate modified URLs
          const modifiedUrl = window.location.href.slice(0,
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
    
    const [db, setDb] = useState([
        {
            stage_name: currentStage && stages[currentStage],
            stage_rankings: itemsAvailableSchema.map(item => ({
                name: item.item,
                rank: item.option
            }))
        }
    ]);


    const navigateTo = useNavigate();

    
    const handlePrev = ()=>{
        if(currentStage > 0){
            setCurrentStage(prev => prev - 1);
        }
    }

    const handleSelectOption = (e, index) => {
        const selectedOption = e.target.value;
    
        setItemsAvailableSchema(prevSchema => {
            const updatedSchema = [...prevSchema];
            updatedSchema[index].option = selectedOption;
            return updatedSchema;
        });
    };
    

    const handleSubmit = async() => {
        const selectedOptions = itemsAvailableSchema.map(item => item.option);
        const isDuplicate = new Set(selectedOptions).size !== selectedOptions.length;
        if (isDuplicate) {
            toast.error('Please assign unique ranks to each item');
            return;
        }
        const updatedDb = [...db];
        updatedDb[currentStage] = {
            stage_name: stages[`${currentStage}`],
            stage_rankings: itemsAvailableSchema.map(item => ({
                name: item.item,
                rank: Number(item.option)
            }))
        };
        setDb(updatedDb);
    
        if (currentStage === stages ? stages.length - 1 : 0) {
            const payload =  {
                scale_id: sigleScaleData[0]?._id,
                brand_name: "New Brand",
                product_name:"New Product",
                num_of_stages: sigleScaleData[0]?.settings?.num_of_stages,
                num_of_substages:sigleScaleData[0]?.settings?.num_of_substages,
                username: "natan",
                rankings:updatedDb
              }
            try {
                const response = await CreateRankingScalesResponse(payload);
                toast.success('successfully updated');
                if(response.status===200){
                    setTimeout(() => {
                        navigateTo(`/100035-DowellScale-Function/${'ranking-scale'}`)
                    }, 2000);
                }
            } catch (error) {
                console.log(error)   
            }
            
        } else {
            setCurrentStage(prev => prev + 1);
        }
    }
    

    const handleFetchSingleScale = async(scaleId)=>{
        await fetchSingleScaleData(scaleId);
    }

    useEffect(() => {
        const fetchData = async () => {
            await handleFetchSingleScale(slug);
        }
        fetchData();
    }, [slug]);

    useEffect(() => {
        if (sigleScaleData && sigleScaleData[0]) {
          const items = sigleScaleData[0].settings.item_list.map(item => item);
          setItemsAvailableSchema(items.map(item => ({ item, option: 0 })));
        }
      }, [sigleScaleData]);
    


    if (loading) {
        return <Fallback />;
    }
    return(
        <div className='flex flex-col items-center justify-center h-screen font-Montserrat'>
        <div className='w-full px-10 py-4 m-auto border border-primary lg:w-8/12'>
            <h2 className='py-3 text-center'>Ranking Scale Name:  
            <span className='text-sm font-medium'>
                            <span>{sigleScaleData?.settings?.scalename}</span>
                </span>
            </h2>
            <div className={`h-96 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} style={{backgroundColor:`${sigleScaleData && sigleScaleData.settings.scalecolor}`}}>
                <div className='flex-1 w-full h-full p-2 border stage lg:w-5/12'>
                {loading ? <h3>...loading data</h3> : (
                    <>
                        <div className='flex items-center w-full gap-5'>
                            <button 
                                onClick={handlePrev} disabled={currentStage===0}
                                className='flex items-center justify-center w-3/12 gap-2 px-2 py-2 my-1 text-white capitalize bg-primary hover:bg-gray-700/50 py-'> 
                                <BsArrowLeft className='text-white' />
                                Go Back
                            </button>
                            <h2 className='w-3/12 py-2 text-center border'>stage {currentStage + 1} of {stages?.length}</h2>
                            <h2 className='w-6/12 py-1 text-sm text-center capitalize border'>
                                {stages && stages[currentStage]}
                            </h2>
                        </div>
                        <div className='flex flex-col w-full gap-3 md:flex-row'>
                            <>
                                <div className='w-full'>
                                    <h2 className='px-2 border my-7'>Items available</h2>
                                {
                                    <ul>
                                        {
                                            itemsAvailableSchema.map((item, index)=>(
                                                <li key={index} className='px-3 py-1 border'>{item.item}</li>
                                            ))
                                        }
                                    </ul>
                                }
                                </div>
                                <div className='w-full'>
                                    <h2 className='px-2 border my-7'>Select Rankings</h2>
                                    {itemsAvailableSchema.map((item, index) => (
                                    <div className='w-full' key={index}>
                                        {/* <h2 className='px-2 border my-7'>{item.item}</h2> */}
                                        <select
                                            name={`ranking-${index}`}
                                            value={item.option}
                                            onChange={(e)=>handleSelectOption(e, index)}
                                            className='w-full px-3 py-1 border outline-0'
                                        >
                                            {rankings.map((ranking) => (
                                                <option key={ranking} value={ranking}>
                                                    {ranking}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                                </div>
                            </>
                        </div>
                    </>
                    )}
                    {/* <div className='flex items-center gap-3 mt-10'>
                    
                        <Button width={'full'} primary onClick={handleSubmit}>{(currentStage === stages.length - 1) ? 'submit scale' : 'save and proceed'}</Button>
                    
                    </div>
                    {sigleScaleData && 
                    <div className="flex justify-end gap-3">
                                <Button width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/update-ranking-scale/${sigleScaleData._id}`)}>update scale</Button>
                        <Button onClick={handleSubmit}
                        disabled={currentStage !== stages.length - 1}
                        width={'3/4'} primary>Save Response</Button>
                    </div>
                    }
                     */}
                     <div className="flex justify-end gap-3 mt-5">
          {!publicLink && (
            <>
              <Button width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/update-ranking-scale/${sigleScaleData._id}`)}>
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
                {scaleResponse.length === 0 && <Button width={'3/12'} primary onClick={handleSubmit}>
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
      {/* {showUpdateModal && (
        <UpdateRankingScale handleToggleUpdateModal={handleToggleUpdateModal} />
      )} */}
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
    )
}

export default RankingScaleSettings;