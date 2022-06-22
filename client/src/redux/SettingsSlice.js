import {createSlice} from '@reduxjs/toolkit'

const settingsSlice = createSlice({
    name: "settings",
    initialState :{
        settings : [],
        isFetching: false,
        error: false,
    },
    reducers:{
        // Add new Product (Create)
        addSettings: (state)=>{
            state.isFetching=true
            state.error=false
        },
        addSettingsSuccess: (state, action)=>{
            state.isFetching=false;
            state.settings.push(action.payload)
        },
        addSettingsFailure: (state)=>{
            state.isFetching=false
            state.error=true
        },

        // Get All Settings
        settingsStart: (state)=>{
            state.isFetching=true
            state.error=false
        },
        settingsSuccess: (state, action)=>{
            state.isFetching=false
            state.settings = action.payload
        },
        settingsFailure: (state)=>{
            state.isFetching=false
            state.error=true
        },

    }
})

export const {addSettings, addSettingsSuccess, addSettingsFailure,settingsStart,settingsSuccess,settingsFailure} = settingsSlice.actions
export default settingsSlice.reducer 