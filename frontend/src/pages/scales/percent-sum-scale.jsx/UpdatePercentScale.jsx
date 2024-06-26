import React, { useState, useEffect, useMemo } from "react";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import useGetSingleNpsLiteScale from "../../../hooks/useGetSingleNpsLiteScale";
import { useUpdateResponse } from "../../../hooks/useUpdateResponse";
import CustomTextInput from "../../../components/forms/inputs/CustomTextInput";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";
import { EmojiPicker } from '../../../components/emoji-picker';

const UpdatePercentSumScale = ({ handleToggleUpdateModal }) => {

  const { slug } = useParams();
  const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleNpsLiteScale();
  const [timeOn, setTimeOn] = useState(false);
  const { _id, settings } = (sigleScaleData && sigleScaleData[0]) || {};
  const [isLoading, setIsLoading] = useState(false);
  const updateResponse = useUpdateResponse();
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);

  const navigateTo = useNavigate();
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  

    const orientation = settings?.orientation
    // const scale_id = settings?.scale_id
    // const user = settings?.user
    const username = settings?.username
    const scale_color = settings?.scale_color
    const no_of_scale = settings?.no_of_scales
    const time = settings?.time
    const name = settings?.name
    const product_count = settings?.product_count
    const product_names = settings?.product_names
    
  const arr = useMemo(() => {
    // Initialize the array here
    return [
      
    ];
  }, []); 

  const [updateFormData, setUpdateFormData] = useState(
      Object.assign({}, { 
        orientation,
        username,
        scale_color,
        no_of_scale,
        time,
        name,
        product_count,product_names,
        scale_category: "percent sum scale"
      })
  );

  const secondIndexesArray = arr.map(subarray => subarray[1]);

  const updatePayload = {
    scale_id: _id,
    user: "yes",
    username: "Ndoneambrose",
    orientation:updateFormData.orientation,
    scale_color:updateFormData.scale_color,
    no_of_scales:updateFormData.no_of_scale,
    time: updateFormData.time,
    name:updateFormData.name,
    product_count:updateFormData.product_count,
    product_names:secondIndexesArray
    
  }
  const handleArr = (e,index) =>{
    const indexToUpdate = 1; // The index you want to update
  const newValue = "newModifiedValue"; // The new value
  
  const indexToUpdateExists = arr.some(subarray => subarray[0] === index);
  
  if (indexToUpdateExists) {
      // Update the existing subarray
      arr.forEach(subarray => {
          if (subarray[0] === index) {
              subarray[1] = e.target.value;
          }
      });
  } else {
      // Push a new subarray
      arr.push([index, e.target.value]);
  }
  handleChange(e)
  console.log(arr)
  }
  
  const handleToggleEmojiPellete = ()=>{
    setShowEmojiPalette(!showEmojiPalette)
  }

  const handleChange = (e)=>{
    const { name, value } = e.target;
    console.log(name,value)
    setUpdateFormData({ ...updateFormData, [name]:value });
  }
  

  const handleToggleTime = ()=>{
    setTimeOn(!timeOn);
  } 

  const orientationDB = ['Vertical', 'Horizontal']
    const handleFetchSingleScale = async (scaleId) => {
      try {
          await fetchSingleScaleData(scaleId);
      } catch (error) {
          console.error("Error fetching single scale data:", error);
      }
    }



  useEffect(() => {
      const fetchData = async () => {
          await handleFetchSingleScale(slug);
      }
      fetchData();
  }, [slug]);

  useEffect(() => {
    if (settings) {
      setUpdateFormData({
        orientation: settings?.orientation || '',
        scale_id: _id || '',
        user: true, 
        username: settings?.username || '',
        scale_color: settings?.scale_color || '',
        no_of_scale: settings?.no_of_scales || 0,
        time: settings?.time || 0,
        name: settings?.name || '',
        product_count:settings?.product_count, 
        product_names:settings?.product_names
        
      });
      
    }
  }, [settings]);
  

  const handleUpdateNPSScale = async(e)=>{
    e.preventDefault()
    console.log(updatePayload, 'payload')
    // if(!updateFormData.fomat){
    //   toast.error('please select a format to proceed');
    //   return
    // }
    try {
        setIsLoading(true);
        const { status, data } = await updateResponse('percent-scale', updatePayload);
        if(status===200){
          toast.success('successfully updated');
          setTimeout(()=>{
              // navigateTo(`/100035-DowellScale-Function/percent-sum-scale-settings/${sigleScaleData[0]?._id}`);
          },2000)
        }
    } catch (error) {
        console.log(error)
    }finally{
        setIsLoading(false)
        handleToggleUpdateModal()
        window.location.reload("/")
    }
}

  if(loading || isLoading){
    return <Fallback />
  }

  return (
 <div className="fixed top-0 left-0 flex flex-col justify-center w-full h-screen bg-primary/40">
      <div className="relative p-5 m-auto bg-white border" style={{width:"73%"}}>
        <button
          onClick={handleToggleUpdateModal}
          className="absolute px-2 text-white bg-red-500 rounded-full right-2 top-2"
        >
          x
        </button>
        <div className="flex flex-col items-center justify-center w-full font-Montserrat">
          <div className=" p-5 border md:w-9/12" >
            <div className="w-7/12 m-auto">
              <h2 className="mb-3 text-sm font-medium text-center capitalize">
                Update {settings?.name} scale
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-10 md:grid-cols-3">
              <div className="w-full">
                <CustomTextInput
                  label="name"
                  name="name"
                  value={updateFormData.name}
                  type="text"
                  handleChange={handleChange}
                  placeholder="enter scale name"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="orientation"
                  className="mb-1 ml-1 text-sm font-normal"
                >
                  orientation
                </label>
                <select
                  label="Select a orientation"
                  name="orientation"
                  className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                  value={updateFormData.orientation}
                  onChange={handleChange}
                >
                  <option value={''}>-- Select orientation --</option>
                  {orientationDB.map((orientation, i) => (
                    <option key={i}>{orientation}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="scalecolor">scale color</label>
                <input
                  label="scale color"
                  name="scale_color"
                  autoComplete="given-name"
                  type="color"
                  placeholder="scale color"
                  value={updateFormData.scale_color}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              
              <div className="w-full">
                <div className="flex items-center gap-3">
                  {timeOn && (
                    <button onClick={handleToggleTime}>
                      <BsToggleOn className="w-6 h-6 text-primary" />
                    </button>
                  )}
                  {!timeOn && (
                    <button onClick={handleToggleTime}>
                      <BsToggleOff className="w-6 h-6 text-primary" />
                    </button>
                  )}
                  <span>Toggle to set Time</span>
                </div>
                {timeOn && (
                  <CustomTextInput
                    name="time"
                    type="number"
                    placeholder="enter a valid time"
                  />
                )}
              </div>
              <div className="w-full">
                <CustomTextInput
                  label="No of scales"
                  name="no_of_scales"
                  value={updateFormData.no_of_scale}
                  type="text"
                  handleChange={handleChange}
                  placeholder="Enter no of scales"
                />
              </div>
              <div className='w-full'>
        <CustomTextInput 
          label='Product Count'
          name='product_count'
          value={updateFormData.product_count}
          type='number'
          min={2} max={10}
          handleChange={handleChange}
          placeholder='Enter Product Count'
        />
        
            {Array.from({ length: updateFormData.product_count }, (_, index) => (
                <>
                <label>Product {index+1} Name:</label>
        <input key={index} type="text" placeholder={updateFormData.product_names[index]}  onChange={e=>handleArr(e,index+1)}   />
        </>
      ))}

        
      </div>
     
            </div>
            <Button primary width={'full'} onClick={handleUpdateNPSScale}>
              Update scale
            </Button>
          </div>
          {showEmojiPalette && (
            <EmojiPicker
              setSelectedEmojis={setSelectedEmojis}
              selectedEmojis={selectedEmojis}
              // handleEmojiSelect={handleEmojiSelect}
              handleToggleEmojiPellete={handleToggleEmojiPellete}
            />
          )}
        </div>

        {/* <div className="">
          <button className="flex items-center gap-5 px-5 py-2 my-5 text-white bg-primary">
            submit
            <span>--</span>
          </button>
        </div> */}
      </div>
    </div>
  )
}

export default UpdatePercentSumScale