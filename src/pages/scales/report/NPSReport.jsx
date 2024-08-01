


import React, { useState, useEffect } from "react";
import Select from "react-select"
import {
  
  MenuItem,
  CircularProgress,
  LinearProgress,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSearchParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);


const defaultOptions={
    responsive: true,
    maintainAspectRatio: false,
    scales: {
    
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  }


const instanceNames = {
  instance_1: "Exhibition Feedback",
};


const allChannelsNameTag = "channel_all_x";

const channelNames = {
  [`${allChannelsNameTag}`]: "All Channels",
  channel_1: "Exhibition Hall",
};

const initialScoreData = {
    Detractor: { count: 0, percentage: 0 },
    Passive: { count: 0, percentage: 0 },
    Promoter: { count: 0, percentage: 0 },
   
};


function processData(responseData) {
  const dataByDate = {};
  let previousDateData = null;

  responseData.forEach((response) => {
    const dateCreated = formatDate(response.dowell_time.current_time);
    const category = response.category;
    let count = -1;

    if (category === "promoter") {
      count = 1;
    } else if (category !== "detractor") {
      count = 0;
    }

    if (!dataByDate[dateCreated]) {
      dataByDate[dateCreated] = { totalCount: 0, detractorCount: 0, promoterCount: 0, passiveCount: 0 };
    }

    if (count === 1) {
      dataByDate[dateCreated].promoterCount++;
    } else if(count==0) {
      dataByDate[dateCreated].passiveCount++;
    }else{
      dataByDate[dateCreated].detractorCount++;
    }

    dataByDate[dateCreated].totalCount++;
  });

  // Calculate cumulative counts and percentages
  Object.keys(dataByDate).forEach((date) => {
    const obj = dataByDate[date];
    if (previousDateData !== null) {
      obj.promoterCount += previousDateData.promoterCount;
      obj.passiveCount += previousDateData.passiveCount;
      obj.detractorCount += previousDateData.detractorCount;
      obj.totalCount += previousDateData.totalCount;
    }

   

    // Update previousDateData for next iteration
    previousDateData = obj;

  });

  return dataByDate;
}




function filterDataWithinDays(responseData,days) {
  const filteredData = responseData.filter(
    (item) =>
      isWithinLastDays(item.dowell_time.current_time, days)
  );

  return filteredData;
}

function isWithinLastDays(dateString, days) {
  const dateCreated = new Date(dateString);
  const today = new Date();
  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - days);

  return dateCreated >= cutoffDate && dateCreated <= today;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}


function transformData(originalData,days) {

  const transformedData = {};
  const endDate = new Date(); // Today's date
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000); // Today minus 7 days

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateKey = formatDate(currentDate);

    if (originalData.hasOwnProperty(dateKey)) {
      const { detractorCount,promoterCount,passiveCount} = originalData[dateKey];
    
     transformedData[dateKey]={detractorCount,promoterCount,passiveCount}
    } else {
      transformedData[dateKey] = transformedData[formatDate(new Date(currentDate.getTime() - 86400000))] || {detractorCount: 0, promoterCount: 0, passiveCount: 0}; // Get the value of the previous day or 0 if it doesn't exist
    }

    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return transformedData;
}

function pickSevenKeys(transformedData) {

  const keys = Object.keys(transformedData);
  const totalKeys = keys.length;
  const interval = Math.floor(totalKeys / 6); // Calculate the interval to ensure 7 keys including the first and last
  const selectedKeys = [];

  // Add the first key
  selectedKeys.push(keys[0]);

  // Add keys at regular intervals
  for (let i = interval; i < totalKeys; i += interval) {
    selectedKeys.push(keys[i]);
  }

  // Add the last key
  selectedKeys.push(keys[totalKeys - 1]);

  const selectedKeysObject = {};
  selectedKeys.forEach(key => {
    selectedKeysObject[key] = transformedData[key];
  });

  return selectedKeysObject;
}



