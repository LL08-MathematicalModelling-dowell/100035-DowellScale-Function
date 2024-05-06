import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useCreateScale } from '../../../hooks/useCreateScale';
import CustomTextInput from '../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../components/Fallback';
import { fontStyles } from '../../../utils/fontStyles';
import { NPSLiteEmojiPicker } from '../../../components/emoji-picker';
import NPSLiteMasterLink from './NPSLiteMasterLink';
import { useFetchUserContext } from "../../../contexts/fetchUserContext";
import ChannelNames from '../../../components/data/ChannelNames';
import InstanceInfo from '../../../components/data/InstanceInfo';
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
      setIsNodalOn,
      channelCount,
      setChannelCount } = useFetchUserContext()
    
    const createScale  = useCreateScale();
    const navigateTo = useNavigate();
    const initialState = {
                           channel_name: "",
                           channel_display_name: "",
                           instances_details: [],
                         }
    const instanceObject = {
                           instance_name: "",
                           instance_display_name: ""
    }
    const [countInstance, setCountInstance] = useState(0)
    const [count, setCount] = useState(0)
    const [channelListPayload, setChannelListPayload] = useState([])
    const [channelist, setChannelList] = useState(initialState)
    const [count2, setCount2] = useState(0)
    const [instanceDetails, setInstanceDetails] = useState(instanceObject)
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
          show_total_score: "true", //should be boolean
          no_of_channels: ''
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

    ChannelNames.length = 0
    let elements = document.querySelectorAll(".channel_name");
    let channelArray = []
    for (let i = 0;  i < elements.length; i++) {
    channelArray.push(elements[i].value)
    console.log(channelArray, "HHHHHHHH")
    }

    const payload = {
        "workspace_id": userinfo.userinfo.client_admin_id,
        "username": userinfo.userinfo.username,
        "scale_name": formData.name,
        "customizations": {
                            "orientation": formData.orientation,
                            "scalecolor": formData.scalecolor,
                            "fontcolor": formData.fontcolor,
                            "fontstyle": formData.fontstyle,
                          },
                          "channel_instance_list": [
                            {
                                "channel_name": "channel_1",
                                "channel_display_name": "sg_Website",
                                "instances_details": [
                                    {
                                        "instance_name": "instance_1",
                                        "instance_display_name": "HomePage"
                                    }
                    
                                ]
                            },
                            {
                                "channel_name": "channel_2",
                                "channel_display_name": "UK_Website",
                                "instances_details": [
                                    {
                                        "instance_name": "instance_1",
                                        "instance_display_name": "FeedbackForm"
                                    },
                                    {
                                        "instance_name": "instance_1",
                                        "instance_display_name": "LogOutPage"
                                    }
                    
                                ]
                            }
                        ],
                        "scale_type": "nps",
                        "user_type": true,
                       "no_of_responses":3,
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
        if(response.status===201){
            toast.success(response.data.message);
            setTimeout(()=>{
                navigateTo(`/100035-DowellScale-Function/nps-lite-scale-settings/${response?.data?.scale_id}`)
            },2000)
          }
    } catch (error) {
        console.log(error);
        toast.error('an error occured');
    }finally{
        setIsLoading(false);
    }
}

