/* eslint-disable react/prop-types */
import  { useEffect, useRef, useState } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import './BtnLinkNPSMasterlink.css'
import { toast } from 'react-toastify';
import { LuEye } from "react-icons/lu";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import BtnLinks from '../../../../components/data/BtnLinks';
import { MdDone } from "react-icons/md";

const BtnLinkNPSMasterlink = ({
  handleToggleMasterlinkModal,
  link,
  publicLinks,
  image,
}) => {
  const textToCopy = link;
  const textAreaRef = useRef(null);
  let scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [selectedScore, setSelectedScore] = useState(-1);
  const data = `import { useState } from 'react';
  import axios from 'axios';
  
  const Scale = () => {
    const buttonLinks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
    const [loadingIndex, setLoadingIndex] = useState(null);
    const [responseReceived, setResponseReceived] = useState(false);
  
    const handleButtonClick = async (link, index) => {
      setLoadingIndex(index);
      try {
        const response = await axios.get(link);
        console.log(response);
        setResponseReceived(true);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingIndex(null);
      }
    };
  
    return (
      <div className='flex flex-col items-center justify-center w-full font-Montserrat'>
        {responseReceived === false &&<h2 className="scale-heading">
          On a scale of 0-10, how likely are you to recommend the product to a
          friend or a colleague?
        </h2>}
        {responseReceived ? (
          <div className="response-message" style={{}}>Thank you for your response!</div>
        ) : (
          <div className="w-full grid gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center border m-10">
            {buttonLinks.map((link, index) => (
              <button
                key={index}
                className="rounded-lg bg-primary text-[black] h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]"
                onClick={() => handleButtonClick(link, index)}
                disabled={loadingIndex === index}
              >
                {loadingIndex === index ? (
                  <div className="rounded-full border-4 border-t-white animate-spin h-[1rem] w-[1rem] border-3px m-auto"></div>
                ) : (
                  index
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default Scale;`
  const [showPreview, setShowPreview] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(()=>{
    const CreateArrayLinks = () =>{
      publicLinks.map((link, index)=>{
        if(BtnLinks.includes(`'${publicLinks[index][1][0]}'`) == false){
          BtnLinks.push(`'${publicLinks[index][1][0]}'`)
        }
      })
  }
  CreateArrayLinks()
   },[]);
   
  const handleCopyClick = (val) => {
    // Create a textarea element, set its value, and append it to the document
    const textArea = document.createElement('textarea');
    textArea.value = val;
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the textarea from the document
    document.body.removeChild(textArea);

    // Optionally, you can provide user feedback (e.g., show a tooltip)
    toast.success(val === link ? 'Masterlink copied to clipboard!': 'link copied to clipboard!');
  };

  const selectAllLinks = (val) =>{
    // Create a textarea element, set its value, and append it to the document
    const textArea = document.createElement('textarea');
    textArea.value = `[${val}]`;
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the textarea from the document
    document.body.removeChild(textArea);

    // Optionally, you can provide user feedback (e.g., show a tooltip)
    toast.success('links copied to clipboard!');
  }

  const handleCopyCodeSnippet = (val) =>{
    // Create a textarea element, set its value, and append it to the document
    const textArea = document.createElement('textarea');
    textArea.value = val;
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the textarea from the document
    document.body.removeChild(textArea);

    // Optionally, you can provide user feedback (e.g., show a tooltip)
    setShowSuccess(true);
  }

  const handleSelectScore = (score, index) => {
    if(typeof(score) === "string") {
      setSelectedScore(index);
    }else {
      setSelectedScore(score);
    }
  };

  const handlePreview = () => {
    setShowPreview(true)
    setShowCode(false)
    setShowSuccess(false)
  }

  const handleShowCode = () => {
    setShowPreview(false)
    setShowCode(true)
  }

  return (
    // <div className="fixed top-0 left-0 flex flex-col justify-center w-full h-screen bg-primary/40">
    // <div className="flex flex-col justify-center w-full h-screen bg-primary/40" style={{backgroundColor: 'red'}}>
      <div className="absolute w-9/12 px-5 py-100 m-auto bg-white border top-2">
        <button
          onClick={handleToggleMasterlinkModal}
          className="absolute px-2 text-white bg-red-500 rounded-full right-2 top-2"
        >
          x
        </button>
        {/* <div className="flex flex-col items-center justify-center w-full font-Montserrat">
        </div> */}
        {/* <h2 className="flex items-center justify-center">MASTERLINK</h2> */}
        <div className='w-full' style={{display:'flex', justifyContent:'flex-end', marginTop: '25px', marginLeft: '10px'}}>
          <button 
          className='prev-btn' style={{display:'flex', alignItems:'center', padding: '10px', border:'1px solid lightgray', height: '30px', borderRadius: '2px', backgroundColor: showPreview ? 'whitesmoke' : ''}}onClick={handlePreview}><LuEye style={{marginRight:'6px'}} />Preview</button>
          <button onClick={handleShowCode} className='code-btn' style={{display:'flex', alignItems:'center', padding: '10px', border:'1px solid lightgray', height: '30px', borderRadius: '2px', backgroundColor: showCode ? 'whitesmoke' : ''}}><MdOutlineKeyboardArrowLeft /><MdOutlineKeyboardArrowRight style={{marginRight:'6px'}} />Code</button>
          </div>
        <div className="flex flex-col items-center justify-center w-full font-Montserrat">
          <div className="w-full p-5 ">
            {/* <div className="flex items-center justify-center p-2 border" style={{backgroundColor: 'red'}}> */}
              {/* <div className="flex flex-col items-center justify-center w-full overflow-hidden overflow-ellipsis whitespace-nowrap"> */}
              <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {textToCopy}
                {/* https://www.qrcodereviews.uxlivinglab.online/api/v3/masterlink/?api_key=14962975258431394286 */}
                {/* <span className="flex items-center justify-center">
                  <img src={image} alt="" width={100} height={100} />
                </span> */}
              </p>
              {/* </div> */}
              {/* <AiOutlineCopy
                onClick={() => handleCopyClick(link)}
                size={50}
                color="bg-[#1A8753]"
                className="inline text-[#1A8753] cursor-pointer "
              /> */}
            {/* </div> */}
            {showCode &&<div className='bg-gray-500'>
              <div className='w-full' style={{display:'flex', alignItems: 'center', justifyContent: 'flex-end',}}>
              {showSuccess === false ? <div className="inline text-[white] cursor-pointer" 
              onClick={() => handleCopyCodeSnippet(data)}
              style={{marginRight:'10px', marginTop:'6px'}}>
              <AiOutlineCopy
                  size={25}
                  color="bg-[#1A8753]"
                  className="inline text-[white] cursor-pointer"
                  style={{marginTop:'6px'}}
              /> copy code</div>:
              <MdDone 
              size={25}
              color="bg-[#1A8753]"
              className="inline text-[white] cursor-pointer"
              style={{marginRight:'10px', marginTop:'6px'}}
              />}
              </div>
              <SyntaxHighlighter 
              language="javascript" 
              style={darcula} 
              customStyle={{
                   height: "400px",
                   marginBottom: '40px'
                 }}>
                {data}
              </SyntaxHighlighter>
            </div>}
            <div className="flex flex-col items-center justify-center w-full font-Montserrat">
            {/* <div className={`grid gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center  bg-blue`} style={{ backgroundColor: 'blue', display:'flex', alignItems:'center', justifyContent: 'center', fontSize: 'small', overflow: 'auto', borderRadius: '4px', width: '80%', margin: 'auto', marginTop: '30px', marginBottom: '40px'}}> */}
            {showPreview &&<div className='button-container grid gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center border m-10'>
            {scores.map((score, index) =>(
           <button
            key={index}
            id = {index}
            onClick={() => handleSelectScore(score, index)}
            className={`rounded-lg ${
                        index == selectedScore
                        ? `bg-primary`
                                  : `bg-[green] text-[black}]`
                              }  h-[2rem] w-[2rem] md:h-[3rem] md:w-[3rem]`}
                            >
                              {score}
                      </button>
      ))}
      </div>}
    {/* </div> */}
            {/* <h2 className='flex items-center justify-center mt-8'>PUBLIC LINKS</h2> */}
            {/* <div className="flex items-center justify-center p-2 border">
              <p className="overflow-hidden overflow-ellipsis whitespace-nowrap ">
                https://www.qrcodereviews.uxlivinglab.online/api/v3/masterlink/?api_key=14962975258431394286
              </p>
              <AiOutlineCopy
                onClick={() => handleCopyClick(link)}
                size={50}
                color="bg-[#1A8753]"
                className="inline text-[#1A8753] cursor-pointer "
              />
            </div> */}

          <table className="w-full border">
           <tr className="w-full border" style={{border: "1px solid rgb(0, 0, 0)"}}>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Serial number</th>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Button links</th>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Copy link buttons</th>
           </tr>

            {publicLinks.map((public_link, index) => (
              // <div
              //   className=" border"
              //   key={index}
              // >
                <tr
                  key={index} className="border" style={{border: "1px solid rgb(0, 0, 0)"}}>
                  <td style={{border: "1px solid rgb(0, 0, 0)"}}>{index}</td>
                  <td style={{display:'block', width: '700px', whiteSpace: 'nowrap', overflow:'hidden', textOverflow:'ellipsis', }} className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap">{publicLinks[index][1][0]}</td>
                  <td style={{border: "1px solid rgb(0, 0, 0)"}}><AiOutlineCopy
                  onClick={() => handleCopyClick(publicLinks[index][1][0])}
                  size={50}
                  color="bg-[#1A8753]"
                  className="inline text-[#1A8753] cursor-pointer "
                /></td>
                </tr>
                // {/* <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                //   {publicLinks[index][1][0]}
                // </p>
                // <AiOutlineCopy
                //   onClick={() => handleCopyClick(public_link)}
                //   size={50}
                //   color="bg-[#1A8753]"
                //   className="inline text-[#1A8753] cursor-pointer "
                // /> */}
              // </div>
            ))}
            </table>
            </div>
            <div style={{width: '92%', display:'flex', alignItems: 'center', justifyContent:'flex-end'}}>
              <p>Copy all</p>
              <AiOutlineCopy
                  onClick={() => selectAllLinks(BtnLinks)}
                  size={50}
                  color="bg-[#1A8753]"
                  className="inline text-[#1A8753] cursor-pointer "
                />
            </div>
          </div>
        </div>
        {/* <button onClick={handleCopyClick}>Copy to Clipboard</button> */}
      </div>
    // </div>
  );
};

export default BtnLinkNPSMasterlink;
