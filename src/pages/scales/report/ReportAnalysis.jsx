import React, { useState, useEffect } from "react";
import {
  Select,
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
  scales,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import StackBarData from "./StackBarData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const instanceNames = {
  instance_1: "Attendance",
  instance_2: "Re-Explaination",
  instance_3: "Understood",
  instance_4: "Explaination",
  instance_5: "Application in life",
};

const allChannelsNameTag = "channel_all_x";

const channelNames = {
  [`${allChannelsNameTag}`]: "All Channels",
  channel_1: "Class Asessment",
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Responses Insights by Day",
    }
  },
};


const optionsStack = {
  responsive: true,
  maintainAspectRatio: false,
  barThickness: 40,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Responses Insights by Instance",
    }
  },
  scales: {
    x:{
      stacked: true,
    },
    y:{
      stacked: true
    }
  }
};
const extractLabelsAndDatasetsInfo = (data = []) => {
  const labelsForCharts = [
    ...new Set(
      data
        .map(
          (item) =>
            item?.dowell_time?.current_time &&
            new Date(item?.dowell_time?.current_time).toDateString()
        )
    ),
  ];

  const datasetsForCharts = {
    yesData: [],
    noData: [],
    maybeData: [],
  };


  labelsForCharts.forEach((item) => {
    const matchingData = data.filter(
      (dataItem) =>
        dataItem?.dowell_time?.current_time &&
        new Date(dataItem?.dowell_time?.current_time).toDateString() === item
    );

    datasetsForCharts.noData.push(
      matchingData.filter((data) => data?.score === 0).length
    );
    datasetsForCharts.maybeData.push(
      matchingData.filter((data) => data?.score === 1).length
    );
    datasetsForCharts.yesData.push(
      matchingData.filter((data) => data?.score === 2).length
    );
  });

  const totalItems =
    datasetsForCharts.yesData.reduce((a, b) => a + b, 0) +
    datasetsForCharts.noData.reduce((a, b) => a + b, 0) +
    datasetsForCharts.maybeData.reduce((a, b) => a + b, 0);

  return {
    labels: labelsForCharts,
    datasetsInfo: datasetsForCharts,
    totalItems,
  };
};

const initialScoreData = {
  No: { count: 0, percentage: 0 },
  Maybe: { count: 0, percentage: 0 },
  Yes: { count: 0, percentage: 0 },
};

