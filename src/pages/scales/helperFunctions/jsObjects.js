const defaultScorePercentages = {
    Reading: {
      count: 0,
      percentage: 0,
    },
    Understanding: {
      count: 0,
      percentage: 0,
    },
    Explaining: {
      count:0,
      percentage:0,
    },
    Evaluating: {
      count:0,
      percentage:0,
    },
    Applying: {
      count:0,
      percentage:0,
    },
  };
  const defaultScorePercentagesNPS = {
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

  const defaultLabels = [0, 0, 0, 0, 0];
  const deafultDatasets = [0, 0, 0, 0, 0];
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


  const defaultLearningDataIndex={
    labels: defaultLabels,
    datasets: [
      {
        label: "Attendance",
        data: deafultDatasets,
        borderColor: "yellow",
        backgroundColor: "yellow",
      },
     
      {
        label: "Response Percentage",
        data: deafultDatasets,
        borderColor: "green",
        backgroundColor: "green",
      },
      
      {
        label: "Total Responses",
        data: deafultDatasets,
        borderColor: "blue",
        backgroundColor: "blue",
      },
     
    ],
  }

 
  const defaultNPSDataIndex= {
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
  }
  export {defaultScorePercentages,deafultDatasets,defaultOptions,defaultLabels,defaultLearningDataIndex,defaultNPSDataIndex,defaultScorePercentagesNPS}