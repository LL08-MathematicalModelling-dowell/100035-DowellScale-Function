import React, { useState } from 'react';
import axios from 'axios';

export const useCreateScale = () => {

    return async(scaleType, payload)=>{
        const endPoint = 
        scaleType === 'ranking-scale' ? 'http://100035.pythonanywhere.com/ranking/api/ranking_settings_create'
        : scaleType==='nps-scale' ? 'https://100035.pythonanywhere.com/api/nps_create/' 
        : scaleType==='staple-scale' ? 'https://100035.pythonanywhere.com/stapel/api/stapel_settings_create/': 'anoth'
        try {
            const response = await axios.post(`${endPoint}/`, payload);
            return response
        } catch (error) {
            console.error(error);
        }
    }
}

