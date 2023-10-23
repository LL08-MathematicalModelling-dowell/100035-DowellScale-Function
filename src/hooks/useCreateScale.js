import React, { useState } from 'react';
import axios from 'axios';

export const useCreateScale = () => {
    return async(scaleType, payload)=>{
        const endPoint = scaleType === 'ranking-scale' ? 'ranking_settings_create' : 'anoth'
        try {
            const response = await axios.post(`http://100035.pythonanywhere.com/ranking/api/${endPoint}/`, payload);
            return response
        } catch (error) {
            console.error(error);
        }
    }
}

