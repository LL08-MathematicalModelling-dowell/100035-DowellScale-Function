import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import useGetSingleStapleScale from "../../../hooks/useGetSingleStapleScale";
import { useUpdateResponse } from "../../../hooks/useUpdateResponse";
import CustomTextInput from "../../../components/forms/inputs/CustomTextInput";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";
import { EmojiPicker } from '../../../components/emoji-picker';

const UpdateStapleScale = () => {

  const { slug } = useParams();
  const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
  const [timeOn, setTimeOn] = useState(false);
  const { _id, settings } = (sigleScaleData && sigleScaleData[0]) || {};
  const [isLoading, setIsLoading] = useState(false);
  const updateResponse = useUpdateResponse();
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);

  const navigateTo = useNavigate();
  const scores = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

//   console.log(slug, 'slug');
//   console.log(settings, 'settings');
  

    const orientation = settings?.orientation
    const username = settings?.username
    const scalecolor = settings?.scalecolor
    const scale_upper_limit = settings?.scale_upper_limit
    const roundcolor = settings?.roundcolor
    const fontcolor = settings?.fontcolor
    const fontstyle = settings?.fontstyle
    const fomat = settings?.fomat
    const time = settings?.time
    const name = settings?.name
    const left = settings?.left
    const right = settings?.right    
    
  const [updateFormData, setUpdateFormData] = useState(
      Object.assign({}, { 
        orientation,
        username,
        scalecolor,
        scale_upper_limit,
        roundcolor,
        fontcolor,
        fomat,
        time,
        name,
        left,
        right,
        fontstyle
      })
  );



  const updatePayload = {
    scale_id: _id,
    // user: "yes",
    // username: "Ndoneambrose",
    orientation:updateFormData.orientation,
    scale_upper_limit:updateFormData.scale_upper_limit,
    scalecolor:updateFormData.scalecolor,
    roundcolor:updateFormData.roundcolor,
    fontcolor:updateFormData.fontcolor,
    fomat:updateFormData.fomat === 'Emojis' ? selectedEmojis : scores,
    time: updateFormData?.time,
    name:updateFormData.name,
    left:updateFormData.left,
    right:updateFormData.right,
    fontstyle:updateFormData.fontstyle,
  }

  const handleToggleEmojiPellete = ()=>{
    setShowEmojiPalette(!showEmojiPalette)
  }

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]:value });
    if (name === 'fomat' && value === 'Emojis') {
      handleToggleEmojiPellete();
    } else {
      setShowEmojiPalette(false);
    }
  }

  const handleToggleTime = ()=>{
    setTimeOn(!timeOn);
  } 

  const orientationDB = ['Vertical', 'Horizontal']
  const format = ['Numbers', 'Emojis']


  useEffect(() => {
      const fetchData = async () => {
        try {
            await fetchSingleScaleData(slug);
        } catch (error) {
            console.error("Error fetching single scale data:", error);
        }
      }
      fetchData();
  }, [slug]);

  useEffect(() => {
    if (settings) {
      setUpdateFormData({
        orientation: settings?.orientation || '',
        scale_upper_limit:settings?.scale_upper_limit || 10,
        scale_id: _id || '',
        user: true, 
        username: settings?.username || '',
        scalecolor: settings?.scalecolor || '',
        roundcolor: settings?.roundcolor || '',
        fontcolor: settings?.fontcolor || '',
        fomat: settings?.fomat || '',
        time: settings?.time || 0,
        name: settings?.name || '',
        text: settings?.text || '',
        left: settings?.left || '',
        right: settings?.right || '',
        fontstyle: settings?.fontstyle || '',
      });
      
    }
  }, [settings]);

  const handleUpdateStapleScale = async()=>{
    if(!fomat){
      toast.error('please select a format to proceed');
      return
    }
    try {
        setIsLoading(true);
        const {status, data} = await updateResponse('staple-scale', updatePayload);
        if(status===200){
          toast.success('successfully updated');
          setTimeout(()=>{
              navigateTo(`/100035-DowellScale-Function/staple-scale-settings/${sigleScaleData[0]?._id}`);
          },2000)
        }
    } catch (error) {
        console.log(error)
    }finally{
        setIsLoading(false)
    }
}

  if(loading || isLoading){
    return <Fallback />
  }

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen font-Montserrat'>
      <div className='w-full p-5 border md:w-7/12'>
        <div className='w-7/12 m-auto'>
            <h2 className="mb-3 text-sm font-medium text-center capitalize">update { settings?.name } scale</h2>
        </div>
        <div className='grid grid-cols-2 gap-3 mb-10 md:grid-cols-3'>
          <div className='w-full'>
            <CustomTextInput 
                label='name'
                name='name'
                value={updateFormData.name}
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
                  value={updateFormData.orientation}
                  onChange={handleChange}
              >
                  <option value={''}>-- Select orientation  --</option>
                  {orientationDB.map((orientation, i) => (
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
                  value={updateFormData.scalecolor}
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
                  value={updateFormData.roundcolor}
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
                  value={updateFormData.fontcolor}
                  onChange={handleChange}
                  className="w-full"
              />
          </div>
          <div className='w-full'>
              <label htmlFor="format" className="mb-1 ml-1 text-sm font-normal">format</label>
              <select 
                  label="Select a format" 
                  name="fomat" 
                  className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                  value={updateFormData.fomat}
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
                value={updateFormData.left}
                type='text'
                handleChange={handleChange}
                placeholder='enter scale left'
            />
          </div>
          <div className='w-full'>
            <CustomTextInput 
                label='right'
                name='right'
                value={updateFormData.right}
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
                      />
                  )
              }
              
          </div>
        </div>
        <Button primary width={'full'} onClick={ handleUpdateStapleScale }>Update scale</Button>
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
  )
}

export default UpdateStapleScale