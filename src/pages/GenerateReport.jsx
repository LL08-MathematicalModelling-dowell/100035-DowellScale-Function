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
        
      </>
      }
      </div>
    )
}

export default GenerateReport