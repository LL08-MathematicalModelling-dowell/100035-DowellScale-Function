/* eslint-disable react/prop-types */
import  { useRef } from 'react';
import { AiOutlineCopy } from 'react-icons/ai';
import { toast } from 'react-toastify';

const NPSMasterlink = ({
  handleToggleMasterlinkModal,
  link,
  publicLinks,
  image,
}) => {
  const textToCopy = link;
  const textAreaRef = useRef(null);

  const handleCopyClick = () => {
    // Create a textarea element, set its value, and append it to the document
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the textarea from the document
    document.body.removeChild(textArea);

    // Optionally, you can provide user feedback (e.g., show a tooltip)
    toast.success('Masterlink copied to clipboard!');
  };
  return (
    <div className="fixed top-0 left-0 flex flex-col justify-center w-full h-screen bg-primary/40">
      <div className="relative w-9/12 px-5 py-20 m-auto bg-white border">
        <button
          onClick={handleToggleMasterlinkModal}
          className="absolute px-2 text-white bg-red-500 rounded-full right-2 top-2"
        >
          x
        </button>
        {/* <div className="flex flex-col items-center justify-center w-full font-Montserrat">
        </div> */}
        <h2 className="flex items-center justify-center">MASTERLINK</h2>
        <div className="flex flex-col items-center justify-center w-full font-Montserrat ">
          <div className="w-full p-5 border ">
            <div className="flex items-center justify-center p-2 border">
              {/* <div className="flex flex-col items-center justify-center w-full overflow-hidden overflow-ellipsis whitespace-nowrap"> */}
              <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {textToCopy}
                {/* https://www.qrcodereviews.uxlivinglab.online/api/v3/masterlink/?api_key=14962975258431394286 */}
                <span className="flex items-center justify-center">
                  <img src={image} alt="" width={100} height={100} />
                </span>
              </p>
              {/* </div> */}
              <AiOutlineCopy
                onClick={() => handleCopyClick(link)}
                size={50}
                color="bg-[#1A8753]"
                className="inline text-[#1A8753] cursor-pointer "
              />
            </div>
            <h2 className='flex items-center justify-center mt-8'>PUBLIC LINKS</h2>
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

            {publicLinks.map((public_link, index) => (
              <div
                className="flex items-center justify-center p-4 border"
                key={index}
              >
                <p className="overflow-hidden overflow-ellipsis whitespace-nowrap ">
                  {public_link}
                </p>
                <AiOutlineCopy
                  onClick={() => handleCopyClick(public_link)}
                  size={50}
                  color="bg-[#1A8753]"
                  className="inline text-[#1A8753] cursor-pointer "
                />
              </div>
            ))}
          </div>
        </div>
        {/* <button onClick={handleCopyClick}>Copy to Clipboard</button> */}
      </div>
    </div>
  );
};

export default NPSMasterlink;
