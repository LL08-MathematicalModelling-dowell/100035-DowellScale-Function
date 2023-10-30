import React from 'react';
import axios from 'axios';

export const useUpdateResponse = () => {
  return async(scaleType, payload)=>{
    const endPoint = scaleType === 'ranking-scale' 
    ? 'http://100035.pythonanywhere.com/ranking/api/ranking_settings_create/' 
    : scaleType === 'nps-scale' 
    ? 'https://100035.pythonanywhere.com/api/nps_create/' : 'no endpoint'
    try {
      const response = await axios.put(endPoint, payload);
      console.log(response, 'update response');
    } catch (error) {
      console.log(error)
    }
  }
}

