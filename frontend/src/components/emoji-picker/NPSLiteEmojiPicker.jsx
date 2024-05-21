import React, { useState } from 'react';
import { toast } from 'react-toastify';
// import 'emoji-picker-react/dist/index.css';
import Picker  from 'emoji-picker-react';

const NPSLiteEmojiPicker = ({ handleToggleEmojiPellete, selectedEmojis, setSelectedEmojis, no_of_emojis}) =>{

  const handleEmojiClick = (e) => {
    if(selectedEmojis.includes(e.emoji)){
      toast.error('only one emoji type can be selected');
      return;
    }
 
    if (selectedEmojis.length < no_of_emojis && !selectedEmojis.includes(e.emoji)) {
      setSelectedEmojis(prevSelectedEmojis => [...prevSelectedEmojis, e.emoji]);
    }
  };

  const handleSubmit = () => {
    if(selectedEmojis.length < no_of_emojis){
      toast.error('selected number of emojis cannot be less than ', no_of_emojis);
      return;
    }
    console.log('Selected emojis:', selectedEmojis);
    handleToggleEmojiPellete();
  };

  return (
    <div className='h-screen w-full bg-primary/60 absolute top-o left-0 grid grid-cols place-items-center'>
        <div className='relative p-10 bg-white'>
        <button onClick={handleToggleEmojiPellete} className='mb-2 py-1 px-3 rounded-full border border-primary text-primary absolute top-10 right-5'>x</button>
            <h2 className='my-3 text-primary'>Select up to {no_of_emojis} unique emojis:</h2>
            <div className='flex items-center gap-3'>
                {selectedEmojis.map((emoji)=>(
                    <button>{emoji}</button>
                ))}
            </div>
            <Picker onEmojiClick={(event)=>handleEmojiClick(event)} />
            <div className='flex justify-end'>
            <button onClick={handleSubmit} disabled={selectedEmojis.length === 0}
                className='bg-primary text-white py-2 px-4 '
            >Submit Selected Emoji's</button>
            </div>
        </div>
    </div>
  );
}

export default NPSLiteEmojiPicker;
