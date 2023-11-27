import React from 'react';
import axios from 'axios';

export const useUpdateResponse = () => {
  return async(scaleType, payload)=>{
    const endPoint = scaleType === 'ranking-scale' 
    ? 'https://100035.pythonanywhere.com/ranking/api/ranking_settings_create/' 
    : scaleType === 'nps-scale' ? 'https://100035.pythonanywhere.com/api/nps_create/' 
    : scaleType === 'nps-lite-scale' ? 'https://100035.pythonanywhere.com/nps-lite/api/nps-lite-settings' 
    : scaleType === 'staple-scale' ? 'https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/' 
    :'no endpoint'
    try {
      const response = await axios.put(endPoint, payload);
      return response
    } catch (error) {
      console.log(error)
    }
  }
}

