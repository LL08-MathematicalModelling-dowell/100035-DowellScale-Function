import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import CreatePCSettings from './pages/scales/CreatePCSettings';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Fallback from './components/Fallback';
import CreatePCResponse from './pages/scales/CreatePCResponse';
import SinglePCScaleSettings from './pages/scales/SinglePCScaleSettings';
import UpdatePCScaleSettings from './pages/scales/UpdatePCScaleSettings';
import {
  RankingScale,
  CreateScale,
  AvailableScales,
} from './pages/scales';
import { NPSScale } from './pages/scales/nps-scale';
import { UpdateRankingScale } from './pages/scales/update';
import { RankingScaleSettings } from './pages/scales/settings';
import PairedScale from './pages/scales/PairedScale';
import PerceptualScale from './pages/scales/PerceptualScale';
import SinglePerceptualScaleSettings from './pages/scales/SinglePerceptualScaleSettings';
import CreatePerceptualScaleSettings from './pages/scales/CreatePerceptualScaleSettings';

function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Suspense fallback={<Fallback />}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/available-scales" element={<AvailableScales />} />
            <Route path="/paired-scale-comparison" element={<PairedScale />} />
            <Route
              path="/perceptual-mapping-scale"
              element={<PerceptualScale />}
            />
            <Route path="/:slug" element={<NPSScale />} />
            <Route path="/:slug" element={<RankingScale />} />
            <Route path="/create-scale" element={<CreateScale />} />
            <Route
              path="/create-paired-scale-settings"
              element={<CreatePCSettings />}
            />
            <Route
              path="/create-perceptual-scale-settings"
              element={<CreatePerceptualScaleSettings />}
            />
            <Route path="/ranking-scale-settings/:slug" element={<RankingScaleSettings />} />
            <Route
              path="/create-scale-response/:id"
              element={<CreatePCResponse />}
            />
            <Route
              path="/single-scale-settings/:id"
              element={<SinglePCScaleSettings />}
            />
            <Route
              path="/single-perceptual-scale-settings/:id"
              element={<SinglePerceptualScaleSettings />}
            />
            <Route
              path="/update-paired-scale-settings/:id"
              element={<UpdatePCScaleSettings />}
            />
            <Route path="/update-ranking-scale/:slug" element={<UpdateRankingScale />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
