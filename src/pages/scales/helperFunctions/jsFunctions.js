function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());
    const dates = [];
  
    while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
  
    return dates;
  }
  
  function getUpdatedValues(obj, selectedDays) {
    // Get today's date
    const today = new Date();
    
    // Calculate the start date based on selectedDays
    const startDate = new Date();
    startDate.setDate(today.getDate() - selectedDays);
    
    // Generate all dates in the range from startDate to today
    const allDates = getDatesInRange(startDate, today);
    
  
    const updatedArr = [];
    let previousValue = 0;
    
    for (const date of allDates) {
        const formattedDate = formatDate(date);; // Format date as 'YYYY-MM-DD'
        const value = obj[formattedDate] ? obj[formattedDate].totalCount : previousValue;
  
        updatedArr.push({ date: formattedDate, value });
  
        // Update previous value only if the current value is not zero
        if (value !== 0) {
            previousValue = value;
        }
    }
    
    return updatedArr;
}

function processData(responseData) {
    const dataByDate = {};
    let previousDateData = null;
  
    responseData.forEach((response) => {
      const dateCreated = formatDate(response.date_created);
      const category = response.category;
      let count = -1;
  
      if (category === "reading" || category === "understanding") {
        count = 1;
      } else if (category !== "explaining") {
        count = 0;
      }
  
      if (!dataByDate[dateCreated]) {
        dataByDate[dateCreated] = { totalCount: 0, readingUnderstandingCount: 0, evaluationCount: 0, percentage: 0 };
      }
  
      if (count === 1) {
        dataByDate[dateCreated].readingUnderstandingCount++;
      } else if(count==0) {
        dataByDate[dateCreated].evaluationCount++;
      }
  
      dataByDate[dateCreated].totalCount++;
    });
  
    // Calculate cumulative counts and percentages
    Object.keys(dataByDate).forEach((date) => {
      const obj = dataByDate[date];
      if (previousDateData !== null) {
        obj.readingUnderstandingCount += previousDateData.readingUnderstandingCount;
        obj.evaluationCount += previousDateData.evaluationCount;
        obj.totalCount += previousDateData.totalCount;
      }
  
      // Calculate percentage
      const x = obj.readingUnderstandingCount / obj.totalCount * 100;
      if (x === 0) {
        obj.percentage = obj.evaluationCount / obj.totalCount * 100;
      } else {
  
        obj.percentage = obj.evaluationCount / obj.totalCount * 100 / x;
      }
  
      // Update previousDateData for next iteration
      previousDateData = obj;
  
    });
  
    return dataByDate;
  }

  function processDataNPS(responseData) {
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
        const { percentage } = originalData[dateKey];
      
       transformedData[dateKey]=percentage.toFixed(2)
      } else {
        transformedData[dateKey] = transformedData[formatDate(new Date(currentDate.getTime() - 86400000))] || 0; // Get the value of the previous day or 0 if it doesn't exist
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




function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
      return obj;
  }

  if (Array.isArray(obj)) {
      return obj.map(deepClone);
  }

  const clone = { ...obj };
  Object.keys(clone).forEach(key => {
      clone[key] = deepClone(clone[key]);
  });

  return clone;
}


function scorePercentagesfunc(scoreCounts,percentages){
   return {
        Reading: {
          count: scoreCounts["reading"],
          percentage: percentages["reading"],
        },
        Understanding: {
          count: scoreCounts["understanding"],
          percentage: percentages["understanding"],
        },
        Explaining: {
          count: scoreCounts["explaining"],
          percentage: percentages["explaining"],
        },
        Evaluating: {
          count: scoreCounts["evaluating"],
          percentage: percentages["evaluating"],
        },
        Applying: {
          count: scoreCounts["applying"],
          percentage: percentages["applying"],
        },
      };
}

function scorePercentagesfuncNPS(scoreCounts,percentages){
  return {
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
}

export {getUpdatedValues,processData,pickSevenKeys,transformData,filterDataWithinDays,deepClone,scorePercentagesfunc,scorePercentagesfuncNPS,processDataNPS}