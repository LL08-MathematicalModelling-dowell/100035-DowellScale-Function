import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';
import { useFetchUserContext } from "../contexts/fetchUserContext";

function ScaleCard({ scaleName, description, imageSource, slug }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const {  
    popuOption, 
    setPopupOption,
    sName, 
    setSName } = useFetchUserContext()

  const handleMouseEnter = () => {
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
  };

  const handleExploreBtn = () => {
    setPopupOption(true)
    setSName(slug)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:"Changa, sans-serif",
        fontOpticalSizing: "auto",
        fontStyle: "normal"
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
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            // border:"6px solid black",
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
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
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
      <button
        to={`/100035-DowellScale-Function/${slug}`}
        key={slug}
        className="w-full py-3 text-center text-white capitalize rounded-lg bg-primary hover:bg-gray-700/50"
        style={{ width: '250px', marginTop:"10px" }}
        onClick={() => handleExploreBtn(slug)}
      >
        Explore
        </button>
    </div>
  );
}

export default ScaleCard;
