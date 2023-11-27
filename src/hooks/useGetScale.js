import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useGetScale = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [scaleData, setScaleData] = useState([]);

    const fetchScaleData = async (scaleType) => {
        console.log(scaleType, 'scaleType')
        const endPoint = 
        scaleType === 'ranking-scale' 
        ? 'https://100035.pythonanywhere.com/ranking/api/ranking_settings_create'
        : scaleType==='nps-scale' ? 'https://100035.pythonanywhere.com/api/nps_create' 
        : scaleType==='nps-lite-scale' ? 'https://100035.pythonanywhere.com/nps-lite/api/nps-lite-settings' 
        : scaleType==='staple-scale' ? 'https://100035.pythonanywhere.com/stapel/api/stapel_settings'
        : null;
        
        try {
            setIsLoading(true);
            const response = await axios.get(`${endPoint}`);
            setScaleData(response.data); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        scaleData,
        fetchScaleData
    }
}

export default useGetScale;
