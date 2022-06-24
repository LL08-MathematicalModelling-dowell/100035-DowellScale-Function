import {addSettings, addSettingsSuccess, addSettingsFailure, settingsStart, settingsSuccess, settingsFailure} from './SettingsSlice'
import {addResponse, addResponseSuccess, addResponseFailure} from './ResponseSlice'
import axios from 'axios'


const userReq = axios.create({
    headers:{
        'Content-Type':'multipart/form-data',
        accept:'application/json'
    }
})

// Create Settings
export const addSetting =async(dispatch, settings)=>{
    dispatch(addSettings())
    try{
        const res = await userReq.post("http://127.0.0.1:8000/nps-scale-settings/", settings)
        console.log(res)
        dispatch(addSettingsSuccess(res.data))
    }catch(err){
        console.log(err)
        dispatch(addSettingsFailure())
    }
}

// Create Response
export const addResponses =async(dispatch, response)=>{
    dispatch(addResponse())
    try{
        const res = await userReq.post("http://127.0.0.1:8000/nps-response/", response)
        console.log(res)
        dispatch(addResponseSuccess(res.data))
    }catch(err){
        // console.log(err)
        dispatch(addResponseFailure())
    }
}



// Get All Settings
export const settingsFetch =async(dispatch)=>{
    dispatch(settingsStart())
    try{
        const res = await axios.get('http://127.0.0.1:8000/all-nps-settings/')
        console.log(res)
        dispatch(settingsSuccess(res.data))
    }catch(err){
        console.log(err)
        dispatch(settingsFailure())
    }
}
