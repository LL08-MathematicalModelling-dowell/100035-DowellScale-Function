import React, { useState, useEffect } from 'react'
import {Box, Button, Container, Modal, Alert, AlertTitle} from '@mui/material'
// import axios from 'axios'
import { SketchPicker } from 'react-color';
import "./settings.css";
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { addResponses, addSetting, settingsFetch } from "../../redux/ApiCalls";
import {useDispatch, useSelector} from 'react-redux'
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import Scale from '../scale/Scale';
import CustomForm from './CustomForm';


const ScaleSettings = () => {
  const[direction, setDirection] = useState("")
  const[color, setColor] = useState("")
  const[colorHexCode, setColorHexCode] = useState("");                                                                                      
  const[timing, setTiming] = useState("")
  const[time, setTime] = useState("")
  const[label, setLabel] = useState("")
  const[labelA, setLabelA] = useState("")
  const[labelB, setLabelB] = useState("")
  const[view, setView] = useState(true)
  const[system, setSystem] = useState(true)
  const[settings, setSettings] = useState({})
  const[currentPage, setCurrentPage] = useState(0)
  const[score, setScore] = useState("")
  const scale = [0,1,2,3,4,5,6,7,8,9,10]
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch()


  const sysSettings = useSelector(state=>state.settings.settings)
  
 
  
  useEffect(()=>{
    settingsFetch(dispatch)
  },[dispatch])

  useEffect(()=>{
    addResponses(dispatch, {score})
  },[dispatch,score])

  const PER_PAGE = 6;

  const handlePageClick = ({selected: selectedPage}) => {
    console.log("selectedPage",selectedPage+1)
    setCurrentPage(selectedPage)
  };

  const offset = currentPage * PER_PAGE
  const pageCount = Math.ceil(sysSettings.length / PER_PAGE)
  
  
  const style = {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 250,
    borderRadius: "20px",
    bgcolor: '#EFFFF8',
    border: '2px solid #000',
    color:"#7AE6C0",
    boxShadow: 24,
    p: 6,
  };

  

  const newSetting ={
    direction,color, hex_color:colorHexCode,timing, time,label,labelA,labelB
  }


  const systemSettings = (e) =>{
    e.preventDefault()
    setView(false)
    setSystem(false)
  }

  

  const saveSettings = (e)=>{
    e.preventDefault()
    setSettings(newSetting)
    addSetting(dispatch, newSetting)
    setView(true)
    // window.location.replace('/products')
  }

  const saveScore = (id) => {
    setScore(id)
  };

 
  

  const handleSysSettings = async(id) => {
    try{
      const res = await axios.get(`http://127.0.0.1:8000/nps-single-setting/${id}/`)
      setSettings(res.data)
      setDirection(res.data.direction)
      setColor(res.data.color)
      setColorHexCode(res.data.hex_color)
      setTiming(res.data.timing)
      setTime(res.data.time)
      setLabel(res.data.label)
      setLabelA(res.data.labelA)
      setLabelB(res.data.labelB)
      setView(true)
    }catch(err){
        console.log(err)
    } 
  };
  
 
  
  return (
    <Box>
      <p className='back-btn' onClick={()=> window.location.replace("/")}>BACK</p>
      

      {/* check if scale displayed or settings form */}
      {/* backgroundColor: "#edfaf7" */}

      { 
        view ?
        <div style={{width:"600px", margin:"auto", marginTop:'15px', backgroundColor:"#fff", paddingBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between", alignItems:"center", marginBottom:"20px",backgroundColor:"#7AE6C0", color:"#fff", padding:"5px"}}>
            {
              Object.keys(settings).length === 0 ?
              <ArrowBackIcon onClick={()=> window.location.replace("/")} sx={{dispaly:"flex", justifyContent:"flex-start", cursor:"pointer"}}/>

              :

              <ArrowBackIcon onClick={()=> window.location.reload()} sx={{dispaly:"flex", justifyContent:"flex-start", cursor:"pointer"}}/>

            }
            <h1>Default</h1>
            <div></div>
          </div>
          { Object.keys(settings).length === 0 && <p style={{paddingLeft:"10px", letterSpacing:"1.5px"}} >Use our default settings:</p> }
          <Container sx={{display: 'flex',flexDirection: 'column', justifyContent:"center", width:`${direction === "vertical" ? "300px" : "585px"}`, marginTop:'15px',paddingTop:"10px" ,backgroundColor:"#EFFFF8"}}>
            <div style={{display: "flex", justifyContent: `${direction === "vertical" ? "space-between" : "center"}`, alignItems:"center", marginBottom:"20px", color:"#7AE6C0"}}>
              {/* <h1 style={{fontSize: `${direction === "vertical" ? "35px" : ""}`}}>
                Scale 
              </h1> */}
              <h2>
                Scale Display
              </h2>
              {
                direction === "vertical" && <SettingsIcon onClick={()=>setView(false)}/>
              }
            </div>

            {/* Check if the settings is provided */}

            {
              Object.keys(settings).length === 0 ?

                // default scale preview
                <Scale direction={"horizontal"} timing={"True"} scale={scale} label={"text"} labelA={"Won't recommend"} labelB={"Highly recommend"} colorHexCode={"#fff"} saveScore={saveScore} /> 

                :

                // settings displayed after client admin updates settings
                <>
                {
                  score ?
                  <Alert severity="success" style={{marginBottom:"20px"}}>
                    <AlertTitle>Success</AlertTitle>
                    Your response score is: <strong>{score}</strong>
                  </Alert>
        
                  :
                  
                  <Scale direction={direction} time={time} timing={timing} scale={scale} label={label} labelA={labelA} labelB={labelB} colorHexCode={colorHexCode} saveScore={saveScore} /> 
                }
                </>                        
            }          
          </Container>
          {
            Object.keys(settings).length === 0 &&
            <>
            <div style={{display:"flex", justifyContent:"flex-start", alignItems:"center", marginLeft:"10px", marginTop:"20px"}}>
              <p style={{letterSpacing:"1.5px"}}>Want to do manual settings go here: </p>
              <Button variant="contained" type='submit' sx={{display: "flex", justifyContent: "flex-start", width:"130px", marginLeft:"10px", backgroundColor:"#ccc"}} onClick={handleOpen}>Settings <SettingsIcon style={{marginLeft:"10px"}}/></Button>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <h2>What do you want to do</h2>
                <Button id="modal-modal-description" component="h2" sx={{mt: 4,color:"#7AE6C0", display:"flex", justifyContent:"center", fontWeight:"bold"}} onClick={()=>setView(false)}>
                  1. Custom Settings <SettingsIcon style={{marginLeft:"10px"}}/>
                </Button>
                <Button id="modal-modal-description" sx={{ mt: 4 , color:"#7AE6C0", display:"flex", justifyContent:"center",  fontWeight:"bold"}} component="h2" onClick={systemSettings}>
                  2. System Settings <SettingsSuggestIcon style={{marginLeft:"10px"}}/>
                </Button>
              </Box>
            </Modal>
            </>
          }
          
        </div>

        :

        // settings form
        <div style={{ width: `${system ==="false" ? '600px' : '480px'}` ,margin:"auto", marginTop:'15px', backgroundColor:"#fff", paddingBottom:"20px"}}>
          <div style={{display: "flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px",backgroundColor:"#7AE6C0", color:"#fff", padding:"5px"}}> 
            <ArrowBackIcon onClick={()=> window.location.reload()} sx={{dispaly:"flex", justifyContent:"start", cursor:"pointer"}}/>
            { system === false ? <h1>Previous Settings</h1>: <h1>Settings</h1>}
            
            <SettingsIcon />
          </div>

          <Container sx={{display: 'flex',flexDirection: 'column', justifyContent:"center", marginTop:'15px',padding:"10px 40px" }}>
           
            {
              system ?
                <CustomForm saveSettings={saveSettings} setDirection={setDirection} setColor={setColor} color={color} colorHexCode={colorHexCode} setColorHexCode={setColorHexCode} setTiming={setTiming} timing={timing} setTime={setTime} setLabel={setLabel} label={label} setLabelA={setLabelA} setLabelB={setLabelB} SketchPicker={SketchPicker}/>
                
              :
                <div>
                  <div className='row'>
                    {
                      sysSettings.slice(offset, offset + PER_PAGE).map(setting =>(
                        <div className='setting-container' key={setting.id} onClick={()=> handleSysSettings(setting.id)}>
                          <Scale setting={setting} system={system}/> 
                        </div>
                      ))
                    }
                  </div>

                  <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                  />
                </div>
            }
            
          </Container>
        </div>
      }
    </Box>
  )
}

export default ScaleSettings