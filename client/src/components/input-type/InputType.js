import React , {useState} from 'react'
import './inputType.css'
import styled, { keyframes } from 'styled-components';
import { bounceInRight, bounceInLeft } from 'react-animations';
import { FormControl ,Radio, RadioGroup, FormControlLabel, FormLabel} from '@mui/material'
import { Box } from '@mui/system';


const bounceRight = keyframes`${bounceInRight}`;
const bounceLeft = keyframes`${bounceInLeft}`;

const BouncyRight = styled.div`
  animation: 1s ${bounceRight};
`;

const BouncyLeft = styled.div`
  animation: 1s ${bounceLeft};
`;

const InputType = () => {
    const [inputType, setInputType] = useState("")
    const [role, setRole] = useState("")

    console.log(inputType, role)
    
    if(role === "admin"){
        window.location.replace("/admin")
    }else if(role === "user"){
        window.location.replace("/response")
    }else{
        console.log("Invalid option")
    }


    // if(inputType === "front end programmer" && role === "admin"){
    //     window.location.replace("/admin")
    // }else if(inputType === "front end programmer" && role === "user"){
    //     window.location.replace("/response")
    // }else if(inputType === "client" && role === "admin"){
    //     window.location.replace("/admin")
    // }else if(inputType === "client" && role === "user"){
    //     window.location.replace("/response")
    // }else{
    //     console.log("Invalid option")
    // }


  return (
    // <div className='input-container'>
    //     <h1>Welcome To Nps Scale</h1>
    //     {/* <h1>Are you a Front End Dev or Client</h1> */}
    //     <Box className='input-content'>
    //         <div className="formInput">
    //             <FormControl>
    //                 <FormLabel id="demo-row-radio-buttons-group-label" style={{fontWeight:"bold", color: "black",display:"flex", justifyContent:"center"}}>Are you a Front End Dev or a Client</FormLabel>
    //                 <RadioGroup
    //                     row
    //                     aria-labelledby="demo-row-radio-buttons-group-label"
    //                     name="row-radio-buttons-group"
    //                     onChange={(e)=>setInputType(e.target.value)}
    //                     style={{display:"flex", justifyContent:"center"}}
    //                 >
    //                     <BouncyLeft>
    //                     <FormControlLabel value="front end programmer" control={<Radio />} label="Front End Programmer" />
    //                     </BouncyLeft>
    //                     <BouncyRight>
    //                     <FormControlLabel value="client" control={<Radio />} label="Client" />
    //                     </BouncyRight>

    //                 </RadioGroup>
    //             </FormControl>
    //         </div>
    //         {
    //             inputType && 
                
    //             <div className="formInput">
    //                 <FormControl>
    //                     <FormLabel id="demo-row-radio-buttons-group-label" style={{fontWeight:"bold", color: "black"}}>Are you an Admin or a User</FormLabel>
    //                     <RadioGroup
    //                         row
    //                         aria-labelledby="demo-row-radio-buttons-group-label"
    //                         name="row-radio-buttons-group"
    //                         onChange={(e)=>setRole(e.target.value)}
    //                         style={{display:"flex", justifyContent:"center"}}
    //                     >
    //                         <BouncyLeft>
    //                             <FormControlLabel value="admin" control={<Radio />} label="Admin" />
    //                         </BouncyLeft>
    //                         <BouncyRight>
    //                             <FormControlLabel value="user" control={<Radio />} label="User" />
    //                         </BouncyRight>

    //                     </RadioGroup>
    //                 </FormControl>
    //             </div>
    //         }

    //         <div className='summary'>
    //             {
    //                 inputType && <p>InputType: <span className='summary-content'>{inputType}</span></p>

    //             }
    //             {
    //                 role && <p className='summary-content-b'>Role: <span className='summary-content'>{role}</span></p>

    //             }
    //         </div>
    //     </Box>
        
    // </div>

    <div className='input-container'>
        {/* <h1>Welcome To Nps Scale</h1> */}
        {/* <h1>Are you a Front End Dev or Client</h1> */}
        <Box className='input-content'>
            <h1 style={{color: "silver"}}>Select a role to access the scale</h1>
                
            <div className="formInput">
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label" style={{fontWeight:"bold", color: "black"}}>Are you an Admin or a User</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        onChange={(e)=>setRole(e.target.value)}
                        style={{display:"flex", justifyContent:"center"}}
                    >
                        <BouncyLeft>
                            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                        </BouncyLeft>
                        <BouncyRight>
                            <FormControlLabel value="user" control={<Radio />} label="User" />
                        </BouncyRight>

                    </RadioGroup>
                </FormControl>
            </div>
            

            <div className='summary'>
                {/* {
                    inputType && <p>InputType: <span className='summary-content'>{inputType}</span></p>

                } */}
                {
                    role && <p className='summary-content-b'>Role: <span className='summary-content'>{role}</span></p>

                }
            </div>
        </Box>
        
    </div>
  )
}

export default InputType