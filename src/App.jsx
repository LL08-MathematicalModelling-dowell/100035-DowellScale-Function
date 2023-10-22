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
import {
  Scales,
  ScalesDetail,
  ScalesSettings,
  CreateScales,
  CreateScale,
  AvailableScales,
} from './pages/scales';
import { Stages } from './pages/test';
import PairedScale from './pages/PairedScale';
import PerceptualScale from './pages/PerceptualScale';
import SinglePerceptualScaleSettings from './pages/SinglePerceptualScaleSettings';
import CreatePerceptualScaleSettings from './pages/CreatePerceptualScaleSettings';

function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Suspense fallback={<Fallback />}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-scales" element={<Scales />} />
            <Route path="/stages" element={<Stages />} />
            <Route path="/available-scales" element={<AvailableScales />} />
            <Route path="/all-scales/:slug" element={<ScalesDetail />} />
            <Route path="/scales-settings/:slug" element={<ScalesSettings />} />
            <Route path="/paired-scale-comparison" element={<PairedScale />} />
            <Route
              path="/perceptual-mapping-scale"
              element={<PerceptualScale />}
            />
            <Route path="/:slug" element={<ScalesDetail />} />
            <Route path="/create-scales" element={<CreateScales />} />
            <Route path="/create-scale" element={<CreateScale />} />
            <Route path="/create-scale-settings" element={<CreateSettings />} />
            <Route
              path="/create-perceptual-scale-settings"
              element={<CreatePerceptualScaleSettings />}
            />
            <Route
              path="/create-scale-response/:id"
              element={<CreateResponse />}
            />
            <Route
              path="/single-scale-settings/:id"
              element={<SingleScaleSettings />}
            />
            <Route
              path="/single-perceptual-scale-settings/:id"
              element={<SinglePerceptualScaleSettings />}
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
      </div>
    </>
  );
}

export default App;
