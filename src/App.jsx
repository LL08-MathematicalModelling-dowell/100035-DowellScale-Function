import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { FetchUserContextProvider } from './contexts/fetchUserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Fallback from './components/Fallback';
import { RankingScale, CreateScale, AvailableScales } from './pages/scales';
import {
  NPSScale,
  CreateNPSScale,
  NPSScaleSettings,
  UpdateNPSScale,
} from './pages/scales/nps-scale';
import {
  PairedScale,
  CreatePCScaleSettings,
  UpdatePCScaleSettings,
  SinglePCScaleSettings,
  CreatePCResponse,
} from './pages/scales/pc-scale';
import { UpdateRankingScale } from './pages/scales/update';
import { RankingScaleSettings } from './pages/scales/settings';
import PerceptualScale from './pages/scales/PerceptualScale';
import SinglePerceptualScaleSettings from './pages/scales/SinglePerceptualScaleSettings';
import CreatePerceptualScaleSettings from './pages/scales/CreatePerceptualScaleSettings';
import PrivateRoutes from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Suspense fallback={<Fallback />}>
          <Navbar />
          <FetchUserContextProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/available-scales" element={<AvailableScales />} />
                <Route path="/pc-scale" element={<PairedScale />} />
                <Route
                  path="/perceptual-mapping-scale"
                  element={<PerceptualScale />}
                />
                <Route path="/ranking-scale" element={<RankingScale />} />
                <Route path="/nps-scale" element={<NPSScale />} />

                <Route path="/create-scale" element={<CreateScale />} />
                <Route
                  path="/create-paired-scale-settings"
                  element={<CreatePCScaleSettings />}
                />
                <Route
                  path="/create-perceptual-scale-settings"
                  element={<CreatePerceptualScaleSettings />}
                />
                <Route path="/create-nps-scale" element={<CreateNPSScale />} />
                <Route
                  path="/ranking-scale-settings/:slug"
                  element={<RankingScaleSettings />}
                />
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
                  path="/nps-scale-settings/:slug"
                  element={<NPSScaleSettings />}
                />
                <Route
                  path="/update-paired-scale-settings/:id"
                  element={<UpdatePCScaleSettings />}
                />
                <Route
                  path="/update-ranking-scale/:slug"
                  element={<UpdateRankingScale />}
                />
                <Route
                  path="/update-nps-scale/:slug"
                  element={<UpdateNPSScale />}
                />
              </Route>
            </Routes>
          </FetchUserContextProvider>
        </Suspense>
      </div>
    </>
  );
}

export default App;
