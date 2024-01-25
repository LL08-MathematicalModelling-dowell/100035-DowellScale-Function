import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

function App() {
  useEffect(()=>{
    const redirectToScale = () =>{
        window.location.href = "https://www.qrcodereviews.uxlivinglab.online/api/v3/masterlink/?api_key=8929316691761631726";
    }
    redirectToScale()
  },[])
  
  return (
    <div className="App">
     
    </div>
  );
}

export default App;
