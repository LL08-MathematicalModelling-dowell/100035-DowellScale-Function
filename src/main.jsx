import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Home from './pages/Home.jsx';
import {
  RankingScale,
  CreateRankingScale,
  UpdateRankingScale,
  RankingScaleSettings,
} from './pages/scales/ranking-scale';
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
import {
  PerceptualScale,
  CreatePerceptualScaleSettings,
  SinglePerceptualScaleSettings,
  UpdatePMSSettings,
} from './pages/scales/pm-scale';

import {
  StapleScale,
  CreateStapleScale,
  StapleScaleSettings,
  UpdateStapleScale,
} from './pages/scales/staple-scale';
import {
  NPSLiteScale,
  CreateNpsLiteScale,
  NpsLiteSettings,
  UpdateNpsLite,
} from './pages/scales/nps-lite-scale';

import {
  LikertScale,
  CreateLikertScale,
  LikertScaleSettings,
  UpdateLikertScale
} from './pages/scales/likert-scale';
import { StrictMode } from 'react';
import NPSResponse from './pages/scales/nps-scale/NPSResponse.jsx';
import NpsScaleSecondPart from './pages/scales/nps-scale-second-part/NpsScaleSecondPart.jsx';
import PercentScale from './pages/scales/percent-scale/PercentScale.jsx';
import CreatePercentScale from './pages/scales/percent-scale/CreatePercentScale.jsx';
import PercentScaleSettings from './pages/scales/percent-scale/PercentScaleSettings.jsx';
import PercentSumScale from './pages/scales/percent-sum-scale.jsx/PercentSumScale.jsx';
import CreatePercentSumScale from './pages/scales/percent-sum-scale.jsx/CreatePercentSumScale.jsx';
import PercentSumScaleSettings from './pages/scales/percent-sum-scale.jsx/PercentSumScaleSettings.jsx';

const basePath = '/100035-DowellScale-Function/';
const router = createBrowserRouter([
  {
    path: basePath,
    element: <App />,
    children: [
      {
        path: basePath,
        element: <Home />,
      },
      {
        path: `${basePath}/pc-scale`,
        element: <PairedScale />,
      },
      {
        path: `${basePath}/percent-scale-settings/:slug`,
        element: <PercentScaleSettings />,
      },
      {
        path: `${basePath}/percent-sum-scale-settings/:slug`,
        element: <PercentSumScaleSettings />,
      },
      {
        path: `${basePath}/percent-scale`,
        element: <PercentScale />,
      },
      {
        path:`${basePath}/create-percent-scale`,
        element:<CreatePercentScale/>
      },
      
      {
        path:`${basePath}/create-percent-sum-scale`,
        element:<CreatePercentSumScale/>
      },
      {
        path: `${basePath}/pm-scale`,
        element: <PerceptualScale />,
      },
      {
        path: `${basePath}/nps-second-part`,
        element: <NpsScaleSecondPart />,
      },
      {
        path: `${basePath}/ranking-scale`,
        element: <RankingScale />,
      },
      {
        path: `${basePath}/nps-scale`,
        element: <NPSScale />,
      },
      {
        path: `${basePath}/percent-sum-scale`,
        element: <PercentSumScale />,
      },
      {
        path: `${basePath}/create-scale`,
        element: <CreateRankingScale />,
      },
      {
        path: `${basePath}/likert-scale/`,
        element: <LikertScale />
      },
      {
        path: `${basePath}/create-paired-scale-settings`,
        element: <CreatePCScaleSettings />,
      },
      {
        path: `${basePath}/create-scale-response/:id`,
        element: <CreatePCResponse />,
      },
      {
        path: `${basePath}/staple-scale`,
        element: <StapleScale />,
      },
      {
        path: `${basePath}/create-staple-scale`,
        element: <CreateStapleScale />,
      },
      {
        path: `${basePath}/staple-scale-settings/:slug`,
        element: <StapleScaleSettings />,
      },
      {
        path: `${basePath}/nps-lite-scale`,
        element: <NPSLiteScale />,
      },
      {
        path: `${basePath}/create-nps-lite-scale`,
        element: <CreateNpsLiteScale />,
      },
      {
        path: `${basePath}/update-nps-lite-scale/:slug`,
        element: <UpdateNpsLite />,
      },
      {
        path: `${basePath}/nps-lite-scale-settings/:slug`,
        element: <NpsLiteSettings />,
      },
      {
        path: `${basePath}/create-perceptual-scale-settings`,
        element: <CreatePerceptualScaleSettings />,
      },
      {
        path: `${basePath}/create-nps-scale`,
        element: <CreateNPSScale />,
      },
      {
        path: `${basePath}/create-likert-scale`,
        element: <CreateLikertScale />,
      },
      {
        path: `${basePath}/ranking-scale-settings/:slug`,
        element: <RankingScaleSettings />,
      },
      {
        path: `${basePath}/single-scale-settings/:id`,
        element: <SinglePCScaleSettings />,
      },
      {
        path: `${basePath}/single-perceptual-scale-settings/:slug`,
        element: <SinglePerceptualScaleSettings />,
      },
      {
        path: `${basePath}/nps-scale-settings/:slug`,
        element: <NPSScaleSettings />,
      },
      {
        path: `${basePath}/likert-scale-settings/:slug`,
        element: <LikertScaleSettings />,
      },
      {
        path: `${basePath}/nps-scale-settings/:slug`,
        element: <NPSResponse />,
      },
      {
        path: `${basePath}/update-paired-scale-settings/:id`,
        element: <UpdatePCScaleSettings />,
      },
      {
        path: `${basePath}/update-perceptual-scale-settings/:slug`,
        element: <UpdatePMSSettings />,
      },
      {
        path: `${basePath}/update-ranking-scale/:slug`,
        element: <UpdateRankingScale />,
      },
      {
        path: `${basePath}/update-nps-scale/:slug`,
        element: <UpdateNPSScale />,
      },
      {
        path: `${basePath}/update-likert-scale/:slug`,
        element: <UpdateLikertScale />,
      },
      {
        path: `${basePath}/update-staple-scale/:slug`,
        element: <UpdateStapleScale />,
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </StrictMode>
);
