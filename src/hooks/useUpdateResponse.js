import React from 'react';
import axios from 'axios';

export const useUpdateResponse = () => {
  return (payload)=>{
    try {
      const response = axios.put('http://100035.pythonanywhere.com/ranking/api/ranking_settings_create/', payload);
      console.log(response, 'update response');
    } catch (error) {
      console.log(error)
    }
  }
}

