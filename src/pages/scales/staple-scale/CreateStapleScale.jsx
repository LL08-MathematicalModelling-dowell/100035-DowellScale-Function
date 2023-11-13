import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useCreateScale } from '../../../hooks/useCreateScale';
import CustomTextInput from '../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../components/Fallback';


const CreateStapleScale = () => {
    const [timeOn, setTimeOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayedTime, setDisplayedTime] = useState(0); 
    const createScale  = useCreateScale();

    const navigateTo = useNavigate();
    
    const [formData, setFormData] = useState({
        username: "Natan",
        orientation: "",
        spacing_unit: 1,
        scale_upper_limit: 10,
        scalecolor: "#8f1e1e",
        roundcolor: "#938585",
        fontcolor: "#000000",
        fomat: "",
        time: "",
        name: "",
        left: "",
        right: " ",
        fontstyle: " ",
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



  const orientation = ['Vertical', 'Horizontal']
  const format = ['Numbers', 'Emojis', 'Stars']

  const handleSubmitStapleScale = async()=>{
    const payload = {
        username: "Natan",
        orientation: formData.orientation,
        spacing_unit: 1,
        scale_upper_limit: 10,
        scalecolor: formData.scalecolor,
        roundcolor: formData.roundcolor,
        fontcolor: formData.fontcolor,
        fomat: formData.fomat,
        time: formData.time,
        name: formData.name,
        left: formData.left,
        right: formData.right,
        fontstyle: formData.fontstyle,
    }
    try {
        setIsLoading(true);
        const response = await createScale('staple-scale', payload);
        console.log(response)
        if(response.status===201){
            toast.success('scale created');
            // setTimeout(()=>{
            //     navigateTo(`/nps-scale-settings/${response?.data?.data?.scale_id}`)
            // },2000)
        }
    } catch (error) {
        console.log(error);
        toast.success('an error occured');
    }finally{
        setIsLoading(false);
    }
}

  return (
    <div className='h-screen w-full flex flex-col items-center justify-center font-Montserrat relative'>
      <div className='w-full md:w-7/12 border p-5'>
        <div className='flex justify-between'>
            <h2 className="capitalize text-center text-sm font-medium mb-3">set up your staple scale</h2>
            {timeOn && (
                <p>You have about <span className='text-primary font-bold'>{displayedTime}</span> seconds to submit your form</p>
            )}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mb-10'>
          <div className='w-full'>
            <CustomTextInput 
                label='name'
                name='name'
                value={formData?.name}
                type='text'
                handleChange={handleChange}
                placeholder='enter scale name'
            />
          </div>
          <div className='w-full'>
              <label htmlFor="orientation" className="text-sm font-normal mb-1 ml-1">orientation</label>
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
              <label htmlFor='scalecolor'>scale color</label>
              <input 
                  label='scale color'
                  name="scalecolor"
                  autoComplete="given-name"
                  type="color"
                  placeholder='scale color'
                  value={formData.scalecolor}
                  onChange={handleChange}
                  className="w-full"
              />
          </div>
          <div className="flex flex-col gap-2">
              <label htmlFor='roundcolor'>round color</label>
              <input 
                  label='round color'
                  name="roundcolor"
                  autoComplete="given-name"
                  type="color"
                  placeholder='round color'
                  value={formData.roundcolor}
                  onChange={handleChange}
                  className="w-full"
              />
          </div>
          <div className="flex flex-col gap-2">
              <label htmlFor='fontcolor'>font color</label>
              <input 
                  label='font color'
                  name="fontcolor"
                  autoComplete="given-name"
                  type="color"
                  placeholder='font color'
                  value={formData.fontcolor}
                  onChange={handleChange}
                  className="w-full"
              />
          </div>
          <div className='w-full'>
              <label htmlFor="format" className="text-sm font-normal mb-1 ml-1">format</label>
              <select 
                  label="Select a format" 
                  name="fomat" 
                  className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                  value={formData.fomat}
                  onChange={handleChange}
              >
                  <option value={''}>-- Select format  --</option>
                  {format.map((format, i) => (
                      <option key={i} >
                          {format}
                      </option>
                  ))}
              </select>
          </div>
          <div className='w-full'>
            <CustomTextInput 
                label='left'
                name='left'
                value={formData.left}
                type='text'
                handleChange={handleChange}
                placeholder='enter scale left'
            />
          </div>
          <div className='w-full'>
            <CustomTextInput 
                label='center'
                name='center'
                value={formData.center}
                type='text'
                handleChange={handleChange}
                placeholder='enter scale center'
            />
          </div>
          <div className='w-full'>
            <CustomTextInput 
                label='right'
                name='right'
                value={formData.right}
                type='text'
                handleChange={handleChange}
                placeholder='enter scale right'
            />
          </div>
          
          <div className="w-full">
              <div className="flex items-center gap-3">
                  {timeOn && <button onClick={handleToggleTime}><BsToggleOn className="text-primary h-6 w-6"/></button>}
                  {!timeOn && <button  onClick={handleToggleTime}><BsToggleOff className="text-primary h-6 w-6"/></button>}
                  <span>Toggle to set Time</span>
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
                  )
              }
              
          </div>
          <div className='w-full'>
            <CustomTextInput 
                label='No of scales'
                name='no_of_scales'
                value={formData.no_of_scales}
                type='text'
                handleChange={handleChange}
                placeholder='Enter no of scales'
            />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
        {isLoading ? <Fallback/> : <button onClick={handleSubmitStapleScale} className='py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>Save</button>}
          <button className='py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>Preview</button>
        </div>
      </div>
    </div>
  )
}

export default CreateStapleScale