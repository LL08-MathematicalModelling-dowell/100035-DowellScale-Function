import React, { useState } from 'react';
// import 'emoji-picker-react/dist/index.css';
import Picker  from 'emoji-picker-react';

const EmojiPicker = ({ handleToggleEmojiPellete }) =>{
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [currentEmoji, setCurrentEmoji] = useState(null)

  const handleEmojiClick = (e) => {
    if (selectedEmojis.length < 11 && !selectedEmojis.includes(e.emoji)) {
      setSelectedEmojis(prevSelectedEmojis => [...prevSelectedEmojis, e.emoji]);
    }
  };

  const handleSubmit = () => {
    // Handle submission logic, e.g., send selectedEmojis to a server or perform any other action.
    console.log('Selected emojis:', selectedEmojis);
  };

  return (
    <div className='h-screen w-full bg-primary/60 fixed top-o left-0 grid grid-cols place-items-center'>
        
        <div className=''>
        <button onClick={handleToggleEmojiPellete} className='mb-2 py-1 px-3 rounded-full border border-white text-white'>x</button>
            <h2>Select up to 11 unique emojis:</h2>
            <div className='flex items-center gap-3'>
                {selectedEmojis.map((emoji)=>(
                    <button>{emoji}</button>
                ))}
            </div>
            <Picker onEmojiClick={(event)=>handleEmojiClick(event)} />
            <button onClick={handleSubmit} disabled={selectedEmojis.length === 0}
                className='bg-primary text-white py-2 px-4'
            >Submit</button>
        </div>
    </div>
  );
}

export default EmojiPicker;
