import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import BtnLinks from '../../../components/data/BtnLinks';
import axios from 'axios';

function NpsReport() {

  const { slug } = useParams()
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState()

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
          if(BtnLinks.includes(`'${scaleObj.uv}'`) == false){
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

  console.log(BtnLinks)

  if (isLoading) {
    return <Fallback />;
  }
  return (
    <div className='rounded-lg flex flex-col border w-2/3 m-auto mt-20 items-center justify-center bg-[#FAFAFA]'>
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
      <div className='flex flex-col items-center'>
      <div className='flex items-center'>
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
  )
}

export default NpsReport
