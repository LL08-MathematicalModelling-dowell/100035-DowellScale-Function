import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useGetSingleNpsLiteScale = () => {
    const [loading, setLoading] = useState(false);
    const [sigleScaleData, setSingleScaleData] = useState(null);

    const fetchSingleScaleData = async (scaleId) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://100035.pythonanywhere.com/nps-lite/api/nps-lite-settings/?scale_id=${scaleId}`);
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

export default useGetSingleNpsLiteScale;