function getIndividualCounts(data) {
  let detractorCounts = [];
  let promoterCounts = [];
  let passiveCounts = [];

  data.forEach(entry => {
      detractorCounts.push(entry.detractorCount);
      promoterCounts.push(entry.promoterCount);
      passiveCounts.push(entry.passiveCount);
  });

  return {
      detractorCounts,
      promoterCounts,
      passiveCounts
  };
}

const defaultScorePercentages = {
    Detractor: {
      count: 0,
      percentage: 0,
    },
    Passive: {
      count:0,
      percentage: 0,
    },
    Promoter: {
      count: 0,
      percentage:0,
    },
  };

const App = () => {

const[options,setOptions]=useState({})
  const [responseData, setResponseData] = useState([]);
  const[learningIndexData,setLearningIndexData]=useState({})
  const[learningLevelIndex,setLearningLevelIndex]=useState(0)
  const[learningStage,setLearningStage]=useState("")
  const[indexes,setIndexes]=useState([])
  const[counts,setCounts]=useState([])

  const [channels, setChannels] = useState([]);
  const [instances, setInstances] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedInstance, setSelectedInstance] = useState("");
  const [scores, setScores] = useState(initialScoreData);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState([]);
  const [dataForChart, setDataForChart] = useState({
    labels: [],
    datasets: [],
  });
  const[npsDataForChart,setNpsDataForChart]=useState({
    labels: [],
    datasets: [],
  })
  const [displayDataForAllSelection, setDisplayDataForAllSelection] = useState(
    []
  );
  //   const[instanceNames,setInstanceNames]=useState({})
  // const[channelNames,setChannelNames]=useState({})
  const[dateIndexPair,setDateCountPair]=useState({})
  const[err,setErr]=useState(false)
  const[msg,setMsg]=useState(false)
const[selectedDays,setSelectedDays]=useState(7)
const[npsOptionData,setNpsOptionData]=useState({})
const[totalScore,setTotalScore]=useState(0)
const[searchParams,setSearchParams]=useSearchParams()
const channelsArray = searchParams.get("channelDetails").split(",");
const instancesArray = searchParams.get("instanceDetails").split(",");


const[daysOptions,setDaysOptions]=useState({value: '7', label: '7 days'})
const[enableMultiChannel,setEnableMultiChannel]=useState(true)
const[enableMultiInstance,setEnableMultiInstance]=useState(true)
const[disableInstance,setDisableInstance]=useState(false)


const allChannelsNameTag = "channel_all_x";

const channelNames = {
  [`${allChannelsNameTag}`]: "All Channels",
};
let channelList,instanceList;
const channelOptionList= channelsArray.map((channel, index) => ({
    value: `channel_${index + 1}`,
    label: channel
  }));

  const instanceOptionList = instancesArray.map((instance, index) => ({
    value: `instance_${index + 1}`,
    label: instance
  }));

  channelList=[...channelOptionList]
  instanceList=[...instanceOptionList]
  channelOptionList.push({ value:allChannelsNameTag, label: "Entire Institution" },{ value: "channel_all", label: "All Classrooms" })
instanceOptionList.push({ value: "instance_all", label: "All Subjects" })
  const daysOptionList = [
    { value: "7", label: "7 days" },
    { value: "30", label: "30 days" },
    { value: "90", label: "90 days" },
  ];  

const scale_id=searchParams.get("scaleId")
  useEffect(() => {
    fetchData();
    const x=setInterval(()=>{
      fetchData();
    },10000)
 return(()=>{
 clearInterval(x)
 })
  }, []);




