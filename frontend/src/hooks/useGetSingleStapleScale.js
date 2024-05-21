import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useGetSingleStapleScale = () => {
    const [loading, setLoading] = useState(false);
    const [sigleScaleData, setSingleScaleData] = useState(null);

    const fetchSingleScaleData = async (scaleId) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://100035.pythonanywhere.com/stapel/api/stapel_responses?scale_id=${scaleId}`);
            console.log(response, 'response***')
            setSingleScaleData(response); 
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

export default useGetSingleStapleScale;
