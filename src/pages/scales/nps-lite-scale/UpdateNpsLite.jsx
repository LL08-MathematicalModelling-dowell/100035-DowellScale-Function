import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import useGetSingleNpsLiteScale from "../../../hooks/useGetSingleNpsLiteScale";
import { useUpdateResponse } from "../../../hooks/useUpdateResponse";
import CustomTextInput from "../../../components/forms/inputs/CustomTextInput";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";
import { EmojiPicker } from '../../../components/emoji-picker';

const UpdateNpsLite = () => {

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
    const scalecolor = settings?.scalecolor
    const numberrating = settings?.numberrating
    const no_of_scales = settings?.no_of_scales
    const roundcolor = settings?.roundcolor
    const fontcolor = settings?.fontcolor
    const fomat = settings?.fomat
    const time = settings?.time
    const template_name = settings?.template_name
    const name = settings?.name
    const text = settings?.text
    const left = settings?.left
    const right = settings?.right
    const center = settings?.center
    const show_total_score = settings?.show_total_score
    

  const [updateFormData, setUpdateFormData] = useState(
      Object.assign({}, { 
        orientation,
        username,
        scalecolor,
        numberrating,
        no_of_scales,
        roundcolor,
        fontcolor,
        fomat,
        time,
        template_name,
        name,
        text,
        left,
        right,
        center,
        show_total_score,
        scale_category: "nps scale"
      })
  );



  const updatePayload = {
    scale_id: _id,
    user: "yes",
    username: "Ndoneambrose",
    orientation:updateFormData.orientation,
    scalecolor:updateFormData.scalecolor,
    numberrating:updateFormData.numberrating,
    no_of_scales:updateFormData.no_of_scales,
    roundcolor:updateFormData.roundcolor,
    fontcolor:updateFormData.fontcolor,
    fomat:updateFormData.fomat === 'Emojis' ? selectedEmojis : scores,
    time: updateFormData.time,
    template_name:updateFormData.template_name,
    name:updateFormData.name,
    text:updateFormData.text,
    left:updateFormData.left,
    right:updateFormData.right,
    center: updateFormData.center,
    // scale-category: "nps scale",
    show_total_score: updateFormData.show_total_score
  }

  const handleToggleEmojiPellete = ()=>{
    setShowEmojiPalette(!showEmojiPalette)
  }

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]:value });
    if (name === 'fomat' && value === 'Emojis') {
      console.log('fomat selected:', value)
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
        scalecolor: settings?.scalecolor || '',
        numberrating: settings?.numberrating || 0,
        no_of_scales: settings?.no_of_scales || 0,
        roundcolor: settings?.roundcolor || '',
        fontcolor: settings?.fontcolor || '',
        fomat: settings?.fomat || '',
        time: settings?.time || 0,
        template_name: settings?.template_name || '',
        name: settings?.name || '',
        text: settings?.text || '',
        left: settings?.left || '',
        right: settings?.right || '',
        center: settings?.center || '',
        // scale-category: "nps scale",
        show_total_score: settings?.show_total_score || 0 
      });
      
    }
  }, [settings]);
  

  const handleUpdateNPSScale = async()=>{
    console.log(updatePayload, 'payload')
    // if(!updateFormData.fomat){
    //   toast.error('please select a format to proceed');
    //   return
    // }
    try {
        setIsLoading(true);
        const { status, data } = await updateResponse('nps-lite-scale', updatePayload);
        if(status===200){
          toast.success('successfully updated');
          setTimeout(()=>{
              navigateTo(`/nps-lite-scale-settings/${sigleScaleData[0]?._id}`);
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
    <div className='h-screen w-full flex flex-col items-center justify-center font-Montserrat'>
      <div className='w-full md:w-7/12 border p-5'>
        <div className='w-7/12 m-auto'>
            <h2 className="capitalize text-center text-sm font-medium mb-3">update { settings?.name } scale</h2>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mb-10'>
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
              <label htmlFor="orientation" className="text-sm font-normal mb-1 ml-1">orientation</label>
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
              <label htmlFor="format" className="text-sm font-normal mb-1 ml-1">format</label>
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
                label='center'
                name='center'
                value={updateFormData.center}
                type='text'
                handleChange={handleChange}
                placeholder='enter scale center'
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
                      />
                  )
              }
              
          </div>
          <div className='w-full'>
            <CustomTextInput 
                label='No of scales'
                name='no_of_scales'
                value={updateFormData.no_of_scales}
                type='text'
                handleChange={handleChange}
                placeholder='Enter no of scales'
            />
          </div>
        </div>
        <Button primary width={'full'} onClick={ handleUpdateNPSScale }>Update scale</Button>
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

export default UpdateNpsLite