useEffect(()=>{
    if (!selectedChannel || !selectedInstance || (selectedChannel && selectedChannel.value==allChannelsNameTag) ||  ( selectedInstance && Array.isArray(selectedInstance) && selectedInstance.length==0)  || (selectedChannel && Array.isArray(selectedChannel) && selectedChannel.length==0)) {

        if((selectedInstance && Array.isArray(selectedInstance) && selectedInstance.length==0) || (selectedChannel && Array.isArray(selectedChannel) && selectedChannel.length==0) || (selectedChannel && !Array.isArray(selectedChannel) && !selectedInstance)){
        
    
    setScores(defaultScorePercentages)
  
  setOptions(defaultOptions)
  setNpsDataForChart({
    labels: [1,2,3,4,5],
    datasets: [
                  {
                    label: "NPS",
                    data:[0,0,0,0,0],
                    borderColor: "red",
                    backgroundColor: "red",
                  },
                 
                ],
  });
  setLearningStage("")
  setLearningLevelIndex(0)
    setTotalScore(0)
        }
    return
}

const channelData=[]
const helperChannel = !selectedChannel ? [] :(selectedChannel.value=="channel_all" ? channelList : (Array.isArray(selectedChannel) ? selectedChannel : [selectedChannel]));
const helperInstance = !selectedInstance ? [] : (selectedInstance.value=="instance_all" ? instanceList : (Array.isArray(selectedInstance) ? selectedInstance : [selectedInstance]));

helperChannel.map((channelName)=>{
  
  responseData.map((data)=>{
   
    if(data.channel==channelName.value)
      channelData.push(data)
  })

})
const filteredData=[]
channelData.map((data)=>{
    helperInstance.map((instanceName)=>{
          if(data.instance.trim()==instanceName.value)
            filteredData.push(data)
    })
})

  
  const arr = filterDataWithinDays(filteredData,selectedDays);

  if(arr.length==0){

setScores(defaultScorePercentages)
setTotalCount(0)
setDataForChart({
  labels: [1,2,3,4,5],
  datasets: [
                {
                  label: "Detractor",
                  data:[0,0,0,0,0],
                  borderColor: "red",
                  backgroundColor: "red",
                },
                {
                  label: "Promoter",
                  data:[0,0,0,0,0],
                  borderColor: "green",
                  backgroundColor: "green",
                },
                {
                  label: "Passive",
                  data: [0,0,0,0,0],
                  borderColor: "yellow",
                  backgroundColor: "yellow",
                },
              ],
});
setNpsDataForChart({
  labels: [1,2,3,4,5],
  datasets: [
                {
                  label: "NPS",
                  data:[0,0,0,0,0],
                  borderColor: "red",
                  backgroundColor: "red",
                },
               
              ],
});
    setMsg(true)
    return
  }
  
  setMsg(false)
  let scoreCounts={
    detractor:0,
    passive:0,
    promoter:0
   
  }
  let score=0
  arr.forEach((res)=>{
    scoreCounts[res.category]+=1
    score+=res.score
  })
  setTotalScore(score)

  const totalResponses=arr.length

  let percentages={
    Detractor:((scoreCounts.detractor/totalResponses)*100),
    Passive:((scoreCounts.passive/totalResponses)*100),
    Promoter:((scoreCounts.promoter/totalResponses)*100),
   
  }

  const scorePercentages = {
    Detractor: {
      count: scoreCounts["detractor"],
      percentage: percentages["Detractor"],
    },
    Passive: {
      count: scoreCounts["passive"],
      percentage: percentages["Passive"],
    },
    Promoter: {
      count: scoreCounts["promoter"],
      percentage: percentages["Promoter"],
    },
  };

  const processedData = processData(arr);
 
 const transData=transformData(processedData,selectedDays)

 const objectPair=pickSevenKeys(transData)

  setTotalCount(totalResponses);
setDateCountPair(objectPair)

  setScores(scorePercentages);

  
  let labels,datasetsInfo,options,npsOptions
  let detractorCounts=[], passiveCounts=[], promoterCounts=[], npsCounts=[]
if(!objectPair || !arr || arr.length==0){
  labels= [1,2,3,4,5],
  datasetsInfo= [0,0,0,0,0],
  options=npsOptions={
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  }
  
}else{
  const isSmallScreen = window.innerWidth < 600;
   labels=Object.keys(objectPair)
   datasetsInfo=Object.values(objectPair)

   let obj=getIndividualCounts(datasetsInfo)
   detractorCounts=obj.detractorCounts
   promoterCounts=obj.promoterCounts
   passiveCounts=obj.passiveCounts
   const arr=[...detractorCounts,...passiveCounts,...promoterCounts]
   for(let i=0;i<detractorCounts.length;i++){
    const val=detractorCounts[i]+promoterCounts[i]+passiveCounts[i]
    if(val==0)
      npsCounts[i]=0
    else
    npsCounts[i]=(((promoterCounts[i]-detractorCounts[i])/val)*100).toFixed(2)
   }
   const maxValue=arr.reduce((val,ele)=>Number(val)>ele?val:ele,0)
   const minNps = Math.min(...npsCounts);
    options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
  
      title: {
        display: true,
        text: "Responses Insights by Day",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: isSmallScreen ? 90 : 0,  // Vertical on small screens
          minRotation: isSmallScreen ? 90 : 0,  // Vertical on small screens
        }
      },
      y: {
        min: 0,
        max:Math.ceil(maxValue)+Math.ceil(maxValue / 5)>5?Math.ceil(maxValue)+Math.ceil(maxValue / 5):5,
        ticks: {
          stepSize: Math.ceil(maxValue / 5),
        },
        beginAtZero: true,
      },
    },
  };
  npsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Daywise NPS",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: isSmallScreen ? 90 : 0,
          minRotation: isSmallScreen ? 90 : 0,
        },
      },
      y: {
        min:minNps<0 ? -100:minNps, // Set the minimum to half of the range in negative
        max:100, // Set the maximum to half of the range in positive
        ticks: {
          stepSize: 25,
          callback: function(value) {
            return value; // Return the value as is, for negative and positive values
          }
        },
        beginAtZero: true,
      },
    },
  };
}

