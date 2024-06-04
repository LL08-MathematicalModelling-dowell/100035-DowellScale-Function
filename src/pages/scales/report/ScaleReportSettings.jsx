import React from 'react'
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { AreaChart, Tooltip, Area, XAxis, YAxis } from 'recharts';
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
          let scaleObj = {name: i+1, score: arrayData[i], pv: 2400, amt: 2400}
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
        <div className='w-full flex flex-col justify-start'>
          <div className='flex justify-between'>
            <h4 style={{width: '188px', height: '18px', fontFamily:'Roboto', fontWeight:'700', fontSize:'16px', lineHeight: '18.75px'}}>User Report Analysis</h4>
            <p className='h-[14px]' style={{fontWeight: '200', fontSize:'12px'}}>Last updated on</p>
        </div>
         <p style={{fontWeight:'400', fontSize: '14px', lineHeight:'14.06px'}}>Scale name</p>
         <div className='flex justify-between'>
         <p style={{fontWeight:'400', fontSize: '14px', lineHeight:'14.06px'}}>Scale Type: {reportData && reportData.scale_type}</p>
         <p style={{fontWeight: '200', fontSize:'12px'}}>Download detailed report</p>
         </div>
      </div>
      </div>
      <div className='flex flex-col mt-20'>
        <div className='w-5/6 m-auto mb-20'>
        <div style={{fontWeight: '400', fontSize: '12px', width: '180px', height:'30px', marginRight:'25px', outline:'none', WebkitBoxShadow: "0 10px 6px -6px #777", borderRadius:'4px', border: '2px solid whitesmoke', display: 'flex', alignItems:'center', justifyContent:'center'}}>
        <select className='w-[150px] m-auto cursor-pointer' style={{outlineStyle:'none'}}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          </select>
          </div>
        </div>
      <div className='flex justify-center pt-6 w-5/6 pb-6 m-auto'>
      <div className='flex flex-col items-center justify-center shadow-md w-48 h-32 mr-5 pt-5 pb-5 pl-3 bg-[#E8E8E8]' style={{borderRadius:'4px'}}>
        <p className='text-[14px] gap-y-0 font-medium text-[#454545]'>Total no. of responses</p>
        <p className='text-[40px] gap-y-0 font-medium text-[#0079E3]'>{reportData && reportData.no_of_scales}</p>
      </div>
      <div className='flex flex-col items-center justify-center shadow-md w-48 h-32 mr-5 pt-5 pb-5 pl-3 bg-[#E8E8E8]' style={{borderRadius:'4px'}}>
        <p className='text-[14px] gap-y-0 font-medium text-[#454545]'>Overal nps lite response</p>
        <p className='text-[40px] gap-y-0 font-medium text-[#0079E3]'>{reportData && reportData.npslite_total_score}</p>
      </div>
        <div className='flex flex-col items-center justify-center shadow-md w-32 h-32 mr-5 pt-5 pb-5 pl-3 bg-[#E8E8E8]' style={{borderRadius:'4px'}}>
          <p className='text-[14px] gap-y-0 font-medium text-[#454545]'>Promoter</p>
          <p className='text-[40px] gap-y-0 font-medium text-[#0079E3]'>{reportData && reportData.frequency_table.Promoter}</p>
        </div>
        <div className='flex flex-col items-center justify-center shadow-md w-32 h-32 mr-5 pt-5 pb-5 pl-3 bg-[#E8E8E8]' style={{borderRadius:'4px'}}>
          <p className='text-[14px] gap-y-0 font-medium text-[#454545]'>Detractor</p>
          <p className='text-[40px] gap-y-0 font-medium text-[#0079E3]'>{reportData && reportData.frequency_table.Detractor}</p>
        </div>
        <div className='flex flex-col items-center justify-center shadow-md w-32 h-32 mr-5 pt-5 pb-5 pl-3 bg-[#E8E8E8]' style={{borderRadius:'4px'}}>
          <p className='text-[14px] gap-y-0 font-medium text-[#454545]'>Neutral</p>
          <p className='text-[40px] gap-y-0 font-medium text-[#0079E3]'>{reportData && reportData.frequency_table.Passive}</p>
        </div>
      </div>
      <div className='rounded-lg flex flex-col border w-5/6 h-[490px] m-auto mt-20 justify-start bg-[#E8E8E8]'>
      <div className='w-5/6 pl-10 mt-5'>
      <p className='text-[14px] gap-y-0 font-medium text-[#454545]'>User Score distribution through line chart</p>
      </div>
      <div className='w-4/5 flex flex-col items-center justify-center m-auto bg-[white]'>
      <div className='w-5/6 flex items-center'>
      {/* <p>score</p> */}
      <AreaChart width={600} height={350} data={BtnLinks}>
        <XAxis dataKey="name" />
        <YAxis />
        <Area type="monotone" dataKey="score" stroke="#8884d8" fill='#005734' />
        <Tooltip />
      </AreaChart>
      </div>
      <p>Users</p>
      </div>
    </div>
     <div className='mt-10 w-5/6 rounded-lg flex flex-col border m-auto items-center justify-center bg-[#E8E8E8]'>
     <div className='w-5/6 pl-10 mt-5'>
      <p className='text-[14px] gap-y-0 font-medium text-[#454545]'>Pie chart showing proportion of Promoters and Detractors</p>
      </div>
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
    </div>
  )
}

export default ScaleReportSettings
