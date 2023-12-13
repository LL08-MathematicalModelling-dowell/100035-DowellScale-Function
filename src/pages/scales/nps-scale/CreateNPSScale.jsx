import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useCreateScale } from '../../../hooks/useCreateScale';
import CustomTextInput from '../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../components/Fallback';
import { EmojiPicker } from '../../../components/emoji-picker';

const CreateNPSScale = () => {
  const [timeOn, setTimeOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);
  const [displayedTime, setDisplayedTime] = useState(0);
  const userinfo = JSON.parse(sessionStorage.getItem('userInfo'));



  const createScale = useCreateScale();

  const navigateTo = useNavigate();
  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const requiredFields = ['name', 'left', 'right', 'center', 'orientation'];
console.log('====================================');

console.log('====================================');
  const [formData, setFormData] = useState({
    orientation: '',
    //   scale_id: "64e8744218f0a24fb16b0ee2",
    user: 'yes', //should be boolean
    username: userinfo.userinfo.username || '',
    scalecolor: '#E5E7E8',
    numberrating: 10,
    no_of_scales: 3,
    roundcolor: '#E5E7E8',
    fontcolor: '#E5E7E8',
    fomat: 'numbers',
    time: 0,
    template_name: 'testing5350',
    name: '',
    text: 'good+neutral+best',
    left: '',
    right: '',
    center: '',
    // scale-category: "nps scale",
    scaleCategory: 'nps scale',
    show_total_score: 'true', //should be boolean
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
  const handleToggleTime = () => {
    setTimeOn(!timeOn);
  };

  const orientation = ['Vertical', 'Horizontal'];
  const format = ['Numbers', 'Emojis'];

  const handleSubmitNPSScale = async () => {
    const payload = {
      orientation: formData.orientation,
      scale_id: '64e8744218f0a24fb16b0ee2',
      user: 'yes', //should be boolean
      username: userinfo.userinfo.username || '',
      scalecolor: formData.scalecolor,
      numberrating: 10,
      no_of_scales: formData.no_of_scales,
      roundcolor: formData.roundcolor,
      fontcolor: formData.fontcolor,
      fomat: formData.fomat === 'Emojis' ? selectedEmojis : scores,
      time: formData.time,
      template_name: 'testing5350',
      name: formData.name,
      text: 'good+neutral+best',
      left: formData.left,
      right: formData.right,
      center: formData.center,
      // scale-category: "nps scale",
      scaleCategory: 'nps scale',
      show_total_score: 'true', //should be boolean
    };

    console.log(payload);

    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please complete the "${field}" field.`);
        return;
      }
    }
    try {
      setIsLoading(true);
      const response = await createScale('nps-scale', payload);
      if (response.status === 201) {
        toast.success('scale created');
        // setTimeout(()=>{
        //     navigateTo(`/nps-scale-settings/${response?.data?.data?.scale_id}`)
        // },2000)
        navigateTo(
          `/100035-DowellScale-Function/nps-scale-settings/${response?.data?.data?.scale_id}`
        );
      }
    } catch (error) {
      console.log(error);
      toast.success('an error occured');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen font-Montserrat">
      <div className="w-full p-5 border md:w-7/12">
        <div className="flex justify-between">
          <h2 className="mb-3 text-sm font-medium text-center capitalize">
            set up your Ranking
          </h2>
          {timeOn && (
            <p>
              You have about{' '}
              <span className="font-bold text-primary">{displayedTime}</span>{' '}
              seconds to submit your form
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-10 md:grid-cols-3">
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
              value={formData.orientation}
              onChange={handleChange}
            >
              <option value={''}>-- Select orientation --</option>
              {orientation.map((orientation, i) => (
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
              value={formData.scalecolor}
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
              value={formData.roundcolor}
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
              value={formData.fontcolor}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <label htmlFor="format" className="mb-1 ml-1 text-sm font-normal">
              format
            </label>
            <select
              label="Select a format"
              name="fomat"
              className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
              value={formData.fomat}
              onChange={handleChange}
            >
              <option value={''}>-- Select format --</option>
              {format.map((format, i) => (
                <option key={i}>{format}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <CustomTextInput
              label="left"
              name="left"
              value={formData.left}
              type="text"
              handleChange={handleChange}
              placeholder="enter scale left"
            />
          </div>
          <div className="w-full">
            <CustomTextInput
              label="center"
              name="center"
              value={formData.center}
              type="text"
              handleChange={handleChange}
              placeholder="enter scale center"
            />
          </div>
          <div className="w-full">
            <CustomTextInput
              label="right"
              name="right"
              value={formData.right}
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
                value={formData.time}
                handleChange={handleChange}
                onBlur={handleBlurTime}
              />
            )}
          </div>
          <div className="w-full">
            <CustomTextInput
              label="No of scales"
              name="no_of_scales"
              value={formData.no_of_scales}
              type="text"
              handleChange={handleChange}
              placeholder="Enter no of scales"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          {isLoading ? (
            <Fallback />
          ) : (
            <button
              onClick={handleSubmitNPSScale}
              className="py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium"
            >
              Save
            </button>
          )}
          <button className="py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium">
            Preview
          </button>
        </div>
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
  );
};

export default CreateNPSScale;
