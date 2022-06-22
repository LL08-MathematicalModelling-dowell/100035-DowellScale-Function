import { Alert, AlertTitle } from '@mui/material';
import { Container } from '@mui/system'
import React,{useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { addResponses } from '../../redux/ApiCalls';
import Scale from '../scale/Scale';
import "./settings.css";

const Response = () => {
  const[score, setScore] = useState("")
  const time = 1000
  const scale = [0,1,2,3,4,5,6,7,8,9,10]
  const dispatch = useDispatch()
  console.log(score)

  useEffect(()=>{
    addResponses(dispatch, {score})
  },[dispatch,score])


  return (
    <div>
      <p className='back-btn' onClick={()=> window.location.replace("/")}>BACK</p>
      <div style={{width:"600px", margin:"auto", marginTop:'15px', backgroundColor:"#fff", paddingBottom:"20px"}}>
        <h1 style={{display: "flex", justifyContent:"center", alignItems:"center", marginBottom:"20px",backgroundColor:"#7AE6C0", color:"#fff"}}>Default</h1>
        <p style={{paddingLeft:"10px", letterSpacing:"1.5px"}}>Use our default settings:</p>
      
        <Container sx={{display: 'flex',flexDirection: 'column', justifyContent:"center", width:"585px", marginTop:'15px',paddingTop:"10px",backgroundColor:"#EFFFF8"}}>
          <div style={{display: "flex", justifyContent:"center", alignItems:"center", marginBottom:"20px", color:"#7AE6C0"}}>
            <h2>
              Scale Display
            </h2>
            {/* <SettingsIcon /> */}
          </div>
          {
            score ?
            <Alert severity="success" style={{marginBottom:"20px"}}>
              <AlertTitle>Success</AlertTitle>
              Your response score is: <strong>{score}</strong>
            </Alert>

            :
            <Scale direction={"horizontal"} timing={"True"} time={time} scale={scale} label={"text"} labelA={"Won't recommend"} labelB={"Highly recommend"} colorHexCode={"#fff"} saveScore={setScore} /> 
          }
            
        </Container>
      </div>
    </div>
  )
}

export default Response