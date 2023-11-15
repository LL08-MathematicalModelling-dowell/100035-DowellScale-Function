import React, { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios'; 

const FetchUserContext = createContext();

export const FetchUserContextProvider = ({ children }) => {
  const [userSessionId, setUserSessionId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (userSessionId !== null) {
        try {
          const response = await axios.post(
            'https://100014.pythonanywhere.com/api/userinfo/',
            { session_id:userSessionId }
          );
          setUser(response.data.userinfo);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [userSessionId]);

  const fetchSessionId = ()=>{
    try {
      const sessionId = sessionStorage.getItem('session_id') || '5x7yhetbwdp9n6nre0hxosxj87yno3o6';
      if(sessionId){
          setUserSessionId(sessionId);
      }
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <FetchUserContext.Provider value={{ fetchSessionId, userSessionId, setUserSessionId, user }}>
      {children}
    </FetchUserContext.Provider>
  );
};

export const useFetchUserContext = () => useContext(FetchUserContext);
