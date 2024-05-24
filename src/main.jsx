import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Home from './pages/Home.jsx';
import Report from './pages/ScaleReport/Report.jsx';
import {
  RankingScale,
  CreateRankingScale,
  UpdateRankingScale,
  RankingScaleSettings,
} from './pages/scales/ranking-scale';
import {
  V2NPSScale,
  CreateNPSScale,
  NPSScaleSettings,
  UpdateNPSScale,
  NpsReport
} from './pages/scales/nps-scale';

import {
  BtnLinkNPSScale,
  BtnLinkCreateNPSScale,
  BtnLinksNPSScaleSettings,
} from './pages/scales/nps-scale/ButtonLinks';

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
  BtnLinksStapel,
  BtnLinksCreateStapelScale,
  BtnLinksStapelScaleSetting
} from './pages/scales/staple-scale/BtnLinks-StapelLink';

import {
  NPSLiteScale,
  CreateNpsLiteScale,
  NpsLiteSettings,
  UpdateNpsLite,
} from './pages/scales/nps-lite-scale';

import {
  BtnLinksNpsLiteScale,
  BtnLinksCreateNpsLiteScale,
  BtnLinkNpslitescaleSetting,
  // UpdateNpsLite,
} from './pages/scales/nps-lite-scale/BtnLinks-npsliteLink';

import {
  LikertScale,
  CreateLikertScale,
  LikertScaleSettings,
  UpdateLikertScale
} from './pages/scales/likert-scale';

import {
  BtnLinksLikert,
  BtnLinksCreateLikertScale,
  BtnLinksLikertScaleSetting
  // LikertScaleSettings,
  // UpdateLikertScale
} from './pages/scales/likert-scale/BtnLinks-LikerLink';
import { StrictMode } from 'react';
import NPSResponse from './pages/scales/nps-scale/NPSResponse.jsx';
import NpsScaleSecondPart from './pages/scales/nps-scale-second-part/NpsScaleSecondPart.jsx';
import PercentScale from './pages/scales/percent-scale/PercentScale.jsx';
import CreatePercentScale from './pages/scales/percent-scale/CreatePercentScale.jsx';
import PercentScaleSettings from './pages/scales/percent-scale/PercentScaleSettings.jsx';
import PercentSumScale from './pages/scales/percent-sum-scale.jsx/PercentSumScale.jsx';
import CreatePercentSumScale from './pages/scales/percent-sum-scale.jsx/CreatePercentSumScale.jsx';
import PercentSumScaleSettings from './pages/scales/percent-sum-scale.jsx/PercentSumScaleSettings.jsx';
import GenerateReport from './pages/GenerateReport.jsx';
import LoadingScreen from './pages/LoadingScreen.jsx';

