import React, { useRef } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-toastify";

const NPSMasterlink = ({ handleToggleMasterlinkModal, link, publicLinks }) => {
  const textToCopy = link;
  const textAreaRef = useRef(null);

  const handleCopyClick = () => {
    // Create a textarea element, set its value, and append it to the document
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);

    // Select the text in the textarea
    textArea.select();

    // Execute the copy command
    document.execCommand("copy");

    // Remove the textarea from the document
    document.body.removeChild(textArea);

    // Optionally, you can provide user feedback (e.g., show a tooltip)
    toast.success("Masterlink copied to clipboard!");
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
        <div className="flex flex-col items-center justify-center w-full font-Montserrat">
          <p>
            {textToCopy}{" "}
            <AiOutlineCopy
              onClick={handleCopyClick}
              color="bg-[#1A8753]"
              className="inline text-[#1A8753] cursor-pointer"
            />
          </p>
        </div>
        <div>
          {publicLinks.map((link, index) => (
            <p key={index}>
              {link}{" "}
              <AiOutlineCopy
                onClick={() => handleCopyClick(link)}
                color="bg-[#1A8753]"
                className="inline text-[#1A8753] cursor-pointer"
              />
            </p>
          ))}
        </div>
        {/* <button onClick={handleCopyClick}>Copy to Clipboard</button> */}
      </div>
    </div>
  );
};

export default NPSMasterlink;
