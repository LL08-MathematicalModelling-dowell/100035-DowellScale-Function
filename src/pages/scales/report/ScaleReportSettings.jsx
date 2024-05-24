import React from 'react'
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import MasterlinkSuccessModal from '../../../modals/MasterlinkSuccessModal';
import BtnLinks from '../../../components/data/BtnLinks';
import { toast } from 'react-toastify';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import axios from 'axios';

const ScaleReportSettings = () => {

  const { slug } = useParams()
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState()
  const [publicLinks, SetpublicLinks] = useState(null);
  const [qrCodeURL, setQrCodeURL] = useState('');
  const [showMasterlinkModal, setShowMasterlinkModal] = useState(false);
  const [masterLink, setMasterLink] = useState('');
  const [showMasterLinkSuccessModal, setShowMasterLinkSuccessModal] =
    useState(false);
  const [userInfo, setUserInfo] = useState();

  const data = []

  useEffect(() => {
    const fetchData = async () => {
      //await handleFetchSingleScale(slug);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://100035.pythonanywhere.com/report/addons_report/?scale_id=${slug}&api_key=1b834e07-c68b-4bf6-96dd-ab7cdc62f07f`
        );
        console.log(response.data.report)
        setReportData(response.data.report)
        let arrayData = response.data.report.poisson_case_results.series.list1
        for(let i = 0; i<response.data.report.no_of_scales; i++) {
          let scaleObj = {name: i+1, uv: arrayData[i], pv: 2400, amt: 2400}
          if(BtnLinks.includes(`'${scaleObj.name}'`) === false){
            BtnLinks.push(scaleObj)
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);


  if (isLoading) {
    return <Fallback />;
  }

  return (
    <div className='flex flex-col justify-start w-5/6 mt-5 ml-[10%] lg:ml-[20%]'>
      <div className='flex justify-start'>
        <MdOutlineArrowBackIosNew className='hidden lg:block' style={{width:"25px", height:'30px', marginRight: '5px'}} />
        <div className='flex flex-col justify-start'>
        <h4 style={{width: '188px', height: '18px', fontFamily:'Roboto', fontWeight:'700', fontSize:'16px', lineHeight: '18.75px'}}>User Report Analysis</h4>
         <p style={{fontWeight:'400', fontSize: '14px', lineHeight:'14.06px'}}>Scale name</p>
         <p style={{fontWeight:'400', fontSize: '14px', lineHeight:'14.06px'}}>Scale Type: {reportData && reportData.scale_type}</p>
      </div>
      </div>
      <div className='rounded-lg flex flex-col border w-5/6 m-auto mt-20 items-center justify-center bg-[#FAFAFA]'>
      <div className='flex justify-center pt-6 w-5/6 pb-6'>
      <div className='rounded-lg flex flex-col shadow-md w-1/4 h-20 mr-5 pt-5 pb-5 pl-3 bg-white'>
        <p className='text-gray-400 text-[14px] gap-y-0'>Total no. of responses</p>
        <p className='font-bold text-[25px]'>{reportData && reportData.no_of_scales}</p>
      </div>
      <div className='rounded-lg flex flex-col shadow-md w-1/4 h-20 pt-5 pb-5 pl-3 bg-white'>
        <p className='text-gray-400 text-[14px] gap-y-0'>Overal nps lite response</p>
        <p className='font-bold text-[25px]'>{reportData && reportData.npslite_total_score}</p>
      </div>
      <div className='rounded-lg flex items-center justify-between shadow-md w-1/2 h-20 ml-5 pt-5 pl-3 pr-3 bg-white'>
        <div className='flex flex-col'>
          <p className='text-gray-400 text-[14px] gap-y-0'>Promoter</p>
          <p className='font-bold text-[25px]'>{reportData && reportData.frequency_table.Promoter}</p>
        </div>
        <div className='flex flex-col'>
          <p className='text-gray-400 text-[14px] gap-y-0'>Detractor</p>
          <p className='font-bold text-[25px]'>{reportData && reportData.frequency_table.Detractor}</p>
        </div>
        <div className='flex flex-col'>
          <p className='text-gray-400 text-[14px] gap-y-0'>Neutral</p>
          <p className='font-bold text-[25px]'>{reportData && reportData.frequency_table.Passive}</p>
        </div>
      </div>
      </div>
      <div className='w-5/6 flex flex-col items-center'>
      <div className='w-5/6 flex items-center'>
      <p>score</p>
      <LineChart width={600} height={300} data={BtnLinks}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
      </div>
      <p>Users</p>
      </div>
    </div>
     <div className='mt-20 w-5/6 rounded-lg flex flex-col border m-auto items-center justify-center bg-[#FAFAFA]'>
     <PieChart
     width={550}
     height={350}
     gap={0}
                series={[
                  {
                    data: [
                      { id: 0, value: reportData && reportData.frequency_table.Detractor, label: 'Detractor', color: '#ff9900' },
                      { id: 1, value: reportData && reportData.frequency_table.Promoter, label: 'Promoter', color:'#00a3ff' }
                    ]
                  }
                ]}
                blendstroke = {false}
            />
     </div>
    </div>
  )
}

export default ScaleReportSettings
