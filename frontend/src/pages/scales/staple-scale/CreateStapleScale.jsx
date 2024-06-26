import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useCreateScale } from '../../../hooks/useCreateScale';
import CustomTextInput from '../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../components/Fallback';
import { fontStyles } from '../../../utils/fontStyles';
import { StapelEmojiPicker } from '../../../components/emoji-picker';


const CreateStapleScale = () => {
    const [timeOn, setTimeOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEmojis, setSelectedEmojis] = useState([]);
    const [showEmojiPalette, setShowEmojiPalette] = useState(false);
    const [displayedTime, setDisplayedTime] = useState(0); 
    const createScale  = useCreateScale();

    const navigateTo = useNavigate();
    const scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const requiredFields = [
      'name',
      'left',
      'right',
      'orientation'
    ]
    
    const [formData, setFormData] = useState({
        username: "Natan",
        orientation: "",
        spacing_unit: 1,
        scale_upper_limit: 10,
        scalecolor: "#8f1e1e",
        roundcolor: "#938585",
        fontcolor: "#000000",
        no_of_scales: "",
        fomat: "",
        time: "",
        name: "",
        left: "",
        right: " ",
        fontstyle: " ",
        

      //   {
      //     "username": "Natan",
      //     "orientation": "horizontal",
      //     "spacing_unit": 1,
      //     "scale_upper_limit": 10,
      //     "scalecolor": "#8f1e1e",
      //     "roundcolor": "#938585",
      //     "fontcolor": "#000000",
      //     "fomat": "emoji",
      //     "time": "60",
      //     "name": "scalename",
      //     "left": "very good",
      //     "right": "very good",
      //     "label_images": {"0": "imagefile", "1": "imagefile", "2": "imagefile"},
      //     "fontstyle": "Arial, Helvetica, sans-serif",
      //     "custom_emoji_format": {"0": "😎", "1": "🤓", "2": "😊"}
      // }
  });

  const handleToggleEmojiPellete = ()=>{
    setShowEmojiPalette(!showEmojiPalette)
  }

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setFormData({ ...formData, [name]:value });

    if (name === 'fomat' && value === 'emoji') {
      handleToggleEmojiPellete();
    } else {
      setShowEmojiPalette(false);
    }
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
  const format = ['Numbers', 'emoji',]

  const handleSubmitStapleScale = async()=>{
    const payload = {
        username: "Natan",
        orientation: formData.orientation,
        scalecolor: formData.scalecolor,
        roundcolor: formData.roundcolor,
        fontcolor: formData.fontcolor,
        fomat: formData.fomat,
        custom_emoji_format: formData.fomat === 'emoji' ? Object.assign({}, selectedEmojis) : {},
        time: formData.time,
        name: formData.name,
        left: formData.left,
        right: formData.right,
        fontstyle: formData.fontstyle,
        scale_upper_limit:formData.scale_upper_limit,
        spacing_unit:Number(formData.spacing_unit),
        no_of_scales: formData.no_of_scales
       
        // username: "Natan", // your username
        // orientation: "horizontal", // orientation of the scale-- "horizontal"/"vertical"
        // spacing_unit: 1, // intervals between two score values. Can be an integer between 1 and 5
        // scale_upper_limit: 10, // highest score value in the scale
        // scalecolor: "#8f1e1e", // scale background color
        // roundcolor: "#938585", // colour of the buttons in the scale
        // fontcolor: "#000000", // colour of the fonts
        // fomat: "emoji", // format of the labels inside each button-- text, emoji, image  
        // time: 60, // time (in seconds) within which the respondent should provide an answer. Set "00" to disable time restrictions
        // name: "scalename", // unique name identifier for the scale
        // left: "very good", // textual label for the lowest score
        // right: "very good", // textual label for the highest score
        // label_images: {"0": "imagefile", "1": "imagefile", "2": "imagefile"}, // images to be displayed if "image" format is selected
        // fontstyle: "Arial, Helvetica, sans-serif", //font type for the scale
        // custom_emoji_format: {"0": "😎", "1": "🤓", "2": "😊"} // emojis to be displayed if "emoji" format is selected
     
    }

    for(const field of requiredFields){
      if(!formData[field]){
          toast.error(`Please complete the "${field}" field.`);
          return;
      }
    }

    try {
        setIsLoading(true);
        const response = await createScale('staple-scale', payload);
        console.log(response)
        if(response.status===201){
            toast.success('scale created');
            setTimeout(()=>{
                navigateTo(`/100035-DowellScale-Function/staple-scale-settings/${response?.data?.data?.scale_id}`)
            },2000)
        }
    } catch (error) {
        console.log(error);
        toast.success('an error occured');
    }finally{
        setIsLoading(false);
    }
}

  return (
    <div className='relative flex flex-col items-center justify-center w-full h-screen font-Montserrat'>
      <div className='w-full p-5 border md:w-7/12'>
        <div className='flex justify-between'>
            <h2 className="mb-3 text-sm font-medium text-center capitalize">set up your staple scale</h2>
            {timeOn && (
                <p>You have about <span className='font-bold text-primary'>{displayedTime}</span> seconds to submit your form</p>
            )}
        </div>
        <div className='grid grid-cols-2 gap-3 mb-10 md:grid-cols-3'>
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
            <CustomTextInput 
                label='Scale Upper Limit'
                name='scale_upper_limit'
                value={formData.scale_upper_limit}
                type='number'
                handleChange={handleChange}
                placeholder='enter scale upper limit'
            />
          </div>
          <div className='w-full'>
            <CustomTextInput 
                label='Spacing Unit'
                name='spacing_unit'
                value={formData.spacing_unit}
                type='number'
                handleChange={handleChange}
                placeholder='enter scale upper limit'
            />
          </div>
          <div className='w-full'>
              <label htmlFor="format" className="mb-1 ml-1 text-sm font-normal">format</label>
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
          {/* <div className='w-full'>
            <CustomTextInput 
                label='center'
                name='center'
                value={formData.center}
                type='text'
                handleChange={handleChange}
                placeholder='enter scale center'
            />
          </div> */}
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
          <div>
              <label htmlFor="arrangement" className="mb-1 ml-1 text-sm font-normal">font style</label>
              <select 
                  label="Select font style" 
                  name="fontstyle" 
                  className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                  value={formData.fontstyle}
                  onChange={handleChange}
              >
                  <option value={''}>-- Select font style  --</option>
                      {fontStyles.map((style, i) => (
                          <option key={i} >
                              {style}
                          </option>
                      ))}
              </select>
          </div>
          <div className='w-full'>
            <CustomTextInput 
                label='No of scales'
                name='no_of_scales'
                value={formData.no_of_scales}
                type='number'
                handleChange={handleChange}
                placeholder='enter no of scales'
            />
          </div>
          <div className="w-full">
              <div className="flex items-center gap-3">
                  {timeOn && <button onClick={handleToggleTime}><BsToggleOn className="w-6 h-6 text-primary"/></button>}
                  {!timeOn && <button  onClick={handleToggleTime}><BsToggleOff className="w-6 h-6 text-primary"/></button>}
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
        </div>
        <div  className='flex justify-center gap-3'>
        {isLoading ? <Fallback/> : <button style={{width:"100%"}} onClick={handleSubmitStapleScale} className='py-2 px-3 bg-primary text-white min-w-[10rem]  hover:bg-gray-600 hover:text-white font-medium'>Save</button>}
        </div>
      </div>
      {showEmojiPalette && (
        <StapelEmojiPicker
        setSelectedEmojis={setSelectedEmojis}
        selectedEmojis={selectedEmojis}
        no_of_emojis = {Math.floor(formData.scale_upper_limit /formData.spacing_unit) * 2}
        // handleEmojiSelect={handleEmojiSelect}
        handleToggleEmojiPellete={handleToggleEmojiPellete}
        />
        )}
    </div>
  )
}

export default CreateStapleScale