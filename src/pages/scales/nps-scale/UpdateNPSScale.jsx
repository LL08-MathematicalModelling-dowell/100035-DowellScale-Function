/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import useGetSingleScale from '../../../hooks/useGetSingleScale';
import { useUpdateResponse } from '../../../hooks/useUpdateResponse';
import CustomTextInput from '../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../components/Fallback';
import { Button } from '../../../components/button';
import { EmojiPicker } from '../../../components/emoji-picker';

const UpdateNPSScale = ({ handleToggleUpdateModal }) => {
  const { slug } = useParams();
  const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
  const [timeOn, setTimeOn] = useState(false);
  const { _id, settings } = (sigleScaleData && sigleScaleData[0]) || {};
  const [isLoading, setIsLoading] = useState(false);
  const updateResponse = useUpdateResponse();
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [scale, setScale] = useState(null);

  // const navigateTo = useNavigate();
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const orientation = scale?.orientation;
  // const scale_id = scale?.scale_id
  // const user = scale?.user
  const username = scale?.username;
  const scalecolor = scale?.scalecolor;
  const numberrating = scale?.numberrating;
  const no_of_scales = scale?.no_of_scales;
  const roundcolor = scale?.roundcolor;
  const fontcolor = scale?.fontcolor;
  const fomat = scale?.fomat;
  const time = scale?.time;
  const template_name = scale?.template_name;
  const name = scale?.name;
  const text = scale?.text;
  const left = scale?.left;
  const right = scale?.right;
  const center = scale?.center;
  const show_total_score = scale?.show_total_score;

  const [updateFormData, setUpdateFormData] = useState(
    Object.assign(
      {},
      {
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
        scale_category: 'nps scale',
      }
    )
  );

  const updatePayload = {
    scale_id: _id,
    user: 'yes',
    username: 'Ndoneambrose',
    orientation: updateFormData.orientation,
    scalecolor: updateFormData.scalecolor,
    numberrating: updateFormData.numberrating,
    no_of_scales: updateFormData.no_of_scales,
    roundcolor: updateFormData.roundcolor,
    fontcolor: updateFormData.fontcolor,
    fomat: updateFormData.fomat === 'Emojis' ? selectedEmojis : scores,
    time: updateFormData.time,
    template_name: updateFormData.template_name,
    name: updateFormData.name,
    text: updateFormData.text,
    left: updateFormData.left,
    right: updateFormData.right,
    center: updateFormData.center,
    // scale-category: "nps scale",
    show_total_score: updateFormData.show_total_score,
  };

  const handleToggleEmojiPellete = () => {
    setShowEmojiPalette(!showEmojiPalette);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
    if (name === 'fomat' && value === 'Emojis') {
      console.log('fomat selected:', value);
      handleToggleEmojiPellete();
    } else {
      setShowEmojiPalette(false);
    }
  };

  const handleToggleTime = () => {
    setTimeOn(!timeOn);
  };

  const orientationDB = ['Vertical', 'Horizontal'];
  const format = ['Numbers', 'Emojis'];

  const handleFetchSingleScale = async () => {
    try {
      // await fetchSingleScaleData(scaleId);
      setIsLoading(true);
      const response = await axios.get(
        `https://100035.pythonanywhere.com/api/nps_create/?scale_id=${slug}`
      );
      console.log(response.data.success);
      setScale(response.data.success);
    } catch (error) {
      console.error('Error fetching single scale data:', error);
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleFetchSingleScale();
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (scale) {
      setUpdateFormData({
        orientation: scale?.orientation || '',
        scale_id: slug || '',
        user: true,
        username: scale?.username || '',
        scalecolor: scale?.scalecolor || '',
        numberrating: scale?.numberrating || 0,
        no_of_scales: scale?.no_of_scales || 0,
        roundcolor: scale?.roundcolor || '',
        fontcolor: scale?.fontcolor || '',
        fomat: scale?.fomat || '',
        time: scale?.time || 0,
        template_name: scale?.template_name || '',
        name: scale?.name || '',
        text: scale?.text || '',
        left: scale?.left || '',
        right: scale?.right || '',
        center: scale?.center || '',
        // scale-category: "nps scale",
        show_total_score: scale?.show_total_score || 0,
      });
    }
  }, [scale]);

  const handleUpdateNPSScale = async () => {
    if (!fomat) {
      toast.error('please select a format to proceed');
      return;
    }
    try {
      setIsLoading(true);
      const { status } = await updateResponse('nps-scale', updatePayload);
      if (status === 200) {
        toast.success('successfully updated');
        setTimeout(() => {
          location.reload();
          // navigateTo(`/nps-scale-settings/${sigleScaleData[0]?._id}`);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return <Fallback />;
  }

  return (
    <div className="fixed top-0 left-0 flex flex-col justify-center w-full h-screen bg-primary/40">
      <div className="relative w-9/12 p-5 m-auto bg-white border">
        <button
          onClick={handleToggleUpdateModal}
          className="absolute px-2 text-white bg-red-500 rounded-full right-2 top-2"
        >
          x
        </button>
        <div className="flex flex-col items-center justify-center w-full font-Montserrat">
          <div className="w-full p-5 border md:w-9/12">
            <div className="w-7/12 m-auto">
              <h2 className="mb-3 text-sm font-medium text-center capitalize">
                update {settings?.name} scale
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
                  name="scalecolor"
                  autoComplete="given-name"
                  type="color"
                  placeholder="scale color"
                  value={updateFormData.scalecolor}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="roundcolor">round color</label>
                <input
                  label="round color"
                  name="roundcolor"
                  autoComplete="given-name"
                  type="color"
                  placeholder="round color"
                  value={updateFormData.roundcolor}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="fontcolor">font color</label>
                <input
                  label="font color"
                  name="fontcolor"
                  autoComplete="given-name"
                  type="color"
                  placeholder="font color"
                  value={updateFormData.fontcolor}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="w-full">
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
                  value={updateFormData.fomat}
                  onChange={handleChange}
                >
                  <option value={'Select format'}>-- Select format --</option>
                  {format.map((format, i) => (
                    <option key={i}>{format}</option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <CustomTextInput
                  label="left"
                  name="left"
                  value={updateFormData.left}
                  type="text"
                  handleChange={handleChange}
                  placeholder="enter scale left"
                />
              </div>
              <div className="w-full">
                <CustomTextInput
                  label="center"
                  name="center"
                  value={updateFormData.center}
                  type="text"
                  handleChange={handleChange}
                  placeholder="enter scale center"
                />
              </div>
              <div className="w-full">
                <CustomTextInput
                  label="right"
                  name="right"
                  value={updateFormData.right}
                  type="text"
                  handleChange={handleChange}
                  placeholder="enter scale right"
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
                  value={updateFormData.no_of_scales}
                  type="text"
                  handleChange={handleChange}
                  placeholder="Enter no of scales"
                />
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
  );
};

export default UpdateNPSScale;
