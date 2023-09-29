import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useGetScale = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [scaleData, setScaleData] = useState([]);

    const fetchScaleData = async (scaleType) => {
        const endPoint = scaleType === 'ranking-scale' ? 'ranking_settings_create' : 'anoth'
        try {
            setIsLoading(true);
            const response = await axios.get(`http://100035.pythonanywhere.com/ranking/api/${endPoint}`);
            setScaleData(response.data); 
            console.log(response, '**** resttt')
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
