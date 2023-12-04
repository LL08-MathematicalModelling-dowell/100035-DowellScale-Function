
import { Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import Navbar from './components/Navbar';
import Fallback from './components/Fallback';
import { Outlet } from "react-router";



function App() {
  return (
    <>
      <div>
        <Suspense fallback={<Fallback />}>
          <Navbar />
         <Outlet/>
        </Suspense>
      </div>
    </>
  );
}

export default App;