setNpsOptionData(npsOptions)
  setOptions(options)
  setDataForChart({
    labels: labels,
    datasets: [
                  {
                    label: "Detractor",
                    data: detractorCounts,
                    borderColor: "red",
                    backgroundColor: "red",
                  },
                  {
                    label: "Promoter",
                    data:promoterCounts,
                    borderColor: "green",
                    backgroundColor: "green",
                  },
                  {
                    label: "Passive",
                    data: passiveCounts,
                    borderColor: "yellow",
                    backgroundColor: "yellow",
                  },
                ],
  });
  setNpsDataForChart({
    labels: labels,
    datasets: [
                  {
                    label: "NPS",
                    data: npsCounts,
                    borderColor: "red",
                    backgroundColor: "red",
                  },]
  })
},[selectedDays,selectedInstance,responseData,selectedChannel])



  useEffect(() => {
    if (!selectedChannel || Array.isArray(selectedChannel) || (selectedChannel && selectedChannel.value !==allChannelsNameTag) || selectedInstance){
      
        setDisplayDataForAllSelection([]);
          return 
      
    }
    if(responseData.length==0){
      setMsg(true)
      return
    }
    
    const allData = instances.map((instance) => {
      const dataForInstance = responseData.filter(
        (item) => item.instance_name.trim() === instance
      );
    
      let dummyCount={
        detractor: 0,
         passive: 0,
          promoter: 0, 
         
      }
      let dummyPercentages={
        detractor: 0,
        passive: 0,
         promoter: 0, 
      }
  
let scoreCounts,percentages,objectPair,totalResponses, score=0
  if(dataForInstance.length==0 ){
     scoreCounts=dummyCount
     percentages=dummyPercentages
  }else{
  
  const arr = filterDataWithinDays(dataForInstance,selectedDays)
  if(arr.length==0){

    setMsg(true)
    return
  }
  
  setMsg(false)
   scoreCounts={
    detractor:0,
    passive:0,
    promoter:0
   
  }

  arr.forEach((res)=>{
    scoreCounts[res.category]+=1
    score+=res.score
  })

   totalResponses=arr.length

   percentages={
    Detractor:((scoreCounts.detractor/totalResponses)*100),
    Passive:((scoreCounts.passive/totalResponses)*100),
    Promoter:((scoreCounts.promoter/totalResponses)*100),
   
  }
  const processedData = processData(arr);

  const transData=transformData(processedData,selectedDays)
   objectPair=pickSevenKeys(transData)
  }
  
   const scorePercentages = {
    Detractor: {
      count: scoreCounts["detractor"],
      percentage: percentages["Detractor"],
    },
    Passive: {
      count: scoreCounts["passive"],
      percentage: percentages["Passive"],
    },
    Promoter: {
      count: scoreCounts["promoter"],
      percentage: percentages["Promoter"],
    },
  };

  setScores(scorePercentages);


   
     let labels,datasetsInfo,options,npsOptions
     let detractorCounts=[], passiveCounts=[], promoterCounts=[], npsCounts=[]
if(!objectPair || dataForInstance.length==0){
  labels= [1,2,3,4,5],
  datasetsInfo= [0,0,0,0,0],
  options=npsOptions={
    responsive: true,
    maintainAspectRatio: false,
    scales: {
    
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  }
  
}else{
  const isSmallScreen = window.innerWidth < 600;
   labels=Object.keys(objectPair)
   datasetsInfo=Object.values(objectPair)

   let obj=getIndividualCounts(datasetsInfo)
   detractorCounts=obj.detractorCounts
   promoterCounts=obj.promoterCounts
   passiveCounts=obj.passiveCounts

   for(let i=0;i<detractorCounts.length;i++){
    const val=detractorCounts[i]+promoterCounts[i]+passiveCounts[i]
    if(val==0)
      npsCounts[i]=0
    else
    npsCounts[i]=(((promoterCounts[i]-detractorCounts[i])/val)*100).toFixed(2)
   }
  //  npsCounts[0]=-20
  //  npsCounts[1]=-80
  //  npsCounts[2]=-100

   const arr=[...detractorCounts,...passiveCounts,...promoterCounts]
   const maxValue=arr.reduce((val,ele)=>Number(val)>ele?val:ele,0)

    options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
   
      // legend: {
      //   display: false, // This disables the legend entirely
      // },
      title: {
        display: true,
        text: "Responses Insights by Day",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: isSmallScreen ? 90 : 0,  // Vertical on small screens
          minRotation: isSmallScreen ? 90 : 0,  // Vertical on small screens
        }
      },
      y: {
        min: 0,
        max:Math.ceil(maxValue)+Math.ceil(maxValue / 5)>5?Math.ceil(maxValue)+Math.ceil(maxValue / 5):5,
        ticks: {
          stepSize: Math.ceil(maxValue / 5),
        },
        beginAtZero: true,
      },
    },
  };
  const maxNps = Math.max(...npsCounts);
const minNps = Math.min(...npsCounts);




 npsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Daywise NPS",
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: isSmallScreen ? 90 : 0,
        minRotation: isSmallScreen ? 90 : 0,
      },
    },
    y: {
      min:minNps<0 ? -100:minNps, // Set the minimum to half of the range in negative
      max:100, // Set the maximum to half of the range in positive
      ticks: {
        stepSize: 25,
        callback: function(value) {
          return value; // Return the value as is, for negative and positive values
        }
      },
      beginAtZero: true,
    },
  },
};

}
   
   setOptions(options)
