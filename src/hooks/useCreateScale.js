import React, { useState } from 'react';
import axios from 'axios';

export const useCreateScale = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [scaleData, setScaleData] = useState([]);

    const createScale = async (scaleType, payLoad) => {
        const endPoint = scaleType === 'ranking-scale' ? 'ranking_settings_create' : 'anoth'
        console.log(endPoint, '************')
        // http://100035.pythonanywhere.com/ranking/api/ranking_settings_create/
        try {
            setIsLoading(true);
            const response = await axios.post(`http://100035.pythonanywhere.com/ranking/api/${endPoint}/`, payLoad);
            console.log(response, 'res +++')
            // setScaleData(response.data); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    return {
        isLoading,
        scaleData,
        createScale
    }
}

