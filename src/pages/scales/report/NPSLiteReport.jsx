


import React, { useState, useEffect } from "react";
import Select  from "react-select"
import { useSearchParams } from "react-router-dom";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);



const initialScoreData = {
    No: { count: 0, percentage: 0 },
    Maybe: { count: 0, percentage: 0 },
    Yes: { count: 0, percentage: 0 },
   
};


function processData(responseData) {
  const dataByDate = {};
  let previousDateData = null;

  responseData.forEach((response) => {
    const dateCreated = formatDate(response.date_created);
    const category = response.category;
    let count = -1;

    if (category === "yes") {
      count = 1;
    } else if (category !== "no") {
      count = 0;
    }

    if (!dataByDate[dateCreated]) {
      dataByDate[dateCreated] = { totalCount: 0, noCount: 0, yesCount: 0, maybeCount: 0 };
    }

    if (count === 1) {
      dataByDate[dateCreated].yesCount++;
    } else if(count==0) {
      dataByDate[dateCreated].maybeCount++;
    }else{
      dataByDate[dateCreated].noCount++;
    }

    dataByDate[dateCreated].totalCount++;
  });

  // Calculate cumulative counts and percentages
  Object.keys(dataByDate).forEach((date) => {
    const obj = dataByDate[date];
    if (previousDateData !== null) {
      obj.yesCount += previousDateData.yesCount;
      obj.maybeCount += previousDateData.maybeCount;
      obj.noCount += previousDateData.noCount;
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
      isWithinLastDays(item.date_created, days)
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
      const { noCount,yesCount,maybeCount} = originalData[dateKey];
    
     transformedData[dateKey]={noCount,yesCount,maybeCount}
    } else {
      transformedData[dateKey] = transformedData[formatDate(new Date(currentDate.getTime() - 86400000))] || {noCount: 0, yesCount: 0, maybeCount: 0}; // Get the value of the previous day or 0 if it doesn't exist
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
  let noCounts = [];
  let yesCounts = [];
  let maybeCounts = [];

  data.forEach(entry => {
      noCounts.push(entry.noCount);
      yesCounts.push(entry.yesCount);
     maybeCounts.push(entry.maybeCount);
  });

  return {
      noCounts,
     yesCounts,
     maybeCounts
  };
}

const defaultOptions = {
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
};

const App = () => {

const[options,setOptions]=useState({})
  const [responseData, setResponseData] = useState([]);
  const [channels, setChannels] = useState([]);
  const [instances, setInstances] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState();
  const [selectedInstance, setSelectedInstance] = useState();
  const [scores, setScores] = useState(initialScoreData);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
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
  const[dateIndexPair,setDateCountPair]=useState({})
  const[err,setErr]=useState(false)
  const[msg,setMsg]=useState(false)
const[selectedDays,setSelectedDays]=useState(7)
const[npsOptionData,setNpsOptionData]=useState({})
const[totalScore,setTotalScore]=useState(0)
const[daysOptions,setDaysOptions]=useState({value: '7', label: '7 days'})
const[enableMultiChannel,setEnableMultiChannel]=useState(true)
const[enableMultiInstance,setEnableMultiInstance]=useState(true)
const[disableInstance,setDisableInstance]=useState(false)
const[searchParams,setSearchParams]=useSearchParams()
const[instanceOptionListDynamic,setInstanceOptionListDynamic]=useState([])
const channelsArray = searchParams.get("channelDetails").split(",");
const instancesArray = searchParams.get("instanceDetails").split(",");
const scaleDisplayName=searchParams.get("scaleDisplayName")

const instanceCountsForChannels=searchParams.get("counts").split(",")
const allChannelsNameTag = "channel_all_x";

const channelNames = {
  [`${allChannelsNameTag}`]: "All Channels",
};
let channelList,instanceList;
const channelOptionList= channelsArray.map((channel, index) => ({
    value: `channel_${index + 1}`,
    label: channel
  }));
  let start = 0, cumulativeCount = 0;
  const instancesPickerObj = instancesArray.reduce((obj, element, index) => {
      // Initialize the channel if it doesn't exist
      if (!obj[`channel_${start + 1}`]) {
          obj[`channel_${start + 1}`] = [];
      }
      
      if (start < instanceCountsForChannels.length && instanceCountsForChannels[start] > cumulativeCount) {
          obj[`channel_${start + 1}`].push({ value: `instance_${cumulativeCount + 1}`, label: `${element}` });
          cumulativeCount += 1;
      } else {
          cumulativeCount = 0;
          start += 1;
  
          // Ensure the new channel is initialized
          if (start < instanceCountsForChannels.length && !obj[`channel_${start + 1}`]) {
              obj[`channel_${start + 1}`] = [];
          }
  
          // Re-add the current element to the next channel if conditions met
          if (start < instanceCountsForChannels.length && instanceCountsForChannels[start] > cumulativeCount) {
              obj[`channel_${start + 1}`].push({ value: `instance_${cumulativeCount + 1}`, label: `${element}` });
              cumulativeCount += 1;
          }
      }
      return obj;
  }, {});
  
  useEffect(() => {
    setSelectedInstance([])
    if (!selectedChannel || (selectedChannel && selectedChannel.length === 0) ) {
      setDisableInstance(true)
      setInstanceOptionListDynamic([]);
      return;
    }
   if(selectedChannel && selectedChannel.value=="channel_all_x"){
    setDisableInstance(true)
    setSelectedInstance([])
    return
   }
    
  setDisableInstance(false)
  
    if ((selectedChannel && Array.isArray(selectedChannel)) || (selectedChannel && (selectedChannel.value !== 'channel_all' && selectedChannel.value !== 'channel_all_x'))) {
      let helperArray = Array.isArray(selectedChannel) ? instancesPickerObj[selectedChannel[selectedChannel.length - 1].value] : instancesPickerObj[selectedChannel.value];
 
      if (!instanceOptionListDynamic || (instanceOptionListDynamic && instanceOptionListDynamic.length === 0)) {
        setInstanceOptionListDynamic([...helperArray,{ value: "instance_all", label: "All Subjects" }]);
      } else {
        const prevInstances = instanceOptionListDynamic;
  
        // Use set operations for efficient updates
        const helperArraySet = new Set(helperArray.map(item => item.value));
        const prevInstancesSet = new Set(prevInstances.map(item => item.value));
  
        // Find common elements and removed elements
        const commonElements = prevInstances.filter(item => helperArraySet.has(item.value));
        const removedElements = prevInstances.filter(item => !helperArraySet.has(item.value));
  
        // Update instanceOptionListDynamic based on common and removed elements
        const newInstances = [...commonElements];
        if (helperArray.length > commonElements.length) {
          newInstances.push(...helperArray.filter(item => !prevInstancesSet.has(item.value)));
        }
     newInstances.push({ value: "instance_all", label: "All Subjects" })
        setInstanceOptionListDynamic(newInstances);
      }
    }else{
      if (selectedChannel && selectedChannel.value === "channel_all") {
        const uniqueValues = new Set();
        const combinedArray = Object.values(instancesPickerObj)
          .flatMap(arr => arr) // Flatten the array of arrays
          .filter(item => {
            if (uniqueValues.has(item.value)) {
              return false; // Skip duplicates
            }
            uniqueValues.add(item.value);
            return true;
          });
      
        setInstanceOptionListDynamic([...combinedArray, { value: "instance_all", label: "All Subjects" }]);
      }
    }
  }, [selectedChannel]);
  

const instanceSet=new Set(instancesArray)
  const instanceOptionList = Array.from(instanceSet).map((instance, index) => ({
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
      
    
      
      setScores({
        No: {
          count: 0,
          percentage: 0,
        },
        Maybe: {
          count:0,
          percentage: 0,
        },
        Yes: {
          count: 0,
          percentage:0,
        },
      })

    setTotalScore(0)
    setTotalCount(0)
        }
    
    
      return;
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
    const scorePercentages = {
      No: {
        count: 0,
        percentage: 0,
      },
      Maybe: {
        count:0,
        percentage: 0,
      },
      Yes: {
        count: 0,
        percentage:0,
      },
    };

setScores(scorePercentages)
setTotalCount(0)
setDataForChart({
  labels: [1,2,3,4,5],
  datasets: [
                {
                  label: "No",
                  data:[0,0,0,0,0],
                  borderColor: "red",
                  backgroundColor: "red",
                },
                {
                  label: "Yes",
                  data:[0,0,0,0,0],
                  borderColor: "green",
                  backgroundColor: "green",
                },
                {
                  label: "Maybe",
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
    no:0,
    maybe:0,
    yes:0
   
  }
  let score=0
  arr.forEach((res)=>{
    scoreCounts[res.category]+=1
    score+=res.score
  })
  setTotalScore(score)

  const totalResponses=arr.length

  let percentages={
    No:((scoreCounts.no/totalResponses)*100),
    Maybe:((scoreCounts.maybe/totalResponses)*100),
    Yes:((scoreCounts.yes/totalResponses)*100),
   
  }

  const scorePercentages = {
    No: {
      count: scoreCounts["no"],
      percentage: percentages["No"],
    },
    Maybe: {
      count: scoreCounts["maybe"],
      percentage: percentages["Maybe"],
    },
    Yes: {
      count: scoreCounts["yes"],
      percentage: percentages["Yes"],
    },
  };

  const processedData = processData(arr);
 
 const transData=transformData(processedData,selectedDays)

 const objectPair=pickSevenKeys(transData)

  setTotalCount(totalResponses);
setDateCountPair(objectPair)

  setScores(scorePercentages);

  
  let labels,datasetsInfo,options,npsOptions
  let noCounts=[], maybeCounts=[],yesCounts=[], npsCounts=[]
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
   noCounts=obj.noCounts
   yesCounts=obj.yesCounts
  maybeCounts=obj.maybeCounts
   const arr=[...noCounts,...maybeCounts,...yesCounts]
   for(let i=0;i<noCounts.length;i++){
    const val=noCounts[i]+yesCounts[i]+maybeCounts[i]
    if(val==0)
      npsCounts[i]=0
    else
    npsCounts[i]=(((yesCounts[i]-noCounts[i])/val)*100).toFixed(2)
   }
   const maxValue=arr.reduce((val,ele)=>Number(val)>ele?val:ele,0)
   const minNps = Math.min(...npsCounts);
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
                    label: "No",
                    data: noCounts,
                    borderColor: "red",
                    backgroundColor: "red",
                  },
                  {
                    label: "Yes",
                    data:yesCounts,
                    borderColor: "green",
                    backgroundColor: "green",
                  },
                  {
                    label: "Maybe",
                    data: maybeCounts,
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
    if (!selectedChannel || Array.isArray(selectedChannel) || (selectedChannel && selectedChannel.value !==allChannelsNameTag) || (selectedInstance && selectedInstance.length>0)){
    
      setDisplayDataForAllSelection([]);
        return 
    
  }
 

    if(responseData.length==0){
      setMsg(true)
      return
    }
   
    const allData = instanceList.flatMap((instance) => {
      return channelList.map((channel) => {
        const dataForInstanceAndChannel = responseData.filter(
          (item) => item.instance.trim() === instance.value && item.channel.trim() === channel.value
        );
    
       
      let dummyCount={
        no:0,
        maybe:0,
        yes:0
         
      }
      let dummyPercentages={
        no:0,
    maybe:0,
    yes:0
      }
  
let scoreCounts,percentages,objectPair,totalResponses, score=0
  if(dataForInstanceAndChannel.length==0 ){
     scoreCounts=dummyCount
     percentages=dummyPercentages
  }else{
  
  const arr = filterDataWithinDays(dataForInstanceAndChannel,selectedDays)
  if(arr.length==0){

    setMsg(true)
    return
  }
 
  setMsg(false)
   scoreCounts={
    no:0,
    maybe:0,
    yes:0
   
  }

  arr.forEach((res)=>{
    scoreCounts[res.category]+=1
    score+=res.score
  })

   totalResponses=arr.length

   percentages={
    No:((scoreCounts.no/totalResponses)*100),
    Maybe:((scoreCounts.maybe/totalResponses)*100),
    Yes:((scoreCounts.yes/totalResponses)*100),
   
  }
  const processedData = processData(arr);

  const transData=transformData(processedData,selectedDays)
   objectPair=pickSevenKeys(transData)
  }
  
   const scorePercentages = {
    No: {
      count: scoreCounts["no"],
      percentage: percentages["No"],
    },
    Maybe: {
      count: scoreCounts["maybe"],
      percentage: percentages["Maybe"],
    },
    Yes: {
      count: scoreCounts["yes"],
      percentage: percentages["Yes"],
    },
  };

  setScores(scorePercentages);


   
     let labels,datasetsInfo,options,npsOptions
     let noCounts=[], maybeCounts=[], yesCounts=[], npsCounts=[]
if(!objectPair || dataForInstanceAndChannel.length==0){
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
   noCounts=obj.noCounts
   yesCounts=obj.yesCounts
  maybeCounts=obj.maybeCounts
   

   for(let i=0;i<noCounts.length;i++){
    const val=noCounts[i]+yesCounts[i]+maybeCounts[i]
    if(val==0)
      npsCounts[i]=0
    else
    npsCounts[i]=(((yesCounts[i]-noCounts[i])/val)*100).toFixed(2)
   }
  //  npsCounts[0]=-20
  //  npsCounts[1]=-80
  //  npsCounts[2]=-100

   const arr=[...noCounts,...maybeCounts,...yesCounts]
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
        max:100,
        ticks: {
          stepSize:5
        },
        beginAtZero: true,
      },
    },
  };
  //Math.ceil(maxValue)+Math.ceil(maxValue / 5)>5?Math.ceil(maxValue)+Math.ceil(maxValue / 5):5,
  // Math.ceil(maxValue / 5),
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

      return {
        options,
        npsOptionData,
        instanceName: instance,
        channelName: channel,
        totalResponses: totalResponses,
        totalScoreData:score,
        scoreCounts:scorePercentages,
        chartData: {
          labels: labels,
          datasets: [
                        {
                          label: "No",
                          data:noCounts,
                          borderColor: "red",
                          backgroundColor: "red",
                        },
                        {
                          label: "Yes",
                          data:yesCounts,
                          borderColor: "green",
                          backgroundColor: "green",
                        },
                        {
                          label: "Maybe",
                          data:maybeCounts,
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
    });


    setDisplayDataForAllSelection(allData.filter((ele)=>ele.totalResponses));
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
        setSelectedInstance([])
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
    return <div className='h-screen w-screen flex justify-center items-center'><CircularProgress /></div>;
  }
  if(err){
    return(
      <>
      <p className="w-screen h-screen flex justify-center items-center p-2 text-red-600">Something went wrong contact admin!..</p>
      </>
    )
  }
  
  return (
    <Box   className='p-0 ml-[10%] lg:ml-[20%] w-full sm:p-3'>
      <Typography variant="h6" align="center" gutterBottom>
{scaleDisplayName}      
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
  options={instanceOptionListDynamic}
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
                    style={{ marginTop: "26px"}}
                  >
                     <span className='flex justify-center items-center w-full gap-10'><span> {index + 1}. <span className='text-[18px] ml-3 font-medium'>{item.channelName.label}</span></span>  <span className='text-[16px]'>{item.instanceName.label} </span></span>
                  </Typography>
                  <div className="flex justify-center items-center gap-6 sm:gap-12 mt-10 flex-wrap">
                
               

                  <p className="text-[20px] font-bold text-blue-600 mb-2" >
                  Total Responses: {item?.totalResponses}
        </p>
      
        <p className="text-[20px] font-bold text-blue-600 mb-2" >
         NPS:  {(item.scoreCounts.Yes.percentage-item.scoreCounts.No.percentage).toFixed(2)}
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
        className={`absolute font-bold text-[12px] text-blue-600 ${item?.totalResponses==0 || !item?.totalResponses && "hidden"}`}
        style={{
          right: 0,
          bottom: '-30px',
          transform: 'translateX(50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {item?.totalScoreData}
      </span>
      </div>
  <div style={{ position: 'absolute', left: 0, top: '20px', fontSize: '12px' }}>0</div>
  <div style={{ position: 'absolute', right: 0, top: '20px', fontSize: '12px' }}  className={`${item?.totalResponses==0 || !item?.totalResponses && "hidden"}`}>{item?.totalResponses * 10}</div>
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
        width={`${data.percentage || 0}%`}
       height="100%"
        bgcolor={
          score === "No"
            ? "red"
            : score === "Maybe"
            ? "yellow"
            : "green"
        }
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ color: 'black', fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
      >
   
       
   <span className={`font-medium ${!data.percentage && `pl-10`}`}>({(data.percentage ? data.percentage.toFixed(2) : 0)}%)</span>
       
      </Box>
      
      ))}
    </Box>
    </div>
    </div>
{!item?.totalResponses ? null :(
  <>

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
                 <Line options={item.npsOptionData} data={item?.npsData} />
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
                <Line options={item.options} data={item.chartData} />
              </Box>
             
            </>
   
  </Grid>
   
                  <div className="hidden md:flex justify-center items-center mt-10 gap-12 flex-wrap" >
  <Grid item xs={12} md={5}>
    <Box sx={{ width: '600px', height: { xs: '300px', sm: '380px' } }}>
      <Line options={item.options} data={item?.chartData} />
    </Box>
  </Grid>
  <Grid item xs={12} md={5}>
    <Box sx={{ width: '600px', height: { xs: '300px', sm: '380px' } }}>
      <Line options={item.npsOptionData} data={item?.npsData} />
    </Box>
  </Grid>
</div>
</>
)}
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
         NPS:  {(scores.Yes.percentage-scores.No.percentage).toFixed(2)}
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
           
            score === "No"
              ? "red"
              : score === "Maybe"
              ? "yellow"
              : "green"
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ color: 'black', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
        >
          {/* {data.count>0 ?  data.count  :""} */}
     
          <span className={`font-medium ${!data.percentage && `pl-10`}`}>{data.percentage?data.percentage.toFixed(1) : 0}%</span>
        </Box>
      ))}
    </Box>
    </div>
    </div>
{totalCount==0 ? null :(
  <>
      <Grid item xs={12} md={0} className="block md:hidden">
  {!selectedChannel ||! selectedInstance ? null : (
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
  {!selectedChannel || !selectedInstance ? null : (
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
        </>
      )}
    </Box>
  );
};

export default App


