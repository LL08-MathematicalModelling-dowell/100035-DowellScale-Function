import React, { useState } from 'react';
import axios from 'axios';

export const useCreateScale = () => {

    return async(scaleType, payload)=>{
        const endPoint = 
        scaleType === 'percent-sum-scale' ? 'https://100035.pythonanywhere.com/percent-sum/api/percent-sum-settings/':
        scaleType === "percent-scale" ? 'https://100035.pythonanywhere.com/percent/api/percent_settings_create/' :
        scaleType === 'ranking-scale' ? 'https://100035.pythonanywhere.com/ranking/api/ranking_settings_create/'
        : scaleType==='nps-scale' ? 'https://100035.pythonanywhere.com/api/nps_create/' 
        : scaleType==='nps-lite-scale' ? 'https://100035.pythonanywhere.com/nps-lite/api/nps-lite-settings/' 
        : scaleType==='staple-scale' ? 'https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/'
        :scaleType==='likert-scale' ? 'https://100035.pythonanywhere.com/likert/likert-scale_create/': 'anoth'
        try {
            const response = await axios.post(`${endPoint}`, payload);
            return response
        } catch (error) {
            console.error(error);
        }
    }
}

