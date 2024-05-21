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
import { LikertEmojiPicker } from '../../../components/emoji-picker';

const UpdateLikertScale = ({ handleToggleUpdateModal }) => {
  const { slug } = useParams();
  const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
  const [timeOn, setTimeOn] = useState(false);
  const { _id, settings } = (sigleScaleData && sigleScaleData[0]) || {};
  const [isLoading, setIsLoading] = useState(false);
  const updateResponse = useUpdateResponse();
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [labelArray, setLabelArray] = useState([])
  const [scale, setScale] = useState(null);
  const [scoreCount, setScoreCount] = useState(0)
  const [firstScore, setFirstScore] = useState("")
  const [showEmojiInput, setShowEmojiInput] = useState(false)

  // const navigateTo = useNavigate();
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const orientation = scale?.orientation;
  const fontstyle = scale?.fontstyle;
  // const scale_id = scale?.scale_id
  // const user = scale?.user
  const username = scale?.username;
  const label_type = scale?.label_type;
  const scalecolor = scale?.scalecolor;
  const numberrating = scale?.numberrating;
  const no_of_scales = scale?.no_of_scales;
  const round_color = scale?.round_color;
  const fontcolor = scale?.font_color;
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
        labelSelection: '',
        no_of_scales,
        round_color,
        fontcolor,
        fomat,
        time,
        template_name,
        name,
        text,
        left,
        right,
        center,
        fontstyle,
        label_type,
        show_total_score,
        scale_category: 'nps scale',
      }
    )
  );

  const updatePayload = {
      scale_id : slug,
      scale_name : updateFormData.name,
      no_of_scales : updateFormData.no_of_scales,
      orientation : updateFormData.orientation,
      font_color : updateFormData.fontcolor,
      round_color : updateFormData.round_color,
      label_type : updateFormData.label_type,
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
  const labelType = ['text', 'emoji'];
  const labelSelection = ['3 points scale', '4 points scale', '5 points scale', '7 points scale', '9 points scale']
  const fontStyleDB = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Comic Sans MS",
    "Impact",
    "Arial Black",
  ];

  const firstSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3']
  const secSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3', 'Enter text 4']
  const thirdSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3', 'Enter text 4', 'Enter text 5']
  const fourthSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3', 'Enter text 4', 'Enter text 5', 'Enter text 6', 'Enter text 7']
  const fifthSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3', 'Enter text 4', 'Enter text 5', 'Enter text 6', 'Enter text 7', 'Enter text 8', 'Enter text 9']

  const handleLabelSelection = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
    if (name === 'labelSelection') {
       if(value === '3 points scale') {
        setLabelArray(firstSelArray)
        if(updateFormData.label_type === 'emoji') {
          setShowEmojiPalette(!showEmojiPalette)
        }
       }else if (value === '4 points scale') {
        setLabelArray(secSelArray)
        if(updateFormData.label_type === 'emoji') {
          setShowEmojiPalette(!showEmojiPalette)
        }
       } else if (value === '5 points scale') {
        setLabelArray(thirdSelArray)
        if(updateFormData.label_type === 'emoji') {
          setShowEmojiPalette(!showEmojiPalette)
        }
       } else if (value === '7 points scale') {
        setLabelArray(fourthSelArray)
        if(updateFormData.label_type === 'emoji') {
          setShowEmojiPalette(!showEmojiPalette)
        }
       } else if (value === '9 points scale') {
        setLabelArray(fifthSelArray)
        if(updateFormData.label_type === 'emoji') {
          setShowEmojiPalette(!showEmojiPalette)
        }
       }else {
        setLabelArray([])
       }
    }
  };

  const handleScoreInputs = (id, e) => {
    e.preventDefault()
    if(id === 0) {
      setFirstScore(e.target.value)
      setScoreCount(0)
    } else if(id === 1) {
      setFirstScore(e.target.value)
      setScoreCount(1)
    }else if(id === 2) {
      setFirstScore(e.target.value)
      setScoreCount(2)
    }else if(id === 3) {
      setFirstScore(e.target.value)
      setScoreCount(3)
    }else if(id === 4) {
      setFirstScore(e.target.value)
      setScoreCount(4)
    }else if(id === 5) {
      setFirstScore(e.target.value)
      setScoreCount(5)
    }else if(id === 6) {
      setFirstScore(e.target.value)
      setScoreCount(6)
    }else if(id === 7) {
      setFirstScore(e.target.value)
      setScoreCount(7)
    }else if(id === 8) {
      setFirstScore(e.target.value)
      setScoreCount(8)
    }
  }

  const setScore = (i) => {
    if(scoreCount === i) {
      return firstScore
    }
  }

  const handleFetchSingleScale = async () => {
    try {
      // await fetchSingleScaleData(scaleId);
      setIsLoading(true);
      const response = await axios.get(
        `https://100035.pythonanywhere.com/likert/likert-scale_create?scale_id=${slug}`
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
        round_color: scale?.round_color || '',
        fontcolor: scale?.fontcolor || '',
        fomat: scale?.fomat || '',
        time: scale?.time || 0,
        template_name: scale?.template_name || '',
        name: scale?.name || '',
        text: scale?.text || '',
        left: scale?.left || '',
        right: scale?.right || '',
        center: scale?.center || '',
        fontstyle: scale?.fontstyle,
        label_type: scale?.label_type,
        // scale-category: "nps scale",
        show_total_score: scale?.show_total_score || 0,
      });
    }
  }, [scale]);

  const handleUpdateLikertScale = async () => {
    if (!fomat) {
      toast.error('please select a format to proceed');
      return;
    }
    try {
      setIsLoading(true);
      const { status } = await updateResponse('likert-scale', updatePayload);
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
                  name="round_color"
                  autoComplete="given-name"
                  type="color"
                  placeholder="round color"
                  value={updateFormData.round_color}
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
              <div className="flex flex-col gap-2">
            <label htmlFor="fontstyle">font style</label>
            <select
              label="Select a font style"
              name="fontstyle"
              className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
              value={updateFormData.fontstyle}
              onChange={handleChange}
              >
                {/* <option style={{ fontSize: "11px" }}>Select font style</option>
                    {fontStyles.map((fontStyle, index) => (
                      <option key={index} value={fontStyle}>
                        {fontStyle}
                        </option>
                          ))} */}
                  <option value={''}>-- Select font style --</option>
                  {fontStyleDB.map((fontstyle, i) => (
                    <option key={i}>{fontstyle}</option>
                  ))}
                  </select>
          </div>
              <div className="w-full">
              <label htmlFor="labelType" className="mb-1 ml-1 text-sm font-normal">
              Label Type
            </label>
            <select
              label="Select a label type"
              name="label_type"
              className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
              value={updateFormData.label_type}
              onChange={handleChange}
            >
              <option value={''}>-- Select label --</option>
              {labelType.map((labelType, i) => (
                <option key={i}>{labelType}</option>
              ))}
            </select>
              <div className="w-full">
              {updateFormData.label_type === "text" ? (labelArray.map((txt, i) =>(
                <CustomTextInput
                name="label_scale_input"
                type="text"
                key={i}
                id={i}
                placeholder= {txt}
                value= {setScore(i)}
                handleChange={(e) =>handleScoreInputs(i, e)}
              />
              ))) : (selectedEmojis.map((emoji, i) =>(
                <CustomTextInput
                name="label_scale_input"
                type="text"
                key={i}
                id={i}
                placeholder= {showEmojiInput === true ? "": ""}
                value= {selectedEmojis[i]}
                handleChange={(e) =>handleScoreInputs(i, e)}
              />
              )))}
              </div>
              </div>
              <div className="w-full">
              <label htmlFor="labelSelection" className="mb-1 ml-1 text-sm font-normal">
              Label scale selection
            </label>
            <select
              label="Select a label type"
              name="labelSelection"
              className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
              value={updateFormData.labelSelection}
              onChange={handleLabelSelection}
            >
              <option value={''}>-- Select choice --</option>
              {labelSelection.map((labelType, i) => (
                <option key={i}>{labelType}</option>
              ))}
            </select>
              </div>
              {/* <div className="w-full">
                <CustomTextInput
                  label="right"
                  name="right"
                  value={updateFormData.right}
                  type="text"
                  handleChange={handleChange}
                  placeholder="enter scale right"
                />
              </div> */}
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
            <Button primary width={'full'} onClick={handleUpdateLikertScale}>
              Update scale
            </Button>
          </div>
          {showEmojiPalette && (
            <LikertEmojiPicker
            setSelectedEmojis={setSelectedEmojis}
            selectedEmojis={selectedEmojis}
            no_of_emojis = {labelArray.length}
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

export default UpdateLikertScale;
