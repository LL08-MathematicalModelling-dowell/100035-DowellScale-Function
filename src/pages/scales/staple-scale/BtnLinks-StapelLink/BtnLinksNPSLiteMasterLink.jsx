/* eslint-disable react/prop-types */
import  { useRef, useState } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { toast } from 'react-toastify';

const NPSLiteMasterLink = ({
  handleToggleMasterlinkModal,
  link,
  publicLinks,
  image,
}) => {
  const textToCopy = link;
  const textAreaRef = useRef(null);
  let scores = ["Good", "Better", "Best"];

  const [selectedScore, setSelectedScore] = useState(-1);

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
    toast.success(val === link ? 'Masterlink copied to clipboard!': 'Link copied to clipboard!');
  };
  return (
    // <div className="fixed top-0 left-0 flex flex-col justify-center w-full h-screen bg-primary/40">
      <div className="relative w-9/12 px-5 py-20 m-auto bg-white border">
        <button
          onClick={handleToggleMasterlinkModal}
          className="absolute px-2 text-white bg-red-500 rounded-full right-2 top-2"
        >
          x
        </button>
        {/* <div className="flex flex-col items-center justify-center w-full font-Montserrat">
        </div> */}
        {/* <h2 className="flex items-center justify-center">MASTERLINK</h2> */}
        <div className="flex flex-col items-center justify-center w-full font-Montserrat ">
          <div className="w-full p-5 border">
            {/* <div className="flex items-center justify-center p-2 border"> */}
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

         <div className="flex flex-col items-center justify-center w-full font-Montserrat">
            <div className={`grid gap-3 md:px-2 py-6 grid-cols-11 md:px-1 items-center justify-center place-items-center  bg-blue`} style={{ backgroundColor: 'blue', display:'flex', alignItems:'center', justifyContent: 'center', fontSize: 'small', overflow: 'auto', borderRadius: '4px', width: '80%', margin: 'auto', marginTop: '30px', marginBottom: '40px'}}>
            {scores.map((score, index) =>(
        <button
            key={index}
            id = {index}
            onClick={() => handleSelectScore(score, index)}
            className={`rounded-lg ${index  === selectedScore
              ? 'bg-white' : 'bg-primary text-white'} text-primary h-[3.8rem] w-[14.8rem]`}
                            >
                              {score}
                            </button>
                 ))}
            </div>

          <table className="w-full border">
           <tr className="w-full border" style={{border: "1px solid rgb(0, 0, 0)"}}>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Serial number</th>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Button links</th>
            <th style={{border: "1px solid rgb(0, 0, 0)"}}>Copy link buttons</th>
           </tr>

            {publicLinks.map((public_link, index) => (
              // <div
              //   className="flex items-center justify-center p-4 border"
              //   key={index}
              // >
                // <p className="overflow-hidden overflow-ellipsis whitespace-nowrap ">
                //   {public_link}
                // </p>
                // <AiOutlineCopy
                //   onClick={() => handleCopyClick(public_link)}
                //   size={50}
                //   color="bg-[#1A8753]"
                //   className="inline text-[#1A8753] cursor-pointer "
                // />
              // </div>

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
            ))}
            </table>
          </div>
          </div>
        </div>
        {/* <button onClick={handleCopyClick}>Copy to Clipboard</button> */}
      {/* </div> */}
    </div>
  );
};

export default NPSLiteMasterLink;
