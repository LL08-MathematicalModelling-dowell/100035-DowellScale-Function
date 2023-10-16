import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useGetSingleScale = () => {
    const [loading, setLoading] = useState(false);
    const [sigleScaleData, setSingleScaleData] = useState(null);

    const fetchSingleScaleData = async (scaleId) => {
       
        try {
            setLoading(true);
            const response = await axios.get(`http://100035.pythonanywhere.com/ranking/api/ranking_settings_create/?scale_id=${scaleId}`);
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
