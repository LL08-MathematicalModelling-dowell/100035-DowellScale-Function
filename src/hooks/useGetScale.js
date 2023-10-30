import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useGetScale = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [scaleData, setScaleData] = useState([]);

    const fetchScaleData = async (scaleType) => {
        
        const endPoint = 
        scaleType === 'ranking-scale' 
        ? 'http://100035.pythonanywhere.com/ranking/api/ranking_settings_create'
        : scaleType==='nps-scale' ? 'https://100035.pythonanywhere.com/api/nps_create' : 'anoth';
        console.log(endPoint, 'endPoint')
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

    useEffect(() => {
        fetchScaleData(); 
    }, []);

    return {
        isLoading,
        scaleData,
        fetchScaleData
    }
}

export default useGetScale;