const ReportAnalysis = () => {
  const [channels, setChannels] = useState([]);
  const [instances, setInstances] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedInstance, setSelectedInstance] = useState("");
  const [scores, setScores] = useState(initialScoreData);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dateDataForChart, setDateDataForChart] = useState({
    labels: [],
    datasets: [],
  });
  const [displayDataForAllSelection, setDisplayDataForAllSelection] = useState(
    []
  );
  const [stackBarData, setStackBarData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedChannel.length < 1 || selectedInstance.length < 1) return;

    const { labels, datasetsInfo, totalItems } = extractLabelsAndDatasetsInfo(
      data.filter(
        (item) =>
          item.channel_name === selectedChannel &&
          item.instance_name.trim() === selectedInstance
      )
    );

    setStackBarData({
      labels: labels,
      datasets: [
        {
          label: "No",
          data: datasetsInfo.noData,
          borderColor: "red",
          backgroundColor: "red",
        },
        {
          label: "Yes",
          data: datasetsInfo.yesData,
          borderColor: "green",
          backgroundColor: "green",
        },
        {
          label: "Maybe",
          data: datasetsInfo.maybeData,
          borderColor: "yellow",
          backgroundColor: "yellow",
        },
      ],
    }
    )

    setDateDataForChart({
      labels: labels,
      datasets: [
        {
          label: "No",
          data: datasetsInfo.noData,
          borderColor: "red",
          backgroundColor: "red",
        },
        {
          label: "Yes",
          data: datasetsInfo.yesData,
          borderColor: "green",
          backgroundColor: "green",
        },
        {
          label: "Maybe",
          data: datasetsInfo.maybeData,
          borderColor: "yellow",
          backgroundColor: "yellow",
        },
      ],
    });
  }, [selectedChannel, selectedInstance, data]);

  useEffect(() => {
    if (selectedChannel !== allChannelsNameTag)
      return setDisplayDataForAllSelection([]);

    const allData = instances.map((instance) => {
      const dataForInstance = data.filter(
        (item) => item.instance_name.trim() === instance
      );
      const scoreCounts = {
        No: {
          count: 0,
          percentage: 0,
        },
        Maybe: {
          count: 0,
          percentage: 0,
        },
        Yes: {
          count: 0,
          percentage: 0,
        },
      };

      const { labels, datasetsInfo, totalItems } = extractLabelsAndDatasetsInfo(
        dataForInstance
      );

      scoreCounts.No.count = datasetsInfo.noData.length;
      scoreCounts.No.percentage =
        (datasetsInfo.noData.reduce((a, b) => a + b, 0) / totalItems) * 100;

      scoreCounts.Maybe.count = datasetsInfo.maybeData.length;
      scoreCounts.Maybe.percentage =
        (datasetsInfo.maybeData.reduce((a, b) => a + b, 0) / totalItems) * 100;

      scoreCounts.Yes.count = datasetsInfo.yesData.length;
      scoreCounts.Yes.percentage =
        (datasetsInfo.yesData.reduce((a, b) => a + b, 0) / totalItems) * 100;

      return {
        instanceName: instance,
        totalResponses: dataForInstance.length,
        scoreCounts,
        chartData: {
          labels: labels,
          datasets: [
            {
              label: "No",
              data: datasetsInfo.noData,
              borderColor: "red",
              backgroundColor: "red",
            },
            {
              label: "Yes",
              data: datasetsInfo.yesData,
              borderColor: "green",
              backgroundColor: "green",
            },
            {
              label: "Maybe",
              data: datasetsInfo.maybeData,
              borderColor: "yellow",
              backgroundColor: "yellow",
            },
          ],
        },
      };
    });

    setDisplayDataForAllSelection(allData);
    StackBarData.length = 0
    let labels = []
    let dataSets = [{label: 'No', data:[], backgroundColor:'red'}, {label: 'Maybe', data:[], backgroundColor:'yellow'}, {label: 'yes', data:[],backgroundColor:'green'}]
    allData.map((item, index)=>{
        labels.push([instanceNames[`${item.instanceName}`]])
        console.log(item.scoreCounts.No.percentage, "GGGGGGGG")
        item.chartData.datasets.map((name, index)=>{
          console.log(name.label, "BBBBB")
          if(name.label === 'No'){
            dataSets[0].data.push(item.scoreCounts.No.percentage)
          }else if(name.label === 'Yes'){
            dataSets[2].data.push(item.scoreCounts.Yes.percentage)
          }else if(name.label === 'Maybe'){
            dataSets[1].data.push(item.scoreCounts.Maybe.percentage)
          }
        })
        console.log(item.chartData.datasets, "EEEEEEEE")
        // StackBarData.push({datasets: item.chartData.datasets, labels: [`${item.instanceName}`]
        // })
      })
      StackBarData.push({labels:labels, datasets: dataSets})
  }, [selectedChannel, data, instances]);

  console.log(StackBarData, "TTTTTTTTTTTTTTTT")
  console.log(displayDataForAllSelection, "YYYYYYYYYYYYYYYYYYYYYY")

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://100035.pythonanywhere.com/addons/get-response/?scale_id=66556a7ff11edcfcfb8b0d54"
      );
      const data = response.data.data;
console.log(data)
      const uniqueChannels = Array.from(
        new Set(data.map((item) => item.channel_name))
      );
      const uniqueInstances = Array.from(
        new Set(data.map((item) => item.instance_name.trim()))
      );

      setChannels([allChannelsNameTag, ...uniqueChannels]);
      setInstances(uniqueInstances);
      setData(data);
      setLoading(false);
    
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false even in case of error
    }
  };

  const handleChannelSelect = (event) => {
    setSelectedChannel(event.target.value);

    if (event.target.value === allChannelsNameTag) {
      setSelectedInstance("");
      setScores(initialScoreData);
      setTotalCount(0);
    }
  };

  const handleInstanceSelect = (event) => {
    setSelectedInstance(event.target.value);

    // Filter data based on the selected instance and channel
    const filteredData = data.filter(
      (item) =>
        item.instance_name.trim() === event.target.value &&
        item.channel_name === selectedChannel
    );
 
    // Count occurrences of each score
    const scoreCounts = { No: 0, Maybe: 0, Yes: 0 };
    filteredData.forEach((item) => {
      switch (item.score) {
        case 0:
          scoreCounts["No"]++;
          break;
        case 1:
          scoreCounts["Maybe"]++;
          break;
        case 2:
          scoreCounts["Yes"]++;
          break;
        default:
          break;
      }
    });

    // Calculate total count
    const totalCount = filteredData.length;

    // Calculate percentage for each score
    const scorePercentages = {
      No: {
        count: scoreCounts["No"],
        percentage: (scoreCounts["No"] / totalCount) * 100,
      },
      Maybe: {
        count: scoreCounts["Maybe"],
        percentage: (scoreCounts["Maybe"] / totalCount) * 100,
      },
      Yes: {
        count: scoreCounts["Yes"],
        percentage: (scoreCounts["Yes"] / totalCount) * 100,
      },
    };

    setScores(scorePercentages);
    setTotalCount(totalCount);
  };