setNpsOptionData(npsOptions)
      return {
        instanceName: instance,
        totalResponses: totalResponses,
        totalScoreData:score,
        scoreCounts:scorePercentages,
        chartData: {
          labels: labels,
          datasets: [
                        {
                          label: "Detractor",
                          data:detractorCounts,
                          borderColor: "red",
                          backgroundColor: "red",
                        },
                        {
                          label: "Promoter",
                          data: promoterCounts,
                          borderColor: "green",
                          backgroundColor: "green",
                        },
                        {
                          label: "Passive",
                          data:passiveCounts,
                          borderColor: "yellow",
                          backgroundColor: "yellow",
                        },
                      ],
       
        },
        npsData:{
          labels: labels,
          datasets: [{
                          label: "NPS",
                          data:npsCounts,
                          borderColor: "red",
                          backgroundColor: "red",
                        }]
        }
      };
    });

    setDisplayDataForAllSelection(allData);
  }, [selectedChannel, responseData, instances,selectedDays]);

  const fetchData = async () => {

    try {
      const response = await axios.get(
        `https://100035.pythonanywhere.com/addons/learning-index-report/?scale_id=${scale_id}`
      );
     const data=response.data.data
    if(data==undefined){
      setErr(true)
      setLoading(false)
      return
    }
    if(data.length==0){
      setMsg(true)
      setLoading(false)
       return
    }
setErr(false)
      const uniqueChannels = Array.from(
        new Set(data.map((item) => item.channel))
      );
      const uniqueInstances = Array.from(
        new Set(data.map((item) => item.instance.trim()))
      );

      setChannels([allChannelsNameTag, ...uniqueChannels]);
      setInstances(uniqueInstances);
      setResponseData(data);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching data:", error);
      setErr(true)
      setLoading(false); // Set loading to false even in case of error
    }
  };

  const handleChannelSelect = (data) => {

    if(Array.isArray(data) ){
     
      if(data.length==0){
          setSelectedChannel([])
          return
      }
      if(data[data.length-1].value==allChannelsNameTag){
      setSelectedChannel(data[data.length-1])
      setEnableMultiChannel(false)
      setDisableInstance(true)
      setSelectedInstance(null)
    }else{
      if(data[data.length-1].value=="channel_all"){
        setSelectedChannel(data[data.length-1])
        setEnableMultiChannel(false)
      }else{
      setEnableMultiChannel(true)
    setSelectedChannel(data)
    setDisableInstance(false)
      }
    }
   
  }else{
    if(data.value==allChannelsNameTag){
      setDisableInstance(true)
      setEnableMultiChannel(false)
      setSelectedInstance(null)
    }else{
      if(data.value=="channel_all"){
        setSelectedChannel(data[data.length-1])
        setEnableMultiChannel(false)
        setDisableInstance(false)
      }else{
      setDisableInstance(false)
      setEnableMultiChannel(true)
      }

    }
    setSelectedChannel(data)
  }
  };

  const handleInstanceSelect = (data) => {
    
    if(Array.isArray(data)){
      if(data.length==0){
        setSelectedInstance([])
        return
    }
      if(data[data.length-1].value=="instance_all"){
        setSelectedInstance(data[data.length-1]);
       
        setEnableMultiInstance(false) 
      }else{
        setSelectedInstance(data);
        setEnableMultiInstance(true)
      }
    }else{
      if(data.value=="instance_all"){
        setSelectedInstance(data);
        setEnableMultiInstance(false) 
      }else{
        setSelectedInstance(data);
        setEnableMultiInstance(true)
      }
    }
   
  };

  const handleDaysSelect = (data) => {
    setDaysOptions(data)
    setSelectedDays(parseInt(data.value));
  };




  if (loading) {
    return <CircularProgress />;
  }
  if(err){
    return(
      <>
      <p className="w-screen h-screen flex justify-center items-center p-2 text-red-600">Something went wrong contact admin!..</p>
      </>
    )
  }
  

  return (
    <Box p={3} className='ml-[10%] lg:ml-[20%] w-full'>
      <Typography variant="h6" align="center" gutterBottom>
      Net Promoter Score
      </Typography>
      {msg && <p className="text-red-500 self-center w-full flex justify-center">Provide feedback to check report</p>}
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={4}>
     
          <Select
  options={channelOptionList}
  placeholder="Select Classroom"
  value={selectedChannel}
  onChange={handleChannelSelect}
  isSearchable={true}
  isMulti={enableMultiChannel}
/>
        </Grid>
        <Grid item xs={12} md={4}>
        
                     <Select
  options={instanceOptionList}
  placeholder="Select Subject"
  value={selectedInstance}
  onChange={handleInstanceSelect}
  isSearchable={true}
  isMulti={enableMultiInstance}
  isDisabled={disableInstance}
/>
        </Grid> 
 
        <Grid item xs={12} md={3}>
  
                     <Select
  options={daysOptionList}
  placeholder="Select Days"
  value={daysOptions}
  onChange={handleDaysSelect}

/>
</Grid>    
      </Grid>
      {!Array.isArray(selectedChannel) && (selectedChannel && selectedChannel.value==allChannelsNameTag) ? (
        <>
          {React.Children.toArray(
            displayDataForAllSelection.map((item, index) => {
         
              return (
                <>
                <Typography
                    variant="h6"
                    align="left"
                    style={{ marginTop: "32px", marginBottom: "10px" }}
                  >
                   <span className='flex justify-center items-center w-full gap-10'><span> {index + 1}. <span className='text-[18px] ml-3 font-medium'>{item.channelName.label}</span></span>  <span className='text-[16px]'>{item.instanceName.label} </span></span>
                  </Typography>
                  <div className="flex justify-center items-center gap-6 sm:gap-12 mt-10 flex-wrap">
                
               

                  <p className="text-[20px] font-bold text-blue-600 mb-2" >
                  Total Responses: {item?.totalResponses}
        </p>
      
        <p className="text-[20px] font-bold text-blue-600 mb-2" >
         NPS:  {(item.scoreCounts.Promoter.percentage-item.scoreCounts.Detractor.percentage).toFixed(2)}
        </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-center md:gap-3 items-center w-[100%]">
          <div className="w-[90%] md:w-1/2 flex flex-col justify-start items-start">
        <p className="text-center font-medium p-2 w-full mt-2">Total Score:</p>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', position: 'relative', paddingBottom: '20px' }} className="mb-">
  <div style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', width: '100%', position: 'relative' }}>
    <div
      style={{
        width: `${(item?.totalScoreData / (item?.totalResponses * 10)) * 100 || 0}%`,
        backgroundColor: 'blue',
        height: '20px',
        transition: 'width 0.5s ease-in-out',
        position: 'relative',
      }}
    >
     
    </div>
  </div>
  <div style={{
        width: `${(item?.totalScoreData / (item?.totalResponses * 10)) * 100 || 0}%`,
       
        position: 'relative',
      }}>
  <span
        className={`absolute font-bold text-[12px] text-blue-600 ${item?.totalResponses==0 && "hidden"}`}
        style={{
          right: 0,
          bottom: '-20px',
          transform: 'translateX(50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {item?.totalScoreData}
      </span>
      </div>
  <div style={{ position: 'absolute', left: 0, top: '20px', fontSize: '12px' }}>0</div>
  <div style={{ position: 'absolute', right: 0, top: '20px', fontSize: '12px' }}  className={` ${item?.totalResponses==0 && "hidden"}`}>{item?.totalResponses * 10}</div>
</div>
</div>
<div className="w-[90%] md:w-1/2 flex flex-col justify-start items-start mb-[10px]">

<p className="text-center font-medium p-2 w-full">NPS Category Distribution</p>
 <Box position="relative" height="24px" width="100%" maxWidth="600px" margin="0 auto" borderRadius="12px" overflow="hidden" border="1px solid #ddd" text="black">
      {Object.entries(item?.scoreCounts).map(([score, data], index) => (
        <Box
        key={score}
        position="absolute"
        left={`${Object.entries(item?.scoreCounts).slice(0, index).reduce((acc, [_, val]) => acc + val.percentage, 0)}%`}
        width={`${data.percentage}%`}
        height="100%"
        bgcolor={
          score === "Detractor"
            ? "red"
            : score === "Passive"
            ? "yellow"
            : "green"
        }
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ color: 'black', fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
      >
   
       
          {data.percentage.toFixed(1)}%
       
      </Box>
      
      ))}
    </Box>
    </div>
    </div>


                  <Grid item xs={12} md={0} className="block mb-5 md:hidden " >
 
            <>
            <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "400px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                 <Line options={npsOptionData} data={item?.npsData} />
              </Box>
              <Box
                sx={{
                  my: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "400px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={options} data={item.chartData} />
              </Box>
             
            </>
   
  </Grid>
   
                  <div className="hidden md:flex justify-center items-center mt-10 gap-12 flex-wrap" >
  <Grid item xs={12} md={5}>
    <Box sx={{ width: '600px', height: { xs: '300px', sm: '380px' } }}>
      <Line options={options} data={item?.chartData} />
    </Box>
  </Grid>
  <Grid item xs={12} md={5}>
    <Box sx={{ width: '600px', height: { xs: '300px', sm: '380px' } }}>
      <Line options={npsOptionData} data={item?.npsData} />
    </Box>
  </Grid>
</div>

    </>
              );
            })
          )}
        </>
      ) : (
        <>
     
      <div className="flex justify-center items-center gap-6 sm:gap-12 mt-10  flex-wrap ">
                
               

                  <p className="text-[20px] font-bold text-blue-600 mb-2" >
                  Total Responses: {totalCount}
        </p>
      
        <p className="text-[20px] font-bold text-blue-600 mb-2" >
         NPS:  {(scores.Promoter.percentage-scores.Detractor.percentage).toFixed(2)}
        </p>
        </div>
      <div className="flex flex-col lg:flex-row justify-center md:gap-3 items-center w-[100%]">
          <div className="w-[90%] md:w-1/2 flex flex-col justify-start items-start">
        <p className="text-center font-medium p-2 w-full mt-2">Total Score</p>
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', position: 'relative', paddingBottom: '20px'}} className="mb-">
  <div style={{ border: '1px solid #ddd', overflow: 'hidden', width: '100%', position: 'relative', borderRadius:"12px"  }}>
    <div
      style={{
        width: `${(totalScore/ (totalCount * 10)) * 100 || 0}%`,
        backgroundColor:totalCount==0 ?"white":'blue',
        height: '20px',
        transition: 'width 0.5s ease-in-out',
        position: 'relative',
      }}
    >
     
    </div>
  </div>
  <div style={{
        width: `${(totalScore / (totalCount * 10)) * 100 || 0}%`,
       
        position: 'relative',
      }}>
  <span
        className={`absolute font-bold text-[12px] text-blue-600 ${totalCount==0 && "hidden"}`}
        style={{
          right: 0,
          bottom: '-20px',
          transform: 'translateX(50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {totalScore}
      </span>
      </div>
  <div style={{ position: 'absolute', left: 0, top: '20px', fontSize: '12px' }}>0</div>
  <div style={{ position: 'absolute', right: 0, top: '20px', fontSize: '12px' }} className={` ${totalCount==0 && "hidden"}`}>{totalCount * 10}</div>
</div>
</div>
<div className="w-[90%] md:w-1/2 flex flex-col justify-start items-start mb-[10px]">

<p className="text-center font-medium p-2 w-full">NPS Category Distribution</p>
 <Box position="relative" height="24px" width="100%" maxWidth="600px" margin="0 auto" borderRadius="12px" overflow="hidden" border="1px solid #ddd" text="black">
      {Object.entries(scores).map(([score, data], index) => (
        
        <Box
          key={score}
          position="absolute"
          left={`${Object.entries(scores).slice(0, index).reduce((acc, [_, val]) => acc + val.percentage, 0)}%`}
          width={`${data.percentage}%`}
          height="100%"
          bgcolor={
           
            score === "Detractor"
              ? "red"
              : score === "Passive"
              ? "yellow"
              : "green"
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ color: 'black', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
        >
          {/* {data.count>0 ?  data.count  :""} */}
     
          {data.percentage.toFixed(1)}%
        </Box>
      ))}
    </Box>
    </div>
    </div>

      <Grid item xs={12} md={0} className="block md:hidden">
  {selectedChannel.length < 1 || selectedInstance.length < 1 ? null : (
            <>
                 <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "400px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={npsOptionData} data={npsDataForChart} />
              </Box>
              <Box
                sx={{
                  my: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "400px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={options} data={dataForChart} />
              </Box>
         
            </>
          )}
  </Grid>
 

<div className="hidden md:flex justify-center items-center mt-10 gap-12 flex-wrap" >
  {selectedChannel.length < 1 || selectedInstance.length < 1 ? null : (
    <>
  <Grid item xs={12} md={5}>
    <Box sx={{ width: '600px', height: { xs: '300px', sm: '380px' } }}>
      <Line options={options} data={dataForChart} />
    </Box>
  </Grid>
  <Grid item xs={12} md={5}>
    <Box sx={{ width: '600px', height: { xs: '300px', sm: '380px' } }}>
      <Line options={npsOptionData} data={npsDataForChart} />
    </Box>
  </Grid>
  </>
  )}
</div>
        
          
        </>
      )}
    </Box>
  );
};

export default App


