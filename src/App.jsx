import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import CreateSettings from './pages/CreateSettings';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Fallback from './components/Fallback';
import SingleScaleResponse from './pages/SingleScaleResponse';
import CreateResponse from './pages/CreateResponse';
import SingleScaleSettings from './pages/SingleScaleSettings';
import UpdateScaleSettings from './pages/UpdateScaleSettings';

function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Suspense fallback={<Fallback />}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-scale-settings" element={<CreateSettings />} />
            <Route path="/create-scale-response" element={<CreateResponse />} />
            <Route
              path="/single-scale-settings/:id"
              element={<SingleScaleSettings />}
            />
            <Route
              path="/update-scale-settings/:id"
              element={<UpdateScaleSettings />}
            />
            <Route
              path="/single-scale-response/:id"
              element={<SingleScaleResponse />}
            />
          </Routes>
        </Suspense>

        {/* <Navbar />
    <Main/> */}
        {/* <Services />
  <Transactions />
  <Footer /> */}
      </div>
    </>
  );
}

export default App;
