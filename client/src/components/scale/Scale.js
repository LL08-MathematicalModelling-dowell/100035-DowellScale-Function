import { Box, Modal } from '@mui/material'
import React, { useEffect , useState} from 'react'

const Scale = ({direction, scale, label, labelA, labelB, colorHexCode, saveScore, time,setting, system}) => {
  const [openTimeOut, setOpenTimeOut] = useState(false);
  const handleOpenTimeOut = () => setOpenTimeOut(true);

  const style = {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleOpenTimeOut()
      // setOpenModal("open")
      console.log(`This will run after ${time} second!`)
    }, time*1000);
    return () => clearTimeout(timer);
  }, [time]);

  return (
    <>
      {
        system === false ? 

        <div className= {setting.direction === "horizontal" ? "scale-content-setting" : "scale-vertical-setting"} style={{ border:"2px solid #7AE6C0",marginBottom:"30px"}}>
          <div className='scale-container' style={{ display: `${setting.direction === "horizontal" ? "flex" : "block"}`}}>
            {
              setting.scale.scale.map(item=>(
                <div className='scale-box-setting' key={item} value={item} style={{backgroundColor:`${setting.hex_color}`}}>{item}</div>
              ))
            }
          </div>

          {/* check if direction is either vertical/horizontal */}

          {
            setting.direction === "vertical" ?
              <div className='scale-label-vertical-settings'>

                {/* check if label is either text/image */}

                {
                  setting.label === "text" ?
                  <>
                    <div className='label-a-setting'>{setting.labelA}</div>
                    <div className='label-b-setting'>{setting.labelB}</div>
                  </>
                  :
                  <>
                    <div className='label-a-emoji-setting'><span>😠</span></div>
                    <div className='label-b-emoji-setting'><span>😄</span></div>
                  </>
                }
                
              </div>

            :

              <div className='scale-label-horizontal-settings'>

                {/* check if label is either text/image */}

                {
                  setting.label === "text" ?
                  <>
                    <div className='label-a-setting'>{setting.labelA}</div>
                    <div className='label-b-setting'>{setting.labelB}</div>
                  </>
                  :
                  <>
                    <div className='label-a-emoji-setting'><span>😠</span></div>
                    <div className='label-b-emoji-setting'><span>😄</span></div>
                  </>
                }
              </div>
          }
        </div>

        :

        <div className= {direction === "horizontal" ? "scale-content" : "scale-vertical"} style={{border:"2px solid #7AE6C0", marginBottom:"30px"}}>
          <div className='scale-container' style={{ display: `${direction === "horizontal" ? "flex" : "block"}`}}>
            {
              scale.map(item=>(
                <div className='scale-box' key={item} value={item} style={{backgroundColor:`${colorHexCode}`}} onClick={()=>saveScore(item)}>{item}</div>
              ))
            }
          </div>

          {/* check if direction is either vertical/horizontal */}

          {
            direction === "vertical" ?
              <div className='scale-label-vertical'>

                {/* check if label is either text/image */}

                {
                  label === "text" ?
                  <>
                    <div className='label-a'>{labelA}</div>
                    <div className='label-b'>{labelB}</div>
                  </>
                  :
                  <>
                    <div className='label-a'><span>😠</span></div>
                    <div className='label-b'><span>😄</span></div>
                  </>
                }
              </div>

            :

              <div className='scale-label-horizontal'>

                {/* check if label is either text/image */}

                {
                  label === "text" ?
                  <>
                    <div className='label-a'>{labelA}</div>
                    <div className='label-b'>{labelB}</div>
                  </>
                  :
                  <>
                    <div className='label-a-emoji'><span>😠</span></div>
                    <div className='label-b-emoji'><span>😄</span></div>
                  </>
                }
              </div>
          }
        </div> 

      }

      {
        time &&
        <Modal
          open={openTimeOut}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h4>Ooops!</h4>
            <h2>Time Out!</h2>
          </Box>
        </Modal>
      } 
    </>
  )
}

export default Scale