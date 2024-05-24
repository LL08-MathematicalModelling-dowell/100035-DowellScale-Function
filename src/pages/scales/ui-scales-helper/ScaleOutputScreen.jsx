import { BsThreeDotsVertical } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { PiFileCsvDuotone } from "react-icons/pi";
import {useState} from "react"
import {CSVLink} from "react-csv"
export default function ScaleOutputScreen({codeToCopy,buttonLinks,ratings}){

    const[showOptions,setShowOptions]=useState(false)
    const[isCopied,setIsCopied]=useState(false)
    const[showCopyIcon,setShowCopyIcon]=useState(-1)
    const csvArray = [];

   
    buttonLinks.forEach((link, index) => {  
        const obj = {
            rating: ratings[index],
            buttonLink: link
        };
        csvArray.push(obj);
    });

    const headers=[
      {
        label:"Data", key:"rating"
      },
      {
        label:"Link", key:"buttonLink"
      }
      
    ]
console.log(csvArray)
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
    
 
     <div className="flex flex-col justify-center items-start  mt-5 flex-wrap w-[100%]">
                    <p className=" p-2 mb-5 ">Copy the source code of your scale and integrate it on your website</p>
                    <div className="h-[300px] w-[95%] bg-white overflow-auto p-2 text-[12px] relative">
                        <pre  style={{ fontFamily: 'Roboto, sans-serif' }} className="text-[12px] md:text-[14px]">
                       {codeToCopy}
                       </pre>
                      <button className="flex justify-center text-[12px] text-white bg-[#606060] p-1 items-center gap-2 absolute top-[2%] right-[2%]"
                      onClick={()=>{copyToClipboard(codeToCopy)
                      
                      }}> <MdContentCopy /> Copy code</button>
                  {isCopied && <p className="absolute text-[#00a3ff]  top-[16%] right-[2%]">Copied!</p>}
                    </div>
                     <p className=" p-2 mt-5">Use the button links to add them to your scale</p>
                     <div className="flex w-full justify-center items-center">
            <table className="w-max  flex flex-col flex-wrap divide-y divide-gray-200 bg-gray-50 overflow-auto mt-5  relative
            md:text-[12px] text-[8px]" >
            <thead>
                <tr>
                    <th className="px-2 py-3 text-left font-medium text-black uppercase ">Scale Values</th>
                    <th className="px-6 py-3 text-left  font-medium text-black uppercase ">Button Links</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#cfdfd8] w-max ">
      {buttonLinks.map((link, index) => (
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
        <BsThreeDotsVertical className="cursor-pointer" onClick={()=>setShowOptions((prev)=>!prev)}/>
    </div>
    {showOptions && (
        <div className="text-xs flex flex-col absolute top-[10%] right-[0%] bg-white p-2 gap-2 divide divide-x divide-gray-200 font-normal justify-center items-start">
        <button className="flex justify-center text-[12px] items-center gap-2"
        onClick={()=>{copyToClipboard(buttonLinks)
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
      
</div>
    </>
    )
}