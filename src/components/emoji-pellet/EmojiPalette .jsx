const EmojiPalette = ({ selectedEmojis, handleEmojiSelect, handleToggleEmojiPellete }) => {
    const emojis = ['😊', '😄', '😃', '😁', '🙂', '😐', '😕', '😔', '😟', '😞', '😢'];
  
    return (
      <div className="h-screen grid place-items-center w-full fixed top-0 left-0 bg-primary/70 ">
        <div className="h-64 px-10 flex justify-center shadow-lg items-center gap-2 bg-white shadow-lg rounded-[0.8rem] relative">
          <button onClick={handleToggleEmojiPellete} className="absolute top-5 right-5 border border-primary px-2 rounded-full text-primary">x</button>
          <div className="h-1/2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(index)}
                className={`text-[2.5rem] ${selectedEmojis[index] === true ? 'text-blue-500 bg-yellow-600 rounded-full' : ''}`}
              >
                {emoji}
                {console.log(selectedEmojis[index], 'selectedEmojis ***')}
              </button>
            ))}
          </div>
          <div className="mt-10">
          <button onClick={handleToggleEmojiPellete} className="text-white bg-primary px-3 py-1 rounded-[0.8rem]">Submit</button>
          </div>
        </div>
      </div>
    );
  };

  export default EmojiPalette;