const setNumInstance = (val) =>{
  let numInstance = document.getElementById(val)
  
  return numInstance ? numInstance.value : 4
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

const handleChannelDisplayName = (e) =>{
  setChannelList({...channelist, channel_display_name: e.target.value})
}

useEffect(()=>{
  const handleChannelName = () =>{
    if(channelCount !== 0) {
      setChannelList({...channelist, channel_name: "channel_"+count, instances_details: InstanceInfo})
    }

    console.log(count, "TTTTTTTTTT")
  }
  handleChannelName()
}, [count])


useEffect(()=>{
  const handleChannelName = () =>{
    if(channelCount !== 0) {
      setInstanceDetails(values =>({...values, instance_name: "instance_"+count2}))
    }
    console.log(count, "TTTTTTTTTT")
  }
  handleChannelName()
}, [count2])

const addChannel = () =>{

  if(instanceDetails.instance_display_name !== ""){
    InstanceInfo.push(instanceDetails)
  }

  if(channelist.channel_display_name !== ""){
    ChannelNames.push(channelist)
  }
  
  setChannelList({...initialState})
  
  setChannelCount(0)
  setChannelCount(e =>e+1)
  setCount(count => count + 1)
  setCountInstance(0)
}

function handleInstanceInput(e) {
  // const name = e.target.name;
  // const value = e.target.value;
  // setInputs(values => ({...values, [name]:value}))
  setInstanceDetails(values =>({...values, instance_display_name: e.target.value}))
}

console.log(ChannelNames, "HHHHHHHHHHHHHHH")
const addInstance = () =>{

  if(instanceDetails.instance_display_name !== ""){
    InstanceInfo.push(instanceDetails)
  }

  setCount2(e => e + 1)
  setCountInstance(i => i + 1)
}

const handleToggleMasterlinkModal = () => {
  setShowMasterlinkModal(!showMasterlinkModal);
};

  return (
  <div className='flex flex-col items-center justify-center w-full font-Montserrat mt-10'>
    <div className='w-full p-5 border md:w-7/12'>
      <div className='flex justify-between'>
        <h2 className="mb-3 text-sm font-medium text-center capitalize">set up your NPS Lite scale</h2>
        {timeOn && (
        <p>You have about <span className='font-bold text-primary'>{displayedTime}</span> seconds to submit your form</p>
        )}
      </div>
      <div className='flex flex-col justify-center'>
        <div className='grid grid-cols-2 gap-3 mb-10 md:grid-cols-3'>
        <div className='w-full'>
          <CustomTextInput 
            label='name'
            name='name'
            value={formData.name}
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
      </div>
      {/* <div className="w-full">
                <label
                  htmlFor="format"
                  className="mb-1 ml-1 text-sm font-normal"
                >
                  format
                </label>
                <select
                  label="Select a format"
                  name="fomat"
                  className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                  value={formData.fomat}
                  onChange={handleChange}
                >
                <option value={'Select format'}>-- Select format --</option>
                  {format.map((format, i) => (
                    <option key={i}>{format}</option>
                  ))}
                </select>
              </div> */}
              
          <div className="w-full mt-5 mb-5">
             {
              Array.apply(null, {length: channelCount}).map((val, index) =>(
                <div key={index}>
                <CustomTextInput
                label='channel display name'
                name="channel_display_name"
                className="border rounded-lg w-full mb-4 h-10 outline-none"
                type="text"
                value={channelist.channel_display_name}
                handleChange={handleChannelDisplayName}
                placeholder="Enter channel name"
                />
                <div className='mt-5'>
                {/* <label htmlFor="orientation" className="mb-1 ml-1 text-sm font-normal">No. of instances</label>
                <input
                label='no of instances'
                 name="no_of_instances"
                 id={`no_of_instances${index}`}
                 className={`no_of_instances border rounded-lg w-full mb-4 h-10 outline-none`}
                 type="text"
                 onChange={(e) => setCountInstance(e.target.value)}
                 placeholder="Enter no of instances"
                /> */}
                <div className="w-full mt-5 mb-5">
             {
              Array.apply(null, {length: countInstance }).map((val, index) =>(
                <div key = {index} className='bt-30'>
                  <label htmlFor="orientation" className="mb-1 ml-1 text-sm font-normal">name of instances</label>
                <input
                label='name of instances'
                 name='instance_display_name'
                 className="instance_name border rounded-lg w-full mb-4 h-10 outline-none"
                 type="text"
                 value={channelist.instance_display_name}
                 onChange={handleInstanceInput}
                 placeholder="Enter istance name"
                />
                </div>
              ))
            }
            {/* <button onClick={addInstance} className='w-1/2 py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>+add an instance</button> */}
          </div>
                </div>
                </div>
              ))
            }
            {/* <button onClick={addChannel} className='w-full py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>+add a channel</button> */}
          </div>
      {/* <div className='w-full'>
        <CustomTextInput 
          label='left'
          name='left'
          value={formData.fomat === 'emoji' ? selectedEmojis[0] :formData.left}
          type='text'
          handleChange={handleChange}
          placeholder='enter scale left'
        />
      </div>
      <div className='w-full'>
        <CustomTextInput 
          label='center'
          name='center'
          value={ formData.fomat === 'emoji' ? selectedEmojis[1] : formData.center}
          type='text'
          handleChange={handleChange}
          placeholder='enter scale center'
        />
      </div>
      <div className='w-full'>
        <CustomTextInput 
          label='right'
          name='right'
          value={formData.fomat === 'emoji' ? selectedEmojis[2] : formData.right}
          type='text'
          handleChange={handleChange}
          placeholder='enter scale right'
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
        )}
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
      {showEmojiPalette && (
            <NPSLiteEmojiPicker
            setSelectedEmojis={setSelectedEmojis}
            selectedEmojis={selectedEmojis}
            no_of_emojis = {3}
            // handleEmojiSelect={handleEmojiSelect}
            handleToggleEmojiPellete={handleToggleEmojiPellete}
            />
          )} */}
      </div>
      <div className='flex justify-end gap-3'>
        {isLoading ? <Fallback/> : <button onClick={handleSubmitNPSScale} className='w-full py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>Save</button>}
        {/* <button className='py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium'>Preview</button> */}
      </div>
    </div>
  </div>
  )
}

export default CreateNpsLiteScale