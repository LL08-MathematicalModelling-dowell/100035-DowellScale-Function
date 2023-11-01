const EmojiPalette = ({ selectedEmojis, handleEmojiSelect }) => {
    const emojis = ['😊', '😄', '😃', '😁', '🙂', '😐', '😕', '😔', '😟', '😞', '😢'];
  
    return (
      <div className="h-screen grid place-items-center w-full fixed top-0 left-0 bg-primary/70 ">
        <div className="h-48 px-10 flex justify-center items-center gap-2 bg-white rounded-[0.8rem]">
          <div className="h-1/2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(index)}
                className={`text-[2.5rem] ${selectedEmojis[index] === true ? 'text-blue-500 bg-blue-600 rounded-full' : ''}`}
                // style={{ backgroundColor: selectedEmojis[index] === true ? 'red' : '', fontSize:'2.5rem'}}
              >
                {emoji}
                {console.log(selectedEmojis[index], 'selectedEmojis ***')}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default EmojiPalette;