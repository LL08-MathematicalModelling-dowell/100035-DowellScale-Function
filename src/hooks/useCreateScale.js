import React, { useState } from 'react';
import axios from 'axios';

export const useCreateScale = () => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [scaleData, setScaleData] = useState([]);

    // const createScale = async (scaleType, payload) => {
    //     const endPoint = scaleType === 'ranking-scale' ? 'ranking_settings_create' : 'anoth'
    //     try {
    //         setIsLoading(true);
    //         const response = await axios.post(`http://100035.pythonanywhere.com/ranking/api/${endPoint}/`, payload);
    //         setScaleData(response); 
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    // return {
    //     isLoading,
    //     scaleData,
    //     createScale
    // }

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

