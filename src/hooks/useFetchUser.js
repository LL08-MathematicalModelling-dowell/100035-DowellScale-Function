import React, { useEffect } from 'react';
import axios from 'axios';
import { useFetchUserContext } from '../contexts/fetchUserContext';

export const useFetchUser = () => {
    const { setUserSessionId } = useFetchUserContext();

    useEffect(()=>{
        try {
            const sessionId = localStorage.getItem('sessionId') || '5x7yhetbwdp9n6nre0hxosxj87yno3o6';
            console.log(sessionId, 'session id');
            if(sessionId){
                setUserSessionId(sessionId);
            }
        } catch (error) {
            console.log(error);
        }
    },[])
    
  return async(value)=>{
    try {
        const response = await axios.post('https://100014.pythonanywhere.com/api/userinfo/', value);
        
    } catch (error) {
        
    }
  }
}

