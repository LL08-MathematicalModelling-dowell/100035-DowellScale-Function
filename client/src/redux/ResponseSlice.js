import {createSlice} from '@reduxjs/toolkit'

const responseSlice = createSlice({
    name: "response",
    initialState :{
        responses : [],
        isFetching: false,
        error: false,
    },
    reducers:{
        // Add new response (Create)
        addResponse: (state)=>{
            state.isFetching=true
            state.error=false
        },
        addResponseSuccess: (state, action)=>{
            state.isFetching=false;
            state.responses.push(action.payload)
        },
        addResponseFailure: (state)=>{
            state.isFetching=false
            state.error=true
        },
    }
})

export const {addResponse, addResponseSuccess, addResponseFailure} = responseSlice.actions
export default responseSlice.reducer 