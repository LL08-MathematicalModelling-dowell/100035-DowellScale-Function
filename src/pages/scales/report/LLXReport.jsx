import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import Select  from "react-select"
import {
  
  MenuItem,
  CircularProgress,
  LinearProgress,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import axios, { all } from "axios";
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
import { isArray } from 'chart.js/helpers';
import { getUpdatedValues,pickSevenKeys,processData,filterDataWithinDays,transformData,deepClone, scorePercentagesfunc} from '../helperFunctions/jsFunctions';
import { deafultDatasets,defaultOptions,defaultLabels,defaultScorePercentages, defaultLearningDataIndex } from '../helperFunctions/jsObjects';
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
    Reading: { count: 0, percentage: 0 },
    Understanding: { count: 0, percentage: 0 },
    Explaining: { count: 0, percentage: 0 },
    Evaluating: { count: 0, percentage: 0 },
    Applying: { count: 0, percentage: 0 }
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
  const [selectedChannel, setSelectedChannel] = useState();
  const [selectedInstance, setSelectedInstance] = useState();
  const [scores, setScores] = useState(initialScoreData);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState([]);
  const [learningIndexDataForChart, setLearningIndexDataForChart] = useState({
    labels: [],
    datasets: [],
  });
  const [displayDataForAllSelection, setDisplayDataForAllSelection] = useState(
    []
  );
  const[dateIndexPair,setDateIndexPair]=useState({})
  const[err,setErr]=useState(false)
  const[msg,setMsg]=useState(false)
const[selectedDays,setSelectedDays]=useState(7)
const[learningDataForChart,setLearningDataForChart]=useState({
  labels: [],
  datasets: [],
})
const[learningOptionData,setLearningOptionData]=useState({})
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
    
  
    
    setScores(defaultScorePercentages)
  setLearningIndexDataForChart(defaultLearningDataIndex)
  setLearningOptionData(defaultOptions)
  setOptions(defaultOptions)
  setLearningDataForChart({
    labels: defaultLabels,
    datasets: [
      {
        label: " Learning Level Index (below 1 = Learning, above 1 = Innovating)",
        data: deafultDatasets,
        borderColor: "red",
        backgroundColor: "red",
      },]
  })
  setLearningStage("")
  setLearningLevelIndex(0)
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
  setLearningDataForChart({
    labels: [1,2,3,4,5],
    datasets: [
                  {
                    label: "Learning Level Index",
                    data:[0,0,0,0,0],
                    borderColor: "red",
                    backgroundColor: "red",
                  },
                 
                ],
  });
  if(arr.length==0){

    setMsg(true)
    return
  }
  
  setMsg(false)
  let scoreCounts={
    reading:0,
    understanding:0,
    explaining:0,
    evaluating:0,
    applying:0
  }
  arr.forEach((res)=>{
    scoreCounts[res.category]+=1
  })

  const totalResponses=arr.length

  let percentages={
    reading:((scoreCounts.reading/totalResponses)*100),
    understanding:((scoreCounts.understanding/totalResponses)*100),
    explaining:((scoreCounts.explaining/totalResponses)*100),
    evaluating:((scoreCounts.evaluating/totalResponses)*100),
    applying:((scoreCounts.applying/totalResponses)*100)
  }

  const scorePercentages = scorePercentagesfunc(scoreCounts,percentages)
  const processedData = processData(arr);

 const transData=transformData(processedData,selectedDays)
 const objectPair=pickSevenKeys(transData)
 const daysHelper=getUpdatedValues(processedData, selectedDays);
  
 
    const arrayToObject = (arr) => {
      return arr.reduce((obj, item) => {
          obj[item.date] = item.value;
          return obj;
      }, {});
  };
let selectedDaysCounts=arrayToObject(daysHelper),  selectedDaysPercentages={}
  for(let dateData of Object.keys(selectedDaysCounts)){
    let per=((selectedDaysCounts[dateData]/50)*100).toFixed(2)

    selectedDaysPercentages[dateData]=Number(per)>100 ? 100 :per
  }

   selectedDaysCounts=pickSevenKeys(selectedDaysCounts)
   selectedDaysPercentages=pickSevenKeys(selectedDaysPercentages)
  setLearningIndexData(arr[arr.length-1].learning_index_data)

  setTotalCount(totalResponses);
setDateIndexPair(objectPair)

  setScores(scorePercentages);
 
  let x=Object.values(objectPair)
  let llx=x[x.length-1]
  setLearningLevelIndex(llx);
  if(llx<1)
    setLearningStage(" Learning")
  else
  setLearningStage("Innovating")
  
  let labels,datasetsInfo,options, percentagesInfo, daysInfo, attendenceInfo, learningOptions
if(!objectPair || !arr || arr.length==0){
 labels=defaultLabels,
 datasetsInfo=deafultDatasets,
 options=defaultOptions
  
}else{
  const isSmallScreen = window.innerWidth < 600;
   labels=Object.keys(objectPair)
   datasetsInfo=Object.values(objectPair)
   attendenceInfo=[50,50,50,50,50,50,50,50]
   daysInfo=Object.values(selectedDaysCounts)
   percentagesInfo=Object.values(selectedDaysPercentages)
   const maxValue=Object.values(objectPair).reduce((val,ele)=>Number(val)>ele?val:ele,0)
    options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Day-wise Responses",
      },
      legend: {
        labels: {
          font: {
            size: 12, // Adjust the size as needed
          },
          boxWidth: 10, // Adjust the width of the colored box
          padding: 10, // Adjust the padding between legend items
        },
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
          stepSize: Math.ceil(100 / 5),
        },
        beginAtZero: true,
      },
    },
  };
  

}
setOptions(options)
  setLearningIndexDataForChart({
    labels: labels,
    datasets: [
      {
        label: "Attendance",
        data: attendenceInfo,
        borderColor: "yellow",
        backgroundColor: "yellow",
      },
     
      {
        label: "Response Percentage",
        data: percentagesInfo,
        borderColor: "green",
        backgroundColor: "green",
      },
      
      {
        label: "Total Responses",
        data: daysInfo,
        borderColor: "blue",
        backgroundColor: "blue",
      },
     
    ],
  });



