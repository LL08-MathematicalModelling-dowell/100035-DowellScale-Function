import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { basePath } from "../main";
import { useFetchUserContext } from "../contexts/fetchUserContext";
const LoadingScreen = () => {
  const letters = ["L", "O", "A", "D", "I", "N", "G"];
  const [index, setIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const navigateTo=useNavigate()
  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (index + 1) % letters.length; // Cyclic increment
      setIndex(nextIndex);
    }, 1000); // Adjust interval for desired speed

    return () => clearInterval(intervalId);
  }, [index, letters.length]);



  useEffect(() =>{
    const session_id = searchParams.get("session_id") || sessionStorage.getItem('session_id');
    console.log(session_id)
    console.log("Current URL:", window.location.href);
    
    if (!session_id) {
      window.location.href =
        "https://100014.pythonanywhere.com/?redirect_url=" +
        `${window.location.href}`;
    } else {
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', session_id);
      }
      console.log("Navigating to home with session_id:", session_id);
      navigateTo(`${basePath}home?session_id=${session_id}`);
    }
  }, [])

  const currentLetter = letters[index];

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-100 z-50 flex flex-col justify-center items-center">
      <div className={`rounded-full border-[12px]  ${index>0 ?" border-l-red-500" :"border-l-red-300" } 
       ${index>1 ?" border-t-blue-500" :"border-t-blue-300" }
       ${index>2 ?" border-r-yellow-500" :"border-r-yellow-300" }
       ${index>3 ?" border-b-green-500 " :"border-b-green-300 " }
          w-[160px] h-[160px]`}>
        <div className="flex justify-center items-center text-[24px] h-full font-medium text-gray-800">
          <span >{currentLetter}</span>
        </div>
      </div>
      <div className="mt-4  font-medium text-gray-800">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
