import React, { useState, useEffect, useMemo } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useCreateScale } from '../../../hooks/useCreateScale';
import CustomTextInput from '../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../components/Fallback';
import { fontStyles } from '../../../utils/fontStyles';


const CreatePercentSumScale = () => {
    const [timeOn, setTimeOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayedTime, setDisplayedTime] = useState(0); 
    
    const createScale  = useCreateScale();
    const navigateTo = useNavigate();


    const requiredFields = [
        'name',
        'left',
        'right',
        'center',
        'orientation'
    ]
    
    const [formData, setFormData] = useState({       
      username : "natan", // your username
      time : 100, // time (in seconds) within which the respondent should provide an answer. Set "00" to disable time restrictions
      scale_name : "", // unique name identifier for the scale
      no_of_scale : null, // number of instances of the scales you wish to create with the same settings
      orientation : "vertical", // orientation of the scale-- "horizontal"/"vertical"
      scale_color : "ffff", // scale background color
      product_count : 2, // number of products to be rated
      product_names : ["brand2", "brand4", "brand5"], // names of products to be rated in a list
      user : "yes", // assign "yes" when the inputs are coming through an end user
        
  })


  const handleChange = (e)=>{
    const { name, value } = e.target;
    setFormData({ ...formData, [name]:value });
  }


  const handleBlurTime = () => {
    if (formData.time) {
      const countDownTimer = setInterval(() => {
        setFormData((prev) => {
          if (prev.time > 0) {
            setDisplayedTime(prev.time);
            return {
              ...prev,
              time: prev.time - 1,
            };
          } else {
            clearInterval(countDownTimer);
            return prev;
          }
        });
      }, 1000); 

      setFormData((prev) => ({
        ...prev,
        countDownTimerId: countDownTimer,
      }));
    }
  };
  const handleToggleTime = ()=>{
    setTimeOn(!timeOn);
  } 

  const arr = useMemo(() => {
    // Initialize the array here
    return [
      
    ];
  }, []); 
  const orientation = ['Vertical', 'Horizontal']
  const format = ['Numbers', 'Emojis']

  const handleSubmitNPSScale = async()=>{
    const secondIndexesArray = arr.map(subarray => subarray[1]);
    console.log(secondIndexesArray)
    setFormData({...formData,product_names:secondIndexesArray})
    const payload = {
        
        
        username : formData.user, // your username
        time : formData.time, // time (in seconds) within which the respondent should provide an answer. Set "00" to disable time restrictions
        scale_name : formData.scale_name, // unique name identifier for the scale
        no_of_scale : formData.no_of_scale, // number of instances of the scales you wish to create with the same settings
        orientation : formData.orientation, // orientation of the scale-- "horizontal"/"vertical"
        scale_color : formData.scale_color, // scale background color
        product_count : parseInt(formData.product_count), // total number of products you wish to rate
        product_names : secondIndexesArray, // name of each product
        user : formData.user // assign "yes" when the inputs are coming through an end user
       
    }
    console.log(payload)
    // for(const field of requiredFields){
    //     if(!formData[field]){
    //         toast.error(`Please complete the "${field}" field.`);
    //         return;
    //     }
    // }
    try {
        setIsLoading(true);
        const response = await createScale('percent-sum-scale', payload);
        console.log(response, '8* respon')
        // if(response.status===200){
            toast.success('scale created');
            const data = JSON.parse(response.data.success);
            console.log(data)
            // Extract the value of the "inserted_id" field
            const insertedId = data.inserted_id;
        
            // Use the extracted value as needed
            console.log(insertedId);
            console.log(response.data.event_id)
            // const targetObject = response?.data.find(obj => obj.settings.name === 'Painting2d2d');

            setTimeout(()=>{
                navigateTo(`/100035-DowellScale-Function/percent-sum-scale-settings/${insertedId}`)
            },2000)
          // }
    } catch (error) {
        console.log(error);
        toast.error('an error occured');
    }finally{
        setIsLoading(false);
    }
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
console.log(arr)
}
  return (
  <div className='flex flex-col items-center justify-center w-full h-screen font-Montserrat'>
    <div className='w-full p-5 border md:w-7/12'>
      <div className='flex justify-between'>
        <h2 className="mb-3 text-sm font-medium text-center capitalize">set up your Percent scale</h2>
        {/* {timeOn && (
        <p>You have about <span className='font-bold text-primary'>{displayedTime}</span> seconds to submit your form</p>
        )} */}
      </div>
      <div className='grid grid-cols-2 gap-3 mb-10 md:grid-cols-3'>
        <div className='w-full'>
          <CustomTextInput 
            label='Name of Scale'
            name='scale_name'
            value={formData.scale_name}
            type='text'
            handleChange={handleChange}
            placeholder='Name of Scale'
          />
        </div>
        
        <div className='w-full'>
          <label htmlFor="orientation" className="mb-1 ml-1 text-sm font-normal">orientation</label>
          <select 
            label="Select a orientation" 
            name="orientation" 
            className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
            value={formData.orientation}
            onChange={handleChange}
          >
            <option value={''}>-- Select orientation  --</option>
            {orientation.map((orientation, i) => ( 
            <option key={i} >
              {orientation}
              </option>
              ))}
              </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor='scalecolor'>Slider Color</label>
          <input 
            label='scale color'
            name="scale_color"
            autoComplete="given-name"
            type="color"
            placeholder='scale color'
            value={formData.scale_color}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
      <div className="w-full">
        <div className="flex items-center gap-3">
          {timeOn && <button onClick={handleToggleTime}><BsToggleOn className="w-6 h-6 text-primary"/></button>}
          {!timeOn && <button  onClick={handleToggleTime}><BsToggleOff className="w-6 h-6 text-primary"/></button>}
          <span>Click to set Time</span>
        </div>
        {
        timeOn && (
        <CustomTextInput
          name="time"
          type="number"
          placeholder="enter a valid time"
          value={formData.time}
          handleChange={handleChange}
          onBlur={handleBlurTime}
        />
        )}
      </div>
      <div className='w-full'>
        <CustomTextInput 
          label='No of scales'
          name='no_of_scale'
          value={formData.no_of_scale}
          type='text'
          handleChange={handleChange}
          placeholder='Enter no of scales'
        />
      </div>
      <div className='w-full'>
        <CustomTextInput 
          label='Product Count'
          name='product_count'
          value={formData.product_count}
          type='number'
          min={2} max={10}
          handleChange={handleChange}
          placeholder='Enter Product Count'
        />
        
            {Array.from({ length: formData.product_count }, (_, index) => (
                <>
                <label>Product {index+1} Name:</label>
        <input key={index} type="text" placeholder={`Product ${index + 1}`}  onChange={e=>handleArr(e,index+1)}   />
        </>
      ))}

        
      </div>
      </div>
      <div className='flex justify-end gap-3'>
        {isLoading ? <Fallback/> : <button onClick={handleSubmitNPSScale} className='py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>Save</button>}
        {/* <button className='py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>Preview</button> */}
      </div>
    </div>
  </div>
  )
}

export default CreatePercentSumScale