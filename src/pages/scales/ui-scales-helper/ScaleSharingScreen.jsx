
import reactCode from "../../../utils/reactCode";
import { PiGlobeHemisphereWestFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { HiMiniCube } from "react-icons/hi2";
import {useState} from "react"
import emailCode from "../../../utils/emailCode";
import ProductScreen from "./ProductScreen";
import ScaleOutputScreen from "./ScaleOutputScreen";
import { IoLink } from "react-icons/io5";
import { IoMdShare } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { PiFileCsvDuotone } from "react-icons/pi";

import {CSVLink} from "react-csv"
export default function ScaleSharingScreen({setFinished,buttonLinks,text,formData}){
    let ratings;
    if (text.includes("LITE")) {
        ratings=["Bad","Average", "Excellent"]
    } else if (text.includes("STAPEL")) {
        ratings=[-5,-4,-3,-2,-1,1,2,3,4,5]
    } else if (text.includes("LIKERT")) {
        ratings=formData.pointersText
    } else {
        ratings=[0,1,2,3,4,5,6,7,8,9,10]
    }
   
    const[showOptions,setShowOptions]=useState({})
    const[isCopied,setIsCopied]=useState(false)
    const[showCopyIcon,setShowCopyIcon]=useState(-1)
    const [csvArray,setCsvArray] = useState([]);
 
    const[showData,setShowData]=useState("raw")
    const[picked,setPicked]=useState("")
   
    let websiteCodeToCopy
    if(text.includes("LIKERT"))
     websiteCodeToCopy=reactCode(buttonLinks,formData.pointersText,formData)
    else
    websiteCodeToCopy=reactCode(buttonLinks,ratings,formData)
    const emailCodeToCopy=emailCode(buttonLinks,ratings,formData)

     function clicked(channelId,instanceId){
        let arr=[]
       let linkData=buttonLinks[channelId].urls[instanceId]
   
       linkData.instance_urls.forEach((link, index) => {  
    
        const obj = {
            rating: ratings[index],
            buttonLink: link
        };
        arr.push(obj);
    });
    setCsvArray(arr)
     }
   

    const headers=[
      {
        label:"Data", key:"rating"
      },
      {
        label:"Link", key:"buttonLink"
      }
      
    ]

    const csvLink={
      filename:"buttonLinks.csv",
      headers,
      data:csvArray
    }

    const copyToClipboard = (data) => {
       
        navigator.clipboard.writeText(data)
            .then(() => {
                if(data[0]!="h" && data.length!=3){
                setIsCopied(true)
                setTimeout(()=>{
                     setIsCopied(false)                  
                },1000)
            }
            })
            .catch((error) => console.error('Error copying to clipboard: ', error));
    };


    return(
        <>
        <div className="flex flex-col justify-start items-start w-[90%]  sm:m-1 sm:w-[90%]  xl:w-[95%]">
           <p className="text-[12px] md:text-[14px] text-center">{text}</p>
                    <div className="flex justify-center items-center gap-[1px] mt-5 w-max text-black font-medium text-[12px] md:text-[16px]">
                        
                        <button className={`${showData=="raw"? "bg-white" :"bg-[#e8e8e8]" } border border-black flex justify-center items-center gap-2 px-2 p-2 lg:px-8 rounded `}
                        onClick={()=>{setShowData("raw")}}><span ><IoLink/></span> Raw</button>
                        <button  className={`${showData=="platforms"? "bg-white" :"bg-[#e8e8e8]" } border border-black flex justify-center items-center gap-2 px-2 p-2 lg:px-8 rounded `}
                        onClick={()=>{setShowData("platforms")}}><span><IoMdShare/></span> Platforms</button>
                    </div>
                    </div>
                    {showData=="raw"?(
                    <div className="w-full bg-[#fbfbfb] p-2 mt-5 flex flex-col  gap-4">
                       {buttonLinks.map((channel,index)=>(
                         <div className="flex flex-col justify-center items-center font-medium ">
                         <p className="text-[14px] sm:text-[16px] text-center">Channel Name : {channel.channel_display_name}</p>
                         <div className=" flex flex-col justify-start items-start w-full gap-3">
                        {channel.urls.map((instance,i)=>(
                         <>
                            <p className="text-[12px] sm:text-[14px] font-normal px-4 pt-4">Instance Name : {instance.instance_display_name}</p>
                            <div className="flex justify-center items-center w-full">
                            <table className="w-max  flex flex-col flex-wrap divide-y divide-gray-200 bg-white overflow-auto  relative 
            md:text-[12px] text-[8px]" >
            <thead className="bg-[#b2dbbf]">
                <tr>
                    <th className="px-2 py-3 text-left font-medium text-black uppercase ">Scale Values</th>
                    <th className="px-6 py-3 text-left  font-medium text-black uppercase ">Button Links</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#cfdfd8] w-max ">
      {instance.instance_urls.map((link, index) => (
        <tr
          key={index}
          className="hover:bg-[#d5d5d5] hover:cursor-pointer"
          onMouseEnter={() => setShowCopyIcon(index)}
          onMouseLeave={() => setShowCopyIcon(-1)}
          onClick={() => {
            copyToClipboard(link);
            setShowCopyIcon(-1);
          }}
        >
          <td className="px-6 py-2">{ratings[index]}</td>
          <td className="px-6 py-2">
            <div className="relative overflow-auto max-w-md">
              <div className="text-[#00a3ff] truncate">{link}</div>
              {showCopyIcon === index && (
                <MdContentCopy
                  className="absolute right-[90%] sm:right-[25%] md:right-[10%] lg::right-[0%] top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the row click
                    copyToClipboard(link);
                  }}
                />
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
            <div className="absolute top-[2%] right-[0%]  p-2 flex flex-wrap">
        <BsThreeDotsVertical className="cursor-pointer" onClick={()=>{
            if(showOptions.channel==index && showOptions.inst==i){
                setShowOptions({
                    channel:-index,
                    inst:-i
                })
                return
            }
            setShowOptions({
                channel:index,
                inst:i
            })
          clicked(index,i)
            }}/>
    </div>
    {showOptions.channel==index && showOptions.inst==i && (
        <div className="text-xs flex flex-col absolute top-[18%] right-[0%] bg-white p-2 gap-2 divide divide-x divide-gray-200 font-normal justify-center items-start">
        <button className="flex justify-center text-[12px] items-center gap-2"
        onClick={()=>{copyToClipboard(instance.instance_urls)
            setShowOptions(false)
        }}><MdContentCopy/> Copy all links</button>
        <div className=" h-[1px] w-full  bg-gray-600 "></div> {/* Line */}
        <CSVLink {...csvLink} className="flex justify-center items-center gap-2 text-[12px]"><PiFileCsvDuotone/> Generate a .csv file</CSVLink>
        </div>
    )}
      {/* {showCopyIcon==0 && (
            <button className="absolute top-[34%] right-[5%] text-[14px]"><MdContentCopy /></button>
        )}
          {showCopyIcon==1 && (
            <button className="absolute top-[60%] right-[5%] text-[14px]"><MdContentCopy /></button>
        )}
          {showCopyIcon==2 && (
            <button className="absolute top-[84%] right-[5%] text-[14px]"><MdContentCopy /></button>
        )} */}
        </table>
        </div>
                          </>
                        ))}
                          </div>
                         </div>
                       ))}
                    </div>
                    ):(
                          <div className="flex flex-col justify-center items-center bg-[#fbfbfb] rounded-lg h-max w-[100%] m-1 sm:w-[90%]  xl:w-[95%] flex-wrap  p-5  relative mt-4" 
                          style={{ fontFamily: 'Roboto, sans-serif' }}>
                           
                              <div className="flex justify-center items-center gap-5 mt-2 text-white font-medium text-[12px] md:text-[16px]">
                                  <button className={`${showData=="website"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2 px-2 p-1 lg:px-8 rounded `}
                                  onClick={()=>{setPicked("website")}}><span className="hidden md:block"><PiGlobeHemisphereWestFill/></span> Website</button>
                                  <button  className={`${showData=="email"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2 px-2 p-1 lg:px-8 rounded `}
                                  onClick={()=>{setPicked("email")}}><span className="hidden md:block"><MdEmail/></span> Email</button>
                                  <button  className={`${showData=="product"? "bg-[#129561]" :"bg-[#00a3ff]" } flex justify-center items-center gap-2  px-2 p-1 lg:px-8 rounded `}
                                  onClick={()=>{setPicked("product")}}><span className="hidden md:block"><HiMiniCube/></span> Product</button>
                              </div>
                              {text.includes("LIKERT") ? (
                                 <>
                                 {picked=="website" && (
                                 <ScaleOutputScreen codeToCopy={websiteCodeToCopy} buttonLinks={[]} ratings={formData.pointersText}/>
                              )}
                                 </>
                              ):(
                                  <>
                                  {picked=="website" && (
                                 <ScaleOutputScreen codeToCopy={websiteCodeToCopy} buttonLinks={[]} ratings={ratings}/>
                              )}
                                  </>
                              )}
                              
                              {picked=="email" && (
                                 <ScaleOutputScreen codeToCopy={emailCodeToCopy} buttonLinks={[]} ratings={ratings}/>
                              )}
                            
                            {picked=="product" && (
                               <ScaleOutputScreen codeToCopy={websiteCodeToCopy} buttonLinks={[]} ratings={ratings}/>
                              //    <ProductScreen codeToCopy={websiteCodeToCopy} buttonLinks={buttonLinks}/>
                              )}
                                      
                       
                              <button className=" bg-[#129561] p-2 px-8 rounded mt-10 text-white font-bold"
                              onClick={()=>setFinished(true)}>Finish Up</button>
                          </div>
                    )}
        
        </>
    )
}