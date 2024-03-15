import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import './report.css';
import { setLocale } from "yup";

const GenerateReport = () =>{
    const [data,setData] = useState()
    const {slug} = useParams()
    const [loading , setLoading] = useState(true)
    const [error,setError] = useState(false)
    useEffect(()=>{
const fetchReport =async () =>{
    try 
    {
        setLoading(true)
        const response = await axios({
            method:"get",
            baseURL:"https://100035.pythonanywhere.com",
            url:`/report/scale_id/${slug}`

        })
        if(response.data.is_error)
        setError(true)
        else
        {setData(response.data.report)
        console.log(response.data.report)
        }
    }
    catch(err)
    {
        setError(true)
        console.log(err)
    }
    setLoading(false)

}
if(!data)
fetchReport()
    }
    
    ,[data])

    return(
        <div className="report-container">
        {loading ? 
        <>
        <h1>loading...</h1>
        </>
          : error ? <><h1>No Data Found</h1></>:
            <>
            <h1>Report</h1>
        
        <div className="section">
          {/* <h2>Scale Information</h2> */}
          <p>Scale Type: {data?.scale_type}</p>
          <p>No. of Scales: {data?.no_of_scales}</p>
        </div>
        <div className="section">
          <h2>Aggregated Scores</h2>
          <ul>
            {data?.aggregated_score_list?.map((score, index) => (
              <li key={index}>Score {index + 1}: {score}</li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h2>Percentile</h2>
          <p>25th Percentile: {data?.percentile["25"]}</p>
          <p>50th Percentile: {data?.percentile["50"]}</p>
          <p>75th Percentile: {data?.percentile["75"]}</p>
        </div>
        
        <div className="section">
          <h2>Statistics</h2>
          <h3>Normality Check</h3>
          <p>Title: {data?.statistics.normality_check.title}</p>
          <p>Process ID: {data?.statistics.normality_check.process_id}</p>
          <p>Bins: {data?.statistics.normality_check.bins}</p>
          <p>Allowed Error: {data?.statistics.normality_check.allowed_error}</p>
          <p>Series Count: {data?.statistics.normality_check.series_count}</p>
          <p>Normality: {data?.statistics.normality_check.list1.normality}</p>
          <p>AUC Z Scores: {data?.statistics.normality_check.list1.aauc_z_scores} </p>
          <p>Actual Areas: {data?.statistics.normality_check.list1.actual_areas}</p>
          <p>Rectangle Area: {data?.statistics.normality_check.list1.rectangle_area}</p>
          <p>Kurt: {data?.statistics.normality_check.list1.Kurt}</p>
          <p>Ind Dev: {data?.statistics.normality_check.list1.ind_dev}</p>
          <p>Slope: {data?.statistics.normality_check.list1.slope.map(m=>m)}</p>
          <p>Slope Percentage Deviation: {data?.statistics.normality_check.list1.slope_percentage_deviation}</p>
          <p>Calculated Slope: {data?.statistics.normality_check.list1.calculated_slope}</p>
          <p>Mean is within deviation(Median): {data?.statistics.normality_check.list1.evidence_counter["Mean equals to Median"]["Mean is within deviation"]}</p>
          <p>Median is within deviation: {data?.statistics.normality_check.list1.evidence_counter["Mean equals to Median"]["Median is within deviation"]}</p>
          <p>Mean is within deviation(Mode): {data?.statistics.normality_check.list1.evidence_counter["Mean equals to Mode"]["Mean is within deviation"]}</p>
          <p>Mode is within deviation: {data?.statistics.normality_check.list1.evidence_counter["Mean equals to Mode"]["Mode is within deviation"]}</p>
          <p>Mode equals to Median: {data?.statistics.normality_check.list1.evidence_counter["Mode equals to Median"]}</p>
          <p>Standard Deviation is within deviation: {data?.statistics.normality_check.list1.evidence_counter["Skewness is equal to 0"]["Standard deviation is within deviation"]}</p>    
          <p>Kurtosis Curve: {data?.statistics.normality_check.list1.evidence_counter["Kurtosis curve"]}</p>
          <p>Points in Range1: {data?.statistics.normality_check.list1.evidence_counter["Points in Range1"]}</p>
          <p>Points in Range2: {data?.statistics.normality_check.list1.evidence_counter["Points in Range2"]}</p>
          <p>Points in Range3: {data?.statistics.normality_check.list1.evidence_counter["Points in Range3"]}</p>
          <p>Satifies sigmoid function whose mirror image will give bell shaped curve: {data?.statistics.normality_check.list1.evidence_counter["Satifies sigmoid function whose mirror image will give bell shaped curve"]}</p>
          <p>Rotational Symmetric: {data?.statistics.normality_check.list1.evidence_counter["Rotational Symmetric"]}</p>
          </div>
          <div className="section">
          <h2>Poisson Case Results</h2>
          <p>Poisson Case Results: {data?.statistics["poisson_case_results"].series["list1"].map(m=><>{m},</>)}</p>
          <p>Minimum Series: {data?.statistics["poisson_case_results"].minimumSeries}</p>
          <p>Maximum Series: {data?.statistics["poisson_case_results"].maximumSeries}</p>
          <p>Minimum Series Data Point(list 1): {data?.statistics["poisson_case_results"].minimumSeriesDatapoint["list1"]}</p>
          <p>Minimum Continous Data Point(list 1): {data?.statistics["poisson_case_results"].minimumContinouseDatapoint}</p>
          <p>Mean: {data?.statistics["poisson_case_results"].mean["list1"]}</p>
          <p>Median: {data?.statistics["poisson_case_results"].median.list1}</p>
          <p>Mode: {data?.statistics["poisson_case_results"].mode.list1.map(m=><>{m},</>)}</p>
          <p>Median: {data?.statistics["poisson_case_results"].standardDeviation.list1}</p>
          <p>Moment 1: {data?.statistics["poisson_case_results"].moment1.list1}</p>
          <p>Moment 2: {data?.statistics["poisson_case_results"].moment2.list1}</p>
          <p>Moment 3: {data?.statistics["poisson_case_results"].moment3.list1}</p>
          <p>Moment 4: {data?.statistics["poisson_case_results"].moment4.list1}</p>
          <p>Normal Disribution: {data?.statistics["poisson_case_results"].normalDistribution.list1}</p>
          <p>Skewness: {data?.statistics["poisson_case_results"].skewness.list1}</p>
          <p>Kurtosis: {data?.statistics["poisson_case_results"].kurtosis.list1}</p>
          <p>Range1: {data?.statistics["poisson_case_results"]["list-wise ranges"]["Range 1"]["range lists"][0].map(m=><>{m},</>)}</p>
          <p>Range1 Length: {data?.statistics["poisson_case_results"]["list-wise ranges"]["Range 1"].lengths}</p>
          <p>Range1 Total Length: {data?.statistics["poisson_case_results"]["list-wise ranges"]["Range 1"].total_length}</p>
          <p>Range2: {data?.statistics["poisson_case_results"]["list-wise ranges"]["Range 2"]["range lists"][0].map(m=><>{m},</>)}</p>
          <p>Range2 Length: {data?.statistics["poisson_case_results"]["list-wise ranges"]["Range 2"].lengths}</p>
          <p>Range3 Total Length: {data?.statistics["poisson_case_results"]["list-wise ranges"]["Range 2"].total_length}</p>
          <p>Count Val: {data?.statistics["poisson_case_results"].count_val}</p>
        </div>
        <div className="section">
        <h2>Normal Case Results</h2>
        <p>Merged Series: {data?.statistics["normal_case_results"].mergedSeries.map(m=><>{m},</>)}</p>
        <p>Series Length: {data?.statistics["normal_case_results"].seriesLength}</p>
        <p>Max Merged Series: {data?.statistics["normal_case_results"].maxMergedSeries}</p>
        <p>Min Merged Series: {data?.statistics["normal_case_results"].minMergedSeries}</p>
        <p>Merged Mean: {data?.statistics["normal_case_results"].mergedMean}</p>
        <p>Merged Median: {data?.statistics["normal_case_results"].mergedMedian}</p>
        <p>Merged Mode: {data?.statistics["normal_case_results"].mergedMode.map(m=><>{m},</>)}</p>
        <p>Range List (Range1): {data?.statistics["normal_case_results"].mergedRanges.Range1["range lists"][0].map(m=><>{m},</>)}</p>
        <p>Range1 Length: {data?.statistics["normal_case_results"].mergedRanges.Range1.lengths}</p>
        <p>Range1 Total Length: {data?.statistics["normal_case_results"].mergedRanges.Range1.total_length}</p>
        <p>Range List (Range2): {data?.statistics["normal_case_results"].mergedRanges.Range2["range lists"][0].map(m=><>{m},</>)}</p>
        <p>Range2 Length: {data?.statistics["normal_case_results"].mergedRanges.Range2.lengths}</p>
        <p>Range2 Total Length: {data?.statistics["normal_case_results"].mergedRanges.Range2.total_length}</p>
        <p>Range List (Range3): {data?.statistics["normal_case_results"].mergedRanges.Range3["range lists"][0].map(m=><>{m},</>)}</p>
        <p>Range3 Length: {data?.statistics["normal_case_results"].mergedRanges.Range3.lengths}</p>
        <p>Range3 Total Length: {data?.statistics["normal_case_results"].mergedRanges.Range3.total_length}</p>
        <p>Merged VAraince: {data?.statistics["normal_case_results"].mergedVariance}</p>
        <p>Merged Moment1: {data?.statistics["normal_case_results"].mergedMoment1}</p>
        <p>Merged Moment2: {data?.statistics["normal_case_results"].mergedMoment2}</p>
        <p>Merged Momen3: {data?.statistics["normal_case_results"].mergedMoment3}</p>
        <p>Merged Moment4: {data?.statistics["normal_case_results"].mergedMoment4}</p>
        <p>Merged Skewness: {data?.statistics["normal_case_results"].mergedSkewness}</p>
        <p>Merged Kurtosis: {data?.statistics["normal_case_results"].mergedKurtosis}</p>
        
        </div>
      </>
      }
      </div>
    )
}

export default GenerateReport