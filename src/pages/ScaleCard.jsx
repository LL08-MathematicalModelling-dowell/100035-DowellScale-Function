import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';
import { useFetchUserContext } from "../contexts/fetchUserContext";
import './ScaleCard.css'

function ScaleCard({ scaleName, description, imageSource, slug, btnLinks, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const {  
    popuOption, 
    setPopupOption,
    sName, 
    setSName,
    BtnLink,
    scaleIndex,
    setScaleIndex,
    setBtnLink } = useFetchUserContext()


  const [ showScaleTitle, setShowScaleTitle ] = useState()
  const handleMouseEnter = () => {
    setShowScaleTitle (true);
  };

  const handleMouseLeave = () => {
    setShowScaleTitle(false);
  };

  const handleLearnMoreBtn = () => {
    console.log("GGGGGGGGGGG", index)
    setShowScaleTitle (true);
    setScaleIndex(index)
    setPopupOption(true)
    setSName(slug)
    setBtnLink(btnLinks)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // fontFamily:"Changa, sans-serif",
        fontOpticalSizing: "auto",
        fontStyle: "normal",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* <ReactCardFlip isFlipped={isFlipped} containerStyle={{height:"300px",marginBottom:"20px"}} flipDirection="vertical"> */}
        <div className='card'
         
        >
          <h6 style={{fontFamily:"Changa, sans-serif", fontWeight:'500', color:'white',display:showScaleTitle ? 'block' : 'none'}}>{scaleName}</h6>

          <img className='scaleImage' src={imageSource} alt={scaleName} />
          <h6 style={{fontFamily:"Changa, sans-serif", fontWeight:'500', marginTop:'15px', display: showScaleTitle ? 'none' : 'block'}}>{scaleName}</h6>
          <button
            style={{
              width: '130px',
              // padding: '10px',
              fontSize: '20px',
              background: 'white',
              fontWeight: '400',
              borderRadius: '5px',
              marginTop: '12px',
              display: showScaleTitle ? 'block' : 'none'
            }}
            onClick={handleLearnMoreBtn}
            // disabled = {slug !== 'nps-lite-scale' ? true : false}
          >
            Learn more
          </button>
        </div>
        {/* <div
          style={{
            width: '500px',
            height: '200px',
            fontSize: '30px',
            margin: '20px',
            borderRadius: '4px',
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            textAlign: 'center',
            padding: '10px',
            // display: 'none'
          }}
        >
          <button
          onClick={() => setPopupOption(false)}
          className="px-2 text-black bg-white rounded-full right-2 top-2"
        >
          x
        </button>
          <div>
            <img src={imageSource} style={{ width: '100px',height:"100px",objectFit:"cover",borderRadius:"10%",background:"black" }} alt={scaleName} />
          </div>
          <div>
            <h3>{scaleName}</h3>
            <p style={{ fontSize: 'small' }}>{description}</p>
            <button
              to={`/100035-DowellScale-Function/${slug}`}
              key={slug}
              className="w-full py-3 text-center text-white capitalize rounded-lg bg-primary hover:bg-gray-700/50"
              style={{ width: '250px', marginTop:"10px" }}
              onClick={() => handleExploreBtn(slug)}
             >
             Start creating
          </button>
          </div>
        </div> */}
      {/* </ReactCardFlip> */}
    </div>
  );
}

export default ScaleCard;
