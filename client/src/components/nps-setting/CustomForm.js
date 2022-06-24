import React from 'react'
import {Button, FormControl ,TextField, Radio, RadioGroup, FormControlLabel, FormLabel, Select,MenuItem, InputLabel} from '@mui/material'


const CustomForm = ({saveSettings,setDirection,setColor,color,colorHexCode,setColorHexCode,setTiming,timing,setTime,setLabel,label,setLabelA,setLabelB,SketchPicker}) => {
  return (
    <form onSubmit={saveSettings}>
        <div className="formInput">
            <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label" style={{fontWeight:"bold", color: "black"}}>Direction:</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={(e)=>setDirection(e.target.value)}
                    style={{marginLeft:"40px"}}
                >
                    <FormControlLabel value="vertical" control={<Radio />} label="Vertical" />
                    <FormControlLabel value="horizontal" control={<Radio />} label="Horizontal" />
                </RadioGroup>
            </FormControl>
        </div>


        <div className="formInput">
            <label>Color: </label>
            <FormControl variant="filled" sx={{ width: 220 }}>
            <InputLabel id="demo-simple-select-filled-label">Color</InputLabel>
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                onChange={(e)=>setColor(e.target.value)}
                > 
                <MenuItem value="True">Yes</MenuItem>
                <MenuItem value="False">No</MenuItem>
            </Select>
            </FormControl>
        </div>

        {
            color === "True" && 
            <div className="formInput">
            <label>Pick Color:</label>
            <SketchPicker color={colorHexCode} onChange={e => setColorHexCode(e.hex)} />
            </div> 
        }

        <div className="formInput">
            <label>Time: </label>
            <FormControl variant="filled" sx={{ width: 220 }}>
            <InputLabel id="demo-simple-select-filled-label">Time</InputLabel>
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                onChange={(e)=>setTiming(e.target.value)}
                > 
                <MenuItem value="True">Yes</MenuItem>
                <MenuItem value="False">No</MenuItem>
            </Select>
            </FormControl>
        </div>

        {
            timing === "True" && 
            <div className="formInput">
            <label>Set time(sec) : </label>
            <TextField type="number" sx={{width:220}} id="filled-basic" placeholder='Time in seconds' variant="filled"  onChange={(e)=>{e.target.value > 1 && setTime(e.target.value) }}/>
            </div> 
        }

        <div className="formInput">
            <label>Label: </label>
            <FormControl variant="filled" sx={{ width: 220 }}>
            <InputLabel id="demo-simple-select-filled-label">Label</InputLabel>
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                onChange={(e)=>setLabel(e.target.value)}
                > 
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="image">Image</MenuItem>
            </Select>
            </FormControl>
        </div>

        {
            label === "text" && 
            <>
            <div className="formInput">
            <label>Label A : </label>
            <TextField type="text" sx={{width:220}} id="filled-basic" placeholder='Enter label for variable a' variant="filled"  onChange={(e)=>setLabelA(e.target.value)}/>
            </div> 

            <div className="formInput">
            <label>Label B : </label>
            <TextField type="text" sx={{width:220}} id="filled-basic" placeholder='Enter label for variable b' variant="filled"  onChange={(e)=>setLabelB(e.target.value)}/>
            </div> 
            </>
        }
        <Button variant="contained" type='submit'  sx={{margin:'auto',backgroundColor:"#7AE6C0", display: "flex", justifyContent: "center", alignItems:"center"}}>Save and Display</Button>
    </form>
  )
}

export default CustomForm