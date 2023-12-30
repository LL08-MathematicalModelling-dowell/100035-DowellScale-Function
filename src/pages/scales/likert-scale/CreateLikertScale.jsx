import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import { useCreateScale } from '../../../hooks/useCreateScale';
import CustomTextInput from '../../../components/forms/inputs/CustomTextInput';
import Fallback from '../../../components/Fallback';
import { EmojiPicker } from '../../../components/emoji-picker';

const CreateLikertScale = () => {
  const [timeOn, setTimeOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);
  const [displayedTime, setDisplayedTime] = useState(0);
  const [labelArray, setLabelArray] = useState([])
  const [likertScores, setLikertScores] = useState([])
  const [firstScore, setFirstScore] = useState("")
  const [scoreCount, setScoreCount] = useState(0)
  const userinfo = JSON.parse(sessionStorage.getItem('userInfo'));



  const createScale = useCreateScale();

  const navigateTo = useNavigate();
  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const requiredFields = ['name', 'orientation'];
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
    labelSelection: '',
    labelType: '',
    time: 0,
    template_name: 'testing5350',
    name: '',
    label_scale_input: '',
    // scale-category: "nps scale",
    scaleCategory: 'nps scale',
    show_total_score: 'true', //should be boolean
  });

  const handleToggleEmojiPellete = () => {
    setShowEmojiPalette(!showEmojiPalette);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  //   if (name === 'fomat' && value === 'Emojis') {
  //     handleToggleEmojiPellete();
  //   } else {
  //     setShowEmojiPalette(false);
  //   }
  // };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'labelType' && value === 'Emojis') {
      handleToggleEmojiPellete();
    } else {
      setShowEmojiPalette(false);
    }
  };
  
  const firstSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3']
  const secSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3', 'Enter text 4']
  const thirdSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3', 'Enter text 4', 'Enter text 5']
  const fourthSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3', 'Enter text 4', 'Enter text 5', 'Enter text 6', 'Enter text 7']
  const fifthSelArray = ['Enter text 1', 'Enter text 2', 'Enter text 3', 'Enter text 4', 'Enter text 5', 'Enter text 6', 'Enter text 7', 'Enter text 8', 'Enter text 9']
  const handleLabelSelection = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'labelSelection') {
       if(value === '3 points scale') {
        setLabelArray(firstSelArray)
       }else if (value === '4 points scale') {
        setLabelArray(secSelArray)
       } else if (value === '5 points scale') {
        setLabelArray(thirdSelArray)
       } else if (value === '7 points scale') {
        setLabelArray(fourthSelArray)
       } else if (value === '9 points scale') {
        setLabelArray(fifthSelArray)
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
  
  const fontStyles = [
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
  const labelType = ['text', 'emoji'];
  const labelSelection = ['3 points scale', '4 points scale', '5 points scale', '7 points scale', '9 points scale']

  const handleSubmitLikertScale = async () => {
    const firstScaleInput = document.getElementById('0')
    if(firstScaleInput) {
      likertScores.includes(firstScaleInput.value) === true ? "" : likertScores.push(firstScaleInput.value)   
    }

    const secondScaleInput = document.getElementById('1')
    if(secondScaleInput) {
      likertScores.includes(secondScaleInput.value) === true ? "" : likertScores.push(secondScaleInput.value)      
    }

    const thirdScaleInput = document.getElementById('2')
    if(thirdScaleInput) {
      likertScores.includes(thirdScaleInput.value) === true ? "" : likertScores.push(thirdScaleInput.value)     
    }

    const fourthScaleInput = document.getElementById('3')
    if(fourthScaleInput) {
      likertScores.includes(fourthScaleInput.value) === true ? "" : likertScores.push(fourthScaleInput.value)    
    }

    const fifthScaleInput = document.getElementById('4')
    if(fifthScaleInput) {
      likertScores.includes(fifthScaleInput.value) === true ? "" : likertScores.push(fifthScaleInput.value)     
    }

    const sixthScaleInput = document.getElementById('5')
    if(sixthScaleInput) {
      likertScores.includes(sixthScaleInput) === true ? "" : likertScores.push(sixthScaleInput)      
    }

    const seventhScaleInput = document.getElementById('6')
    if(seventhScaleInput) {
      likertScores.includes(seventhScaleInput.value) === true ? "" : likertScores.push(seventhScaleInput.value)      
    }

    const eighthScaleInput = document.getElementById('7')
    if(eighthScaleInput) { 
      likertScores.includes(eighthScaleInput.value) === true ? "" : likertScores.push(eighthScaleInput.value)     
    }

    const ninethScaleInput = document.getElementById('8')
    if(ninethScaleInput) {
      likertScores.push(ninethScaleInput.value)      
    }
    const payload = {
      username : userinfo.userinfo.username || '',
      scale_name : formData.name,
      no_of_scales : formData.no_of_scales,
      orientation : formData.orientation,
      font_color : formData.fontcolor,
      round_color : formData.roundcolor,
      label_type : formData.labelType,
      label_scale_selection : likertScores.length,
      label_scale_input : likertScores,
      time : formData.time,
      fontstyle: formData.fontStyle,
      scale_color: formData.scalecolor,
      fomat: formData.labelType,
      user: "yes"
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
      const response = await createScale('likert-scale', payload);
      if (response.status === 200) {
        toast.success('scale created');
        console.log(JSON.parse(response.data.success));
        // setTimeout(()=>{
        //     navigateTo(`/nps-scale-settings/${response?.data?.data?.scale_id}`)
        // },2000)
        navigateTo(
          `/100035-DowellScale-Function/likert-scale-settings/${JSON.parse(response.data.success).inserted_id}`
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
      <h2 className="mb-3 text-sm font-medium text-center capitalize">
            set up your Likert scale
          </h2>
      <div className="w-full p-5 border md:w-7/12">
        <div className="flex justify-between">
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
          <div className="flex flex-col gap-2">
            <label htmlFor="fontcolor">font style</label>
            <select
              label="Select a font style"
              name="fontStyle"
              className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
              value={formData.fontStyle}
              onChange={handleChange}
              >
                <option style={{ fontSize: "11px" }}>Select font style</option>
                    {fontStyles.map((fontStyle, index) => (
                      <option key={index} value={fontStyle}>
                        {fontStyle}
                        </option>
                          ))}
                  </select>
          </div>
          <div className="w-full">
            <label htmlFor="labelType" className="mb-1 ml-1 text-sm font-normal">
              Label Type
            </label>
            <select
              label="Select a label type"
              name="labelType"
              className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
              value={formData.labelType}
              onChange={handleChange}
            >
              <option value={''}>-- Select label --</option>
              {labelType.map((labelType, i) => (
                <option key={i}>{labelType}</option>
              ))}
            </select>
            <div>
              {labelArray.map((txt, i) =>(
                <CustomTextInput
                name="label_scale_input"
                type="text"
                key={i}
                id={i}
                placeholder= {txt}
                value= {setScore(i)}
                handleChange={(e) =>handleScoreInputs(i, e)}
              />
              ))}
            
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
              value={formData.labelSelection}
              onChange={handleLabelSelection}
            >
              <option value={''}>-- Select choice --</option>
              {labelSelection.map((labelType, i) => (
                <option key={i}>{labelType}</option>
              ))}
            </select>
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
              onClick={handleSubmitLikertScale}
              className="py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium"
            >
              Save
            </button>
          )}
          {/* <button className="py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium">
            Preview
          </button> */}
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

export default CreateLikertScale;
