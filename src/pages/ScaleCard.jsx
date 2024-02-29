import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';

function ScaleCard({ scaleName, description, imageSource, slug }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseEnter = () => {
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ReactCardFlip isFlipped={isFlipped} containerStyle={{height:"300px",marginBottom:"20px"}} flipDirection="vertical">
        <div
          style={{
            width: '250px',
            height: '300px',
            background: '#b2dbbf ',
            border:"6px solid black",
            fontSize: '30px',
            color: 'black',
            margin: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // padding: '10px',
          }}
        >
          <img src={imageSource} style={{ width: '100px',height:"100px",objectFit:"cover",borderRadius:"10%",background:"black" }} alt={scaleName} />
          <h6>{scaleName}</h6>
        </div>
        <div
          style={{
            width: '250px',
            height: '300px',
            background: '#4054B2',
            fontSize: '30px',
            color: '#fff',
            margin: '20px',
            borderRadius: '4px',
            textAlign: 'center',
            padding: '10px',
          }}
        >
          <h3>{scaleName}</h3>
          <p style={{ fontSize: 'small' }}>{description}</p>
          <button
            style={{
              width: '150px',
              // padding: '10px',
              fontSize: '20px',
              background: '#f5d9fa',
              fontWeight: 'bold',
              borderRadius: '5px',
            }}
          >
            Learn more
          </button>
        </div>
      </ReactCardFlip>
      <Link
        to={`/100035-DowellScale-Function/${slug}`}
        key={slug}
        className="w-full py-3 text-center text-white capitalize rounded-lg bg-primary hover:bg-gray-700/50"
        style={{ width: '250px',marginTop:"10px" }}
      >
        Explore
      </Link>
    </div>
  );
}

export default ScaleCard;