const obj=deepClone(options)
obj.plugins.title.text="Day-wise LLx"

setLearningOptionData(obj)
setLearningDataForChart({
  labels: labels,
  datasets: [
    {
      label: " Learning Level Index (below 1 = Learning, above 1 = Innovating)",
      data: datasetsInfo,
      borderColor: "red",
      backgroundColor: "red",
    },]
})

},[selectedDays,selectedInstance,responseData])



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
    
        let dummyCount = {
          reading: 0,
          understanding: 0,
          explaining: 0,
          evaluating: 0,
          applying: 0
        };
        let dummyPercentages = {
          reading: 0,
          understanding: 0,
          explaining: 0,
          evaluating: 0,
          applying: 0
        };
    
        let scoreCounts, percentages, objectPair, totalResponses, learningLevelIndex, learningStage, selectedDaysCounts, selectedDaysPercentages = {};
        if (dataForInstanceAndChannel.length == 0 || !dataForInstanceAndChannel[dataForInstanceAndChannel.length - 1].learning_index_data || !dataForInstanceAndChannel[dataForInstanceAndChannel.length - 1].learning_index_data.learning_level_count) {
          scoreCounts = dummyCount;
          percentages = dummyPercentages;
        } else {
          const arr = filterDataWithinDays(dataForInstanceAndChannel, selectedDays);
    
          if (arr.length == 0) {
            setMsg(true);
            return;
          }
    
          setMsg(false);
          scoreCounts = {
            reading: 0,
            understanding: 0,
            explaining: 0,
            evaluating: 0,
            applying: 0
          };
          learningLevelIndex = arr[arr.length - 1].learning_index_data.learning_level_index.toFixed(2);
          learningStage = arr[arr.length - 1].learning_index_data.learning_stage;
          arr.forEach((res) => {
            scoreCounts[res.category] += 1;
          });
          totalResponses = arr.length;
    
          percentages = {
            reading: ((scoreCounts.reading / totalResponses) * 100),
            understanding: ((scoreCounts.understanding / totalResponses) * 100),
            explaining: ((scoreCounts.explaining / totalResponses) * 100),
            evaluating: ((scoreCounts.evaluating / totalResponses) * 100),
            applying: ((scoreCounts.applying / totalResponses) * 100)
          };
    
          const processedData = processData(arr);
    
          const daysHelper = getUpdatedValues(processedData, selectedDays);
    
          const arrayToObject = (arr) => {
            return arr.reduce((obj, item) => {
              obj[item.date] = item.value;
              return obj;
            }, {});
          };
          selectedDaysCounts = arrayToObject(daysHelper);
          for (let dateData of Object.keys(selectedDaysCounts)) {
            let per = ((selectedDaysCounts[dateData] / 50) * 100).toFixed(2);
            selectedDaysPercentages[dateData] = Number(per) > 100 ? 100 : per;
          }
          const transData = transformData(processedData, selectedDays);
    
          objectPair = pickSevenKeys(transData);
          selectedDaysCounts = pickSevenKeys(selectedDaysCounts);
          selectedDaysPercentages = pickSevenKeys(selectedDaysPercentages);
        }
    
        const scorePercentages =  scorePercentagesfunc(scoreCounts,percentages)
  
        let labels, datasetsInfo, options, daysInfo, percentagesInfo, attendenceInfo;
        if (!objectPair || dataForInstanceAndChannel.length == 0) {
         labels=defaultLabels,
         datasetsInfo=deafultDatasets,
         options=defaultOptions
        } else {
          const isSmallScreen = window.innerWidth < 600;
          labels = Object.keys(objectPair);
          attendenceInfo = [50, 50, 50, 50, 50, 50, 50, 50];
          datasetsInfo = Object.values(objectPair);
          daysInfo = Object.values(selectedDaysCounts);
          percentagesInfo = Object.values(selectedDaysPercentages);
          const maxValue = Object.values(objectPair).reduce((val, ele) => Number(val) > ele ? val : ele, 0);
          options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Day-wise Responses",
              },
              legend: {
                labels: {
                  font: {
                    size: 12, // Adjust the size as needed
                  },
                  boxWidth: 10, // Adjust the width of the colored box
                  padding: 10, // Adjust the padding between legend items
                },
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
                max: 100,
                ticks: {
                  stepSize: Math.ceil(100 / 5),
                },
                beginAtZero: true,
              },
            },
          };
        }
    const obj=deepClone(options)
    obj.plugins.title.text="Day-wise LLx"
        setLearningOptionData(obj);
        setOptions(options);
    
        return {
          instanceName: instance,
          channelName: channel,
          totalResponses: totalResponses,
          learningStage,
          learningLevelIndex,
          scoreCounts: scorePercentages,
          chartData: {
            labels: labels,
            datasets: [
              {
                label: "Attendance",
                data: attendenceInfo,
                borderColor: "yellow",
                backgroundColor: "yellow",
              },
              {
                label: "Response Percentage",
                data: percentagesInfo,
                borderColor: "green",
                backgroundColor: "green",
              },
              {
                label: "Total Responses",
                data: daysInfo,
                borderColor: "blue",
                backgroundColor: "blue",
              },
            ],
          },
          learningData: {
            labels: labels,
            datasets: [{
              label: "Learning Level Index (below 1 = Learning, above 1 = Innovating)",
              data: datasetsInfo,
              borderColor: "red",
              backgroundColor: "red",
            },]
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


const questionData=["Do you need more reading or explanation on the topic?",
  "Did you understand the topic well?",
  "Did you feel confident explaining the topic to your friends/classmates?",
  "Can you evaluate others explanation on the topic?",
  "Can you apply what you understood from the topic in real life or role plays?"]

  const smallText=["(Remembering Phase)","(Understanding Phase)","(Explanation Phase)","(Evaluation Phase)","(Creating Phase)"]

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
      DoWell Learning Level Index
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
                    style={{ marginTop: "32px", marginBottom: "10px" }}
                  >
                   <span className='flex justify-center items-center w-full gap-10'><span> {index + 1}. <span className='text-[18px] ml-3 font-medium'>{item.channelName.label}</span></span>  <span className='text-[16px]'>{item.instanceName.label} </span></span>
                  </Typography>
                  <div className="flex flex-col justify-center items-center gap-2 sm:gap-6 mt-5 mb-10 flex-wrap">
                    <div>
       
        </div>
        <div className="flex justify-center  items-center sm:gap-20 gap-8 w-full ">
        <p  className="font-bold text-[12px] sm:text-[16px]">
          Learning Index: {item.learningLevelIndex}
        </p>
        <p  className="font-bold text-[12px] sm:text-[16px]">
        Learning Stage: {item.learningStage}
        </p>
        </div>
      </div>
       <Grid item xs={12} md={0} className="block md:hidden">
            <>
            <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "420px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                 <Line options={learningOptionData} data={item?.learningData} />
              </Box>
              <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "420px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={options} data={item.chartData} />
              </Box>
            </>
         
        </Grid>
      <p 
     
      
        className="text-orange-600 font-bold text-[16px] ml-5 mt-5 mb-5 sm:mb-0"
      >
        Learning funnel:
  </p>
  <Grid
  container
  spacing={10}
  alignItems="center"
  justifyContent="center"
>
  {/* Left side with score counts */}

  <Grid item xs={12} xl={7}  sx={{
      mt: { xs: 0, md: 5 },
    }}
   

    >
    {Object.entries(item.scoreCounts).map(([score, data], index) => (
      <Box
        key={score}
        sx={{
          maxWidth: { xs: "100%", sm: "90%", md: "80%", xl: "100%" },
          mx: "10px",
           alignItems:"center",
           justifyContent:"center",
          textAlign: "center",
          mb: 4,
        }}
      >
       
     
       <div className="grid lg:flex lg:justify-between">
        <span className="text-[12px] flex items-start justify-start">{questionData[index]}</span>
        <div className="flex justify-center items-center">
        <span className="md:text-[14px] xl:text-[16px] font-medium">{smallText[index]}: </span>
        <span className="font-bold mx-2">{data.count}</span>
        <span className="font-medium">({(data.percentage ? data.percentage.toFixed(2) : 0)}%)</span>
        </div>
        </div>
        {/* {`${questionData[index]}: ${data.count} (${data.percentage.toFixed(2) || 0}%)`} */}
        <LinearProgress
          variant="determinate"
          className="mt-2"
          value={data.percentage || 0}
          sx={{
            height: "10px",
            
            borderRadius: "10px",
            "& .MuiLinearProgress-bar": {
              borderRadius: "10px",
              backgroundColor: (() => {
                if (score === "Reading") return "#FF0000"; // Red
                if (score === "Understanding") return "#FF7F00"; // Orange
                if (score === "Explaining") return "#FFFF00"; // Yellow
                if (score === "Evaluating") return "#7FFF00"; // Light Green
                return "#00FF00"; // Green
              })(),
            },
          }}
        />
      </Box>
    ))}
  </Grid>

  {/* Right side with chart data */}
  <Grid item md={6} xl={5} className="hidden xl:block">

          
              
              <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "420px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={learningOptionData} data={item?.learningData} />
              </Box>
           
  </Grid>
</Grid>

   
<Grid item md={5} className="hidden md:block xl:hidden">
  
              
              <Box
                sx={{
                  mt: 4,
                  width: "70%",
                  height: { xs: "300px", sm: "420px" },
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                <Line options={options} data={item?.learningData} />
              </Box>
           
  </Grid>
<Grid item xs={12} md={5} className="hidden md:block">
    <Box
      sx={{
         ml:"10px",
        width: "70%",
        height: { xs: "300px", sm: "420px" },
        maxWidth: "600px",
        mx: "auto",
      }}
    >
      <Line options={options} data={item?.chartData} />
    </Box>
  </Grid>

                </>
              );
            })
          )}
        </>
      ) : (
        <>
       
              <div className="flex flex-col justify-center items-center gap-2 sm:gap-6 mt-5 mb-10 flex-wrap">
                    <div>
       
        </div>
        <div className="flex justify-center  items-center sm:gap-20 gap-8 w-full ">
        <p  className="font-bold text-[10px] sm:text-[16px]">
          Learning Index: {learningLevelIndex}
        </p>
        <p  className="font-bold text-[10px] sm:text-[16px]">
        Learning Stage: {learningStage}
        </p>
        </div>
      </div>
  
      <Grid item xs={12} md={0} className="block md:hidden">
  {!selectedChannel || !selectedInstance ? null : (
            <>
              <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "420px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={learningOptionData} data={learningDataForChart} />
              </Box>

              <Box
                sx={{
                  mt: 4,
                  width: "100%",
                  height: { xs: "300px", sm: "420px" },
                  maxWidth: "900px",
                  mx: "auto",
                }}
              >
                <Line options={options} data={learningIndexDataForChart} />
              </Box>
              
            
            </>
          )}
  </Grid>
  <p 
     
      
     className="text-orange-600 font-bold text-[16px] ml-5 mt-5 mb-5 sm:mb-0"
   >
     Learning funnel:
</p>
  <Grid
  container
  spacing={10}
  alignItems="center"
  justifyContent="center"
>
  {/* Left side with score counts */}

  <Grid item xs={12} xl={!selectedChannel || !selectedInstance ? 10 : 7}  sx={{
      mt: { xs: 0, md: 5 },
    }}
   

    >
    {Object.entries(scores).map(([score, data], index) => (
      <Box
        key={score}
        sx={{
          maxWidth: { xs: "100%", sm: "90%", md: "80%", xl: "100%" },
          mx: "10px",
           alignItems:"center",
           justifyContent:"center",
          textAlign: "center",
          mb: 4,
        }}
      >
       
     
        <div className="grid lg:flex lg:justify-between">
        <span className="text-[12px] flex items-start justify-start">{questionData[index]}</span>
        <div className="flex justify-center items-center">
        <span className="md:text-[14px] xl:text-[16px] font-medium">{smallText[index]}: </span>
        <span className="font-bold mx-2">{data.count}</span>
        <span className="font-medium">({(data.percentage ? data.percentage.toFixed(2) : 0)}%)</span>
        </div>
        </div>
        <LinearProgress
          variant="determinate"
          value={data.percentage || 0}
          className="mt-2"
          sx={{
            height: "10px",
            
            borderRadius: "10px",
            "& .MuiLinearProgress-bar": {
              borderRadius: "10px",
              backgroundColor: (() => {
                if (score === "Reading") return "#FF0000"; // Red
                if (score === "Understanding") return "#FF7F00"; // Orange
                if (score === "Explaining") return "#FFFF00"; // Yellow
                if (score === "Evaluating") return "#7FFF00"; // Light Green
                return "#00FF00"; // Green
              })(),
            },
          }}
        />
      </Box>
    ))}
  </Grid>

  {/* Right side with chart data */}
  {!selectedInstance ?(
      <Grid item md={6} xl={5} className="hidden xl:block">
 
      <>
 
      </>
   
</Grid>
  ):(
    <Grid item md={6} xl={5} className="hidden xl:block">
 
    <>
      
      <Box
        sx={{
          mt: 4,
          width: "100%",
          height: { xs: "300px", sm: "420px" },
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        <Line options={learningOptionData} data={learningDataForChart} />
      </Box>
    </>
 
</Grid>
  )}

</Grid>
<Grid item md={5} className="hidden md:block xl:hidden">
  {!selectedChannel || !selectedInstance ? null : (
            <>
              
              <Box
                sx={{
                  mt: 4,
                  width: "70%",
                  height: { xs: "300px", sm: "420px" },
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                <Line options={learningOptionData} data={learningDataForChart} />
              </Box>
            </>
          )}
  </Grid>
  {selectedInstance && (
    <Box className="hidden md:block"
                sx={{
                  mt: 4,
                  width: "70%",
                  height: { xs: "300px", sm: "420px" },
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                <Line options={options} data={learningIndexDataForChart} />
              </Box>
  )}

        </>
      )}
    </Box>
  );
};

export default App