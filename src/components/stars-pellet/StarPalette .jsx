const StarPalette = ({ selectedStars, handleStarSelect, handleToggleStarsPellete }) => {
    const stars = ['⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'];
  
    return (
      <div className="h-screen grid place-items-center w-full fixed top-0 left-0 bg-primary/70 ">
        <div className="h-64 px-10 flex justify-center shadow-lg items-center gap-2 bg-white shadow-lg rounded-[0.8rem] relative">
            <button onClick={handleToggleStarsPellete} className="absolute top-5 right-5 border border-primary px-2 rounded-full text-primary">x</button>
            {stars.map((star, index) => (
            <button
                key={index}
                onClick={() => handleStarSelect(index)}
                className={`text-3xl ${selectedStars[index] ? 'text-yellow-500' : ''}`}
            >
                {star}
            </button>
            ))}
        </div>
      </div>
    );
  };

  export default StarPalette