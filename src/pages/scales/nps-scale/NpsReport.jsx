import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Fallback from '../../../components/Fallback';
import BtnLinks from '../../../components/data/BtnLinks';
import { toast } from 'react-toastify';
import axios from 'axios';

function NpsReport() {

  const { slug } = useParams()
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState()
  const [publicLinks, SetpublicLinks] = useState(null);
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

  const createMasterLink = async (e) =>{
    e.preventDefault();
    setIsLoading(true);
    const session_id = sessionStorage.getItem('session_id');
    console.log(session_id);
    try {
      // Fetch user information
      const pub_links = await axios.post(
        'https://100093.pythonanywhere.com/api/userinfo/',
        {
          // session_id: "p1frwekqkwq05ia3fajjujwgvjjz1ovy",
          session_id: sessionStorage.getItem('session_id'),
        }
      );

      const result = pub_links.data;
      console.log(result, "hhhhhhhhhhhhhhhhhhhhhhhhhb")
      setUserInfo(result.userinfo);
      
      const PublicLinks = [];
      const all_public_links = [];

      // Extract public links from user portfolio
      result.selected_product.userportfolio.forEach((portfolio) => {
        if (
          portfolio.member_type === 'public' 
          // &&
          // portfolio.product === 'Living Lab Scales'
        ) {
          PublicLinks.push(portfolio.username);
        }
      });
      console.log("BBBBBBBBBBBBBBBBBBBB", PublicLinks)

      const flattenedArray = [].concat(...PublicLinks);

      // Generate modified URLs
      const modifiedUrl = window.location.href.slice(
        0,
        window.location.href.lastIndexOf('/')
      );
      const lastPart = window.location.href.slice(
        window.location.href.lastIndexOf('/') + 1
      );
      console.log("nnnnnnnnnnnnbbbbbbbbbbb",flattenedArray.length)
      console.log("nnnnnnnnnnnnbbbbbbbbbbb", reportData.no_of_scales)
      if(flattenedArray.length < reportData.no_of_scales) {
       return toast.error('Insufficient public members');
      }
      for (
        let i = 0;
        i < reportData.no_of_scales && i < flattenedArray.length;
        i++
      ) {
        // Append the current element to the current window.location.href
        const newUrl = `${modifiedUrl}/${lastPart}/?public_link=${
          flattenedArray[i]
        }&code=${qrCodeURL}&instance_id=${i + 1}`;
        // const newUrl = `${modifiedUrl}/${flattenedArray[i]}/?public_link=${lastPart}`;
        all_public_links.push(newUrl);
      }

      SetpublicLinks(all_public_links);
      console.log(all_public_links, "HHHHHHHHHHHHHHHHHHHH")
    } catch (error) {
      setIsLoading(false);
      toast.error('Insufficient public members');
      // console.log("Error", "Insufficient public members");
    }
  }

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
      <button
        onClick={createMasterLink}
        className="rounded-lg py-2 px-3 bg-primary text-white min-w-[10rem] hover:bg-gray-600 hover:text-white font-medium" style={{marginTop: "10px"}}>
        Create master link
        </button>
    </div>
  )
}

export default NpsReport
