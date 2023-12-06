import React from 'react';

const MasterlinkSuccessModal = ({ handleToggleMasterlinkModal }) => {
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
          <p>Master link Finalized Successfully</p>
        </div>
      </div>
    </div>
  );
};

export default MasterlinkSuccessModal;
