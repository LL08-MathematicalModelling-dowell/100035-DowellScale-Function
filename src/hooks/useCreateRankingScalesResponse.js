import React, { useState } from 'react';
import axios from 'axios';


const useCreateRankingScalesResponse = () => {
    const [isLoading, setIsLoading] = useState(false);
    const CreateRankingScalesResponse = async(payload)=>{
        console.log(payload, 'database payload hook');
        try {
            setIsLoading(true);
            const response = await axios.post('http://100035.pythonanywhere.com/ranking/api/ranking_response_submit/', payload);
            console.log(response, 'response data');
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }
  return {
    CreateRankingScalesResponse,
    isLoading
  }
}

export default useCreateRankingScalesResponse