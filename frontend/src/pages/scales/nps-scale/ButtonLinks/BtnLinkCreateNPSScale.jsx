import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useCreateScale } from '../../../../hooks/useCreateScale';
import CustomTextInput from '../../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../../components/Fallback';
import { EmojiPicker } from '../../../../components/emoji-picker';
import { useFetchUserContext } from "../../../../contexts/fetchUserContext";
import BtnLinks from '../../../../components/data/BtnLinks';
import axios from 'axios';

const BtnLinkCreateNPSScale = () => {

  const {  
    popuOption, 
    setPopupOption,
    sName, 
    setSName,
    scaleLinks,
    setScaleLinks,
    isModalOn, 
    setIsNodalOn } = useFetchUserContext()
  const [timeOn, setTimeOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);
  const [displayedTime, setDisplayedTime] = useState(0);
  const userinfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);



  const createScale = useCreateScale();

  const navigateTo = useNavigate();
  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const btnLinkRequiredField = ['instance', 'name']
console.log('====================================');

console.log('====================================');
  const [formData, setFormData] = useState({
    scaleType: '',
    instance: '',
    apiKey: '',
  });

  const handleToggleEmojiPellete = () => {
    setShowEmojiPalette(!showEmojiPalette);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'fomat' && value === 'Emojis') {
      handleToggleEmojiPellete();
    } else {
      setShowEmojiPalette(false);
    }
  };

  const handleSave = async() =>{
    BtnLinks.length = 0 
    const payload = {
      // "api_key": formData.apiKey,
      "workspace_id": userinfo.userinfo.client_admin_id,
      "username": userinfo.userinfo.username,
      "scale_name": formData.name,
      "no_of_instances": formData.instance,
      "scale_type": 'nps scale'
    };
    console.log(payload);

    for (const field of btnLinkRequiredField) {
      if (!formData[field]) {
        toast.error(`Please complete the "${field}" field.`);
        return;
      }
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://100035.pythonanywhere.com/addons/create-scale/',
        payload
      );
      const result = response.data;
      setScaleLinks(result.urls)
      console.log(result, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
      if (result.error) {
        setIsLoading(false);
        return;
      } else {
        setIsNodalOn(true)
        toast.success('nps scale button links created successfully');
        navigateTo(
          `/100035-DowellScale-Function/btnLinksnps-scale-settings/${result.scale_id}`
        );
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
    <div className="flex flex-col items-center justify-center w-full h-screen font-Montserrat">
      <div style={{filter: showMasterlinkModal ? 'blur(8px)' : '', pointerEvents: showMasterlinkModal ? 'none' : ''}}>
        <div>
        <div className="w-full" style={{marginTop: '10px'}}>
             {/* <CustomTextInput
              label="API key"
              name="apiKey"
              value={formData.apiKey}
              type="text"
              handleChange={handleChange}
              placeholder="Enter API key"
            /> */}
          </div>
          <label htmlFor="scaleType" className="mb-1 ml-1 text-sm font-normal" style={{marginTop: '10px'}}>
          Scale type
            </label>
           <select
              label="Select a scale type"
              name="scaleType"
              className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
              value={formData.scaleType}
              onChange={handleChange}
            >
              <option value='nps'>nps</option>
            </select>
        </div>
        <div className="w-full" style={{marginTop: '10px'}}>
             <CustomTextInput
              label="no. of instances"
              name="instance"
              value={formData.instance}
              type="text"
              handleChange={handleChange}
              placeholder="enter no. instances"
            />
          </div>
          <div className="w-full" style={{marginTop: '10px'}}>
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
    </div>
  );
};

export default BtnLinkCreateNPSScale;
