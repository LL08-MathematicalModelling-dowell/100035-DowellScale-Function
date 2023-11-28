import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useGetSingleScale = () => {
    const [loading, setLoading] = useState(false);
    const [sigleScaleData, setSingleScaleData] = useState(null);

    const fetchSingleScaleData = async (scaleId) => {

        // const endPoint = 
        // scaleType === 'ranking-scale' 
        // ? 'https://100035.pythonanywhere.com/ranking/api/ranking_settings_create/?scale_id='
        // : scaleType==='nps-scale' ? 'https://100035.pythonanywhere.com/api/nps_create' : 'anoth';

        try {
            setLoading(true);
            const response = await axios.get(`https://100035.pythonanywhere.com/ranking/api/ranking_settings_create/?scale_id=${scaleId}`);
            setSingleScaleData(response.data); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        sigleScaleData,
        fetchSingleScaleData
    }
}

export default useGetSingleScale;
