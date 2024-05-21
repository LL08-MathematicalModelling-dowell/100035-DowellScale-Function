import React from 'react';
import axios from 'axios';

export const useSaveResponse = () => {
  return async(payload)=>{
    try {
        const response = await axios.post('https://100035.pythonanywhere.com/nps-lite/api/nps-lite-response', payload);
        return response;
    } catch (error) {
        console.log(error);
    }
  }
}

