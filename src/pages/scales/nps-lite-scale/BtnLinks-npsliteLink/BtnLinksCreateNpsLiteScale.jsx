import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useCreateScale } from '../../../../hooks/useCreateScale';
import CustomTextInput from '../../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../../components/Fallback';
import { fontStyles } from '../../../../utils/fontStyles';
import { NPSLiteEmojiPicker } from '../../../../components/emoji-picker';
import NPSLiteMasterLink from './BtnLinksNPSLiteMasterLink';
import { useFetchUserContext } from "../../../../contexts/fetchUserContext";
import axios from 'axios';


const CreateNpsLiteScale = () => {
    const [timeOn, setTimeOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [displayedTime, setDisplayedTime] = useState(0);
    const [selectedEmojis, setSelectedEmojis] = useState([]);
    const [showEmojiPalette, setShowEmojiPalette] = useState(false);
    const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
    const [scaleType, setScaleType] = useState("")
    const [instance, setInstance] = useState("")
    const userinfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const [npsLiteLinks, setNpsLiteLinks] = useState({})

    const {  
      popuOption, 
      setPopupOption,
      sName, 
      setSName,
      scaleLinks,
      setScaleLinks,
      isModalOn, 
      setIsNodalOn } = useFetchUserContext()
    
    const createScale  = useCreateScale();
    const navigateTo = useNavigate();
    
    const [formData, setFormData] = useState({
          orientation: "",
          user: "yes",  //should be boolean
          question: "",
          username: "Ndoneambrose",
          scalecolor: "#E5E7E8",
          numberrating: 10,
          no_of_scales: 3,
          fontcolor: "#E5E7E8",
          fontstyle: "",
          time: 0,
          template_name: "testing5350",
          name: "",
          text: "good+neutral+best",
          left: "",
          right: "",
          center: "",
          // scale-category: "nps scale",
          scaleCategory: "nps scale",
          show_total_score: "true" //should be boolean
  })

  const requiredFields = [
    'name',
    'left',
    'right',
    'center',
    'orientation'
]

  const handleToggleEmojiPellete = ()=>{
    setShowEmojiPalette(!showEmojiPalette)
  }

  console.log(selectedEmojis, "------------------------", Object.assign({}, selectedEmojis))
  const handleChange = (e)=>{
    const { name, value } = e.target;
    setFormData({ ...formData, [name]:value });
    if (name === 'fomat' && value === 'emoji') {
      console.log('fomat selected:', value)
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
  const format = ['Numbers', 'emoji']

  const handleSubmitNPSScale = async()=>{

    

    const payload = {
        orientation: formData.orientation,
        scale_id: "64e8744218f0a24fb16b0ee2",
        user: "yes",  //should be boolean
        username: "Ndoneambrose",
        scalecolor: formData.scalecolor,
        numberrating: 10,
        no_of_scales: formData.no_of_scales,
        fontcolor: formData.fontcolor,
        fomat:formData.fomat,
        fontstyle:formData.fontstyle,
        time: formData.time,
        custom_emoji_format: Object.assign({}, selectedEmojis),
        template_name: "testing5350",
        name: formData.name,
        text: "good+neutral+best",
        left: formData.left,
        right: formData.right,
        center: formData.center,
        // scale-category: "nps scale",
        scaleCategory: "nps scale",
        show_total_score: "true" //should be boolean
    }

    for(const field of requiredFields){
        if(!formData[field]){
          if(formData.format === "emoji" && field === 'left','center', 'right') {

          }else {
            toast.error(`Please complete the "${field}" field.`);
            return;
          }
            
        }
    }
    try {
        setIsLoading(true);
        const response = await createScale('nps-lite-scale', payload);
        console.log(response, '8* respon')
        if(response.status===200){
            toast.success('scale created');
            setTimeout(()=>{
                navigateTo(`/100035-DowellScale-Function/nps-lite-scale-settings/${response?.data?.data?.scale_id}`)
            },2000)
          }
    } catch (error) {
        console.log(error);
        toast.error('an error occured');
    }finally{
        setIsLoading(false);
    }
}

const handleSave = async() =>{
  const payload = {
    "workspace_id": userinfo.userinfo.client_admin_id,
    "username": userinfo.userinfo.username,
    "scale_name": formData.name,
    "no_of_instances": instance,
    "scale_type": 'nps_lite'
  };
  console.log(payload);

  try {
    setIsLoading(true);
    const response = await axios.post(
      'https://100035.pythonanywhere.com/addons/create-scale/',
      payload
    );
    const result = response.data;
    setNpsLiteLinks(result.urls)
    console.log(result);
    if (result.error) {
      setIsLoading(false);
      return;
    } else {
      setIsNodalOn(true)
      toast.success('Response succesfully submitted');
      // navigateTo(
      //   `/100035-DowellScale-Function/nps-scale-settings/${result.scale_id}`
      // );
      handleToggleMasterlinkModal()
    }
  } catch (error) {
    console.log(error);
    toast.error(error);
  } finally {
    setIsLoading(false);
  }
}

const handleToggleMasterlinkModal = () => {
  setShowMasterlinkModal(!showMasterlinkModal);
};

  return (
  // <div className='flex flex-col items-center justify-center w-full h-screen font-Montserrat'>
  //   <div className='w-full p-5 border md:w-7/12'>
  //     <div className='flex justify-between'>
  //       <h2 className="mb-3 text-sm font-medium text-center capitalize">set up your NPS Lite scale</h2>
  //       {timeOn && (
  //       <p>You have about <span className='font-bold text-primary'>{displayedTime}</span> seconds to submit your form</p>
  //       )}
  //     </div>
  //     <div className='grid grid-cols-2 gap-3 mb-10 md:grid-cols-3'>
  //       <div className='w-full'>
  //         <CustomTextInput 
  //           label='name'
  //           name='name'
  //           value={formData.name}
  //           type='text'
  //           handleChange={handleChange}
  //           placeholder='enter scale name'
  //         />
  //       </div>
  //       <div className='w-full'>
  //         <label htmlFor="orientation" className="mb-1 ml-1 text-sm font-normal">orientation</label>
  //         <select 
  //           label="Select a orientation" 
  //           name="orientation" 
  //           className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
  //           value={formData.orientation}
  //           onChange={handleChange}
  //         >
  //           <option value={''}>-- Select orientation  --</option>
  //           {orientation.map((orientation, i) => ( 
  //           <option key={i} >
  //             {orientation}
  //             </option>
  //             ))}
  //             </select>
  //       </div>
  //       <div className="flex flex-col gap-2">
  //         <label htmlFor='scalecolor'>scale color</label>
  //         <input 
  //           label='scale color'
  //           name="scalecolor"
  //           autoComplete="given-name"
  //           type="color"
  //           placeholder='scale color'
  //           value={formData.scalecolor}
  //           onChange={handleChange}
  //           className="w-full"
  //         />
  //       </div>
  //      <div className="flex flex-col gap-2">
  //       <label htmlFor='fontcolor'>font color</label>
  //       <input 
  //         label='font color'
  //         name="fontcolor"
  //         autoComplete="given-name"
  //         type="color"
  //         placeholder='font color'
  //         value={formData.fontcolor}
  //         onChange={handleChange}
  //         className="w-full"
  //       />
  //     </div>
  //     <div>
  //       <label htmlFor="arrangement" className="mb-1 ml-1 text-sm font-normal">font style</label>
  //       <select 
  //         label="Select font style" 
  //         name="fontstyle" 
  //         className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
  //         value={formData.fontstyle}
  //         onChange={handleChange}
  //       >
  //       <option value={''}>-- Select font style  --</option>
  //       {fontStyles.map((style, i) => (
  //         <option key={i} >
  //           {style}
  //         </option>
  //         ))}
  //       </select>
  //     </div>
  //     <div className="w-full">
  //               <label
  //                 htmlFor="format"
  //                 className="mb-1 ml-1 text-sm font-normal"
  //               >
  //                 format
  //               </label>
  //               <select
  //                 label="Select a format"
  //                 name="fomat"
  //                 className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
  //                 value={formData.fomat}
  //                 onChange={handleChange}
  //               >
  //               <option value={'Select format'}>-- Select format --</option>
  //                 {format.map((format, i) => (
  //                   <option key={i}>{format}</option>
  //                 ))}
  //               </select>
  //             </div>
  //     <div className='w-full'>
  //       <CustomTextInput 
  //         label='left'
  //         name='left'
  //         value={formData.fomat === 'emoji' ? selectedEmojis[0] :formData.left}
  //         type='text'
  //         handleChange={handleChange}
  //         placeholder='enter scale left'
  //       />
  //     </div>
  //     <div className='w-full'>
  //       <CustomTextInput 
  //         label='center'
  //         name='center'
  //         value={ formData.fomat === 'emoji' ? selectedEmojis[1] : formData.center}
  //         type='text'
  //         handleChange={handleChange}
  //         placeholder='enter scale center'
  //       />
  //     </div>
  //     <div className='w-full'>
  //       <CustomTextInput 
  //         label='right'
  //         name='right'
  //         value={formData.fomat === 'emoji' ? selectedEmojis[2] : formData.right}
  //         type='text'
  //         handleChange={handleChange}
  //         placeholder='enter scale right'
  //       />
  //     </div>
  //     <div className="w-full">
  //       <div className="flex items-center gap-3">
  //         {timeOn && <button onClick={handleToggleTime}><BsToggleOn className="w-6 h-6 text-primary"/></button>}
  //         {!timeOn && <button  onClick={handleToggleTime}><BsToggleOff className="w-6 h-6 text-primary"/></button>}
  //         <span>Toggle to set Time</span>
  //       </div>
  //       {
  //       timeOn && (
  //       <CustomTextInput
  //         name="time"
  //         type="number"
  //         placeholder="enter a valid time"
  //         value={formData.time}
  //         handleChange={handleChange}
  //         onBlur={handleBlurTime}
  //       />
  //       )}
  //     </div>
  //     <div className='w-full'>
  //       <CustomTextInput 
  //         label='No of scales'
  //         name='no_of_scales'
  //         value={formData.no_of_scales}
  //         type='text'
  //         handleChange={handleChange}
  //         placeholder='Enter no of scales'
  //       />
  //     </div>
  //     {showEmojiPalette && (
  //           <NPSLiteEmojiPicker
  //           setSelectedEmojis={setSelectedEmojis}
  //           selectedEmojis={selectedEmojis}
  //           no_of_emojis = {3}
  //           // handleEmojiSelect={handleEmojiSelect}
  //           handleToggleEmojiPellete={handleToggleEmojiPellete}
  //           />
  //         )}
  //     </div>
  //     <div className='flex justify-end gap-3'>
  //       {isLoading ? <Fallback/> : <button onClick={handleSubmitNPSScale} className='w-full py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>Save</button>}
  //       {/* <button className='py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>Preview</button> */}
  //     </div>
  //   </div>
  // </div>
  <div className="flex flex-col items-center justify-center w-full h-screen font-Montserrat">
      <div style={{filter: showMasterlinkModal ? 'blur(8px)' : '', pointerEvents: showMasterlinkModal ? 'none' : ''}}>
        <div>
          <label htmlFor="scaleType" className="mb-1 ml-1 text-sm font-normal">
          Scale type
            </label>
           <select
              label="Select a scale type"
              name="scaleType"
              className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
              value={scaleType}
              onChange={(e) => setScaleType(e.target.value)}
            >
              <option value='nps'>nps lite scale</option>
               {/* {scaleTypeArray.map((format, i) => (
                <option key={i}>{format}</option>
              ))} */}
            </select>
        </div>
        <div className="w-full" style={{marginTop: '10px'}}>
             <CustomTextInput
              label="no. of instances"
              name="instances"
              value={instance}
              type="text"
              handleChange={(e) => setInstance(e.target.value)}
              placeholder="enter no. instances"
            />
          </div>
          <div className="w-full">
            <CustomTextInput
              label="name"
              name="name"
              value={formData.name}
              type="text"
              handleChange={handleChange}
              placeholder="enter scale name"
            />
          </div>
      </div>
      <button
        onClick={handleSave}
        className="py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium" style={{marginTop: "10px"}}>
        Save
        </button>
        {showMasterlinkModal && (
        <NPSLiteMasterLink
          handleToggleMasterlinkModal={handleToggleMasterlinkModal}
          // link={npsLinks}
          publicLinks={Object.entries(npsLiteLinks)}
          // image={qrCodeURL}
        />
      )}
    </div>
  )
}

export default CreateNpsLiteScale