console.log(scores)
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box p={3} className='ml-[10%] lg:ml-[20%] w-full'>
      <Typography variant="h4" align="center" gutterBottom>
        Feedback Analysis Dashboard
      </Typography>
      <Grid container spacing={3} alignItems="center" justifyContent="center" styl>
        <Grid item xs={12} md={6}>
          <Select
            value={selectedChannel}
            onChange={handleChannelSelect}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Channel
            </MenuItem>
            {channels.map((channel) => (
              <MenuItem key={channel} value={channel} >
                {channelNames[channel]}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Select
            value={selectedInstance}
            onChange={handleInstanceSelect}
            displayEmpty
            fullWidth
            disabled={selectedChannel === allChannelsNameTag}
          >
            <MenuItem value="" disabled>
              Select Instance
            </MenuItem>
            {instances.map((instance) => (
              <MenuItem key={instance} value={instance}>
                {instanceNames[instance]}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      {selectedChannel === allChannelsNameTag ? (
        <>
        <>
                    {/* <Box
                      sx={{
                        mt: 4,
                        width: "100%",
                        height: { xs: "300px", sm: "400px" },
                        maxWidth: "900px",
                        mx: "auto",
                      }}
                    >
                      {StackBarData.length !== 0 && <Bar
                       data={StackBarData[0]}
                       options={optionsStack}
                    />}
                    </Box> */}
                  </>
          {React.Children.toArray(
            displayDataForAllSelection.map((item, index) => {
              return (
                <>
                  <Typography
                    variant="h6"
                    align="left"
                    style={{ marginTop: "32px", marginBottom: "10px" }}
                  >
                    {index + 1}. {instanceNames[item?.instanceName.trim()]}
                  </Typography>

                  <Typography
                    variant="body1"
                    align="center"
                    gutterBottom
                    style={{ marginTop: "16px", }}
                  >
                    Total Responses: {item?.totalResponses}
                  </Typography>
                  <Typography variant="body1" align="center" gutterBottom>
                    Scores:
                  </Typography>
                  <Grid
                    container
                    spacing={3}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {Object.entries(item?.scoreCounts).map(
                      ([score, data]) => (
                        <Grid item xs={12} sm={4} key={score}>
                          <Box textAlign="center">
                            <Typography
                              variant="subtitle1"
                              gutterBottom
                            >
                              {`${score}: ${data.count} (${data.percentage.toFixed(
                                2
                              ) || 0}%)`}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={data.percentage}
                              sx={{
                                height: "10px",
                                borderRadius: "10px",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: "10px",
                                  backgroundColor:
                                    score === "No"
                                      ? "red"
                                      : score === "Maybe"
                                      ? "yellow"
                                      : "green",
                                },
                              }}
                            />
                          </Box>
                        </Grid>
                      )
                    )}
                  </Grid>
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
                      <Line options={options} data={item?.chartData} />
                    </Box>
                  </>
                </>
              );
            })
          )}
        </>
      ) : (
        <>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            style={{ marginTop: "16px" }}
          >
            Total Responses: {totalCount}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Scores:
          </Typography>
          <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="center"
          >
            {Object.entries(scores).map(([score, data]) => (
              <Grid item xs={12} sm={4} key={score}>
                <Box textAlign="center">
                  <Typography variant="subtitle1" gutterBottom>
                    {`${score}: ${data.count} (${data.percentage.toFixed(
                      2
                    )}%)`}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={data.percentage || 0}
                    sx={{
                      height: "10px",
                      borderRadius: "10px",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: "10px",
                        backgroundColor:
                          score === "No"
                            ? "red"
                            : score === "Maybe"
                            ? "yellow"
                            : "green",
                      },
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
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
                <Line options={options} data={dateDataForChart} />
              </Box>
            </>
          )}
          
        </>
      )}
    </Box>
  );
};

export default ReportAnalysis;