export const basePath = '/100035-DowellScale-Function/';
const base2='/100035-DowellScale-Function/home'
const router = createBrowserRouter([
  {
    path: basePath,
    element: <App />,
    children: [
      {
        path: basePath,
        element: <LoadingScreen />,
      },
      {
        path: `${basePath}/home`,
        element: <Home />,
      },
      {
        path: `${basePath}/myscales`,
        element: <Report />,
      },
      {
        path: `${basePath}/home/generate-report/:slug`,
        element: <GenerateReport />,
      },
    
    
      {
        path: `${basePath}/home/pc-scale`,
        element: <PairedScale />,
      },
      {
        path: `${basePath}/home/percent-scale-settings/:slug`,
        element: <PercentScaleSettings />,
      },
      {
        path: `${basePath}/home/percent-sum-scale-settings/:slug`,
        element: <PercentSumScaleSettings />,
      },
      {
        path: `${basePath}/home/percent-scale`,
        element: <PercentScale />,
      },
      {
        path:`${basePath}/home/create-percent-scale`,
        element:<CreatePercentScale/>
      },
      
      {
        path:`${basePath}/home/create-percent-sum-scale`,
        element:<CreatePercentSumScale/>
      },
      {
        path: `${basePath}/home/pm-scale`,
        element: <PerceptualScale />,
      },
      {
        path: `${basePath}/home/nps-second-part`,
        element: <NpsScaleSecondPart />,
      },
      {
        path: `${basePath}/home/ranking-scale`,
        element: <RankingScale />,
      },
      {
        path: `${basePath}/home/nps-scale`,
        element: <V2NPSScale />,
      },
      {
        path: `${basePath}/home/npsLiteBtnLink`,
        element: <BtnLinksNpsLiteScale />
      },
      {
        path: `${basePath}/home/npsBtnLink`,
        element: <BtnLinkNPSScale />,
      },
      {
        path: `${basePath}/home/percent-sum-scale`,
        element: <PercentSumScale />,
      },
      {
        path: `${basePath}/home/create-scale`,
        element: <CreateRankingScale />,
      },
      {
        path: `${basePath}/home/likert-scale/`,
        element: <LikertScale />
      },
      {
        path: `${basePath}/home/likertBtnLink`,
        element: <BtnLinksLikert />,
      },
      {
        path: `${basePath}/home/create-paired-scale-settings`,
        element: <CreatePCScaleSettings />,
      },
      {
        path: `${basePath}/home/create-scale-response/:id`,
        element: <CreatePCResponse />,
      },
      {
        path: `${basePath}/home/staple-scale`,
        element: <StapleScale />,
      },
      {
        path: `${basePath}/home/stapelBtnLink`,
        element: <BtnLinksStapel />,
      },
      {
        path: `${basePath}/home/create-staple-scale-btnLink`,
        element: <BtnLinksCreateStapelScale />,
      },
      {
        path: `${basePath}/home/create-staple-scale`,
        element: <CreateStapleScale />,
      },
      {
        path: `${basePath}/home/staple-scale-settings/:slug`,
        element: <StapleScaleSettings />,
      },
      {
        path: `${basePath}/home/nps-lite-scale`,
        element: <NPSLiteScale />,
      },
      {
        path: `${basePath}/home/create-nps-lite-scale`,
        element: <CreateNpsLiteScale />,
      },
      {
        path: `${basePath}/home/create-nps-lite-scale-links`,
        element: <BtnLinksCreateNpsLiteScale />,
      },
      {
        path: `${basePath}/home/update-nps-lite-scale/:slug`,
        element: <UpdateNpsLite />,
      },
      {
        path: `${basePath}/home/nps-lite-scale-settings/:slug`,
        element: <NpsLiteSettings />,
      },
      {
        path: `${basePath}/home/create-perceptual-scale-settings`,
        element: <CreatePerceptualScaleSettings />,
      },
      {
        path: `${basePath}/home/create-nps-scale`,
        element: <CreateNPSScale />,
      },
      {
        path: `${basePath}/home/create-nps-scale-links`,
        element: <BtnLinkCreateNPSScale />,
      },
      {
        path: `${basePath}/home/create-likert-scale`,
        element: <CreateLikertScale />,
      },
      {
        path: `${basePath}/home/create-likertbtn-scale`,
        element: <BtnLinksCreateLikertScale />,
      },
      {
        path: `${basePath}/home/ranking-scale-settings/:slug`,
        element: <RankingScaleSettings />,
      },
      {
        path: `${basePath}/home/single-scale-settings/:id`,
        element: <SinglePCScaleSettings />,
      },
      {
        path: `${basePath}/home/single-perceptual-scale-settings/:slug`,
        element: <SinglePerceptualScaleSettings />,
      },
      {
        path: `${basePath}/home/nps-scale-settings/:slug`,
        element: <NPSScaleSettings />,
      },
      {
        path: `${basePath}/home/scale-report/:slug`,
        element: <NpsReport />,
      },
      {
        path: `${basePath}/home/btnLinksnps-scale-settings/:slug`,
        element: <BtnLinksNPSScaleSettings />,
      },
      {
        path: `${basePath}/home/btnLinksnpslite-scale-settings/:slug`,
        element: <BtnLinkNpslitescaleSetting />,
      },
      {
        path: `${basePath}/home/btnLinksLikert-scale-settings/:slug`,
        element: <BtnLinksLikertScaleSetting />,
      },
      {
        path: `${basePath}/home/btnLinksstapel-scale-settings/:slug`,
        element: <BtnLinksStapelScaleSetting />,
      },
      {
        path: `${basePath}/home/likert-scale-settings/:slug`,
        element: <LikertScaleSettings />,
      },
      {
        path: `${basePath}/home/nps-scale-settings/:slug`,
        element: <NPSResponse />,
      },
      {
        path: `${basePath}/home/update-paired-scale-settings/:id`,
        element: <UpdatePCScaleSettings />,
      },
      {
        path: `${basePath}/home/update-perceptual-scale-settings/:slug`,
        element: <UpdatePMSSettings />,
      },
      {
        path: `${basePath}/home/update-ranking-scale/:slug`,
        element: <UpdateRankingScale />,
      },
      {
        path: `${basePath}/home/update-nps-scale/:slug`,
        element: <UpdateNPSScale />,
      },
      {
        path: `${basePath}/home/update-likert-scale/:slug`,
        element: <UpdateLikertScale />,
      },
      {
        path: `${basePath}/home/update-staple-scale/:slug`,
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