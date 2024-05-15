import { BsThreeDotsVertical } from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { PiFileCsvDuotone } from "react-icons/pi";
import {useState} from "react"
export default function EmailScreen({codeToCopy,buttonLinks}){
    const[showOptions,setShowOptions]=useState(false)
    const[isCopied,setIsCopied]=useState(false)
    const[showCopyIcon,setShowCopyIcon]=useState(-1)
 
    const ratings=["Bad","Average", "Excellent"]

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
        <div className="absolute top-[71%] right-[16%]  p-2 flex flex-wrap">
        <BsThreeDotsVertical className="cursor-pointer" onClick={()=>setShowOptions((prev)=>!prev)}/>
    </div>
    {showOptions && (
        <div className="text-xs flex flex-col absolute top-[75%] right-[4%] bg-white p-2 gap-2 divide divide-x divide-gray-200 font-normal justify-center items-start">
        <button className="flex justify-center text-[12px] items-center gap-2"
        onClick={()=>{copyToClipboard(buttonLinks)
            setShowOptions(false)
        }}><MdContentCopy/> Copy all links</button>
        <div className=" h-[1px] w-full  bg-gray-600 "></div> {/* Line */}
        <button className="flex justify-center items-center gap-2 text-[12px]"><PiFileCsvDuotone/> Generate a .csv file</button>
        </div>
    )}
     <div className="flex flex-col justify-center items-start font-normal mt-5 flex-wrap w-[100%]">
                    <p className=" p-2 mb-5 ">Copy the source code of your scale and integrate it on your website</p>
                    <div className="h-[300px] w-[95%] bg-white overflow-auto p-2 text-[12px]">
                        <pre  style={{ fontFamily: 'Roboto, sans-serif' }} className="text-[14px]">
                       {codeToCopy}
                       </pre>
                      <button className="flex justify-center text-[12px] text-white bg-[#606060] p-1 items-center gap-2 absolute right-[18%] top-[33%] sm:right-[14%] sm:top-[29%] md:right-[12%] md:top-[28%] lg:right-[12%] lg:top-[26%] xl:top-[24%] xl:right-[10%]"
                      onClick={()=>{copyToClipboard(codeToCopy)
                      
                      }}> <MdContentCopy /> Copy code</button>
                  {isCopied && <p className="absolute top-[27%] text-[#00a3ff] right-[18%]">Copied!</p>}
                    </div>
                     <p className=" p-2 mt-5">Use the button links to add them to your scale</p>
            <table className="w-[95%]  flex flex-col flex-wrap divide-y divide-gray-200 bg-gray-50 overflow-auto mt-5 
            md:text-[12px] text-[8px]" >
            <thead>
                <tr>
                    <th className="px-2 py-3 text-left font-medium text-black uppercase ">Scale Values</th>
                    <th className="px-6 py-3 text-left  font-medium text-black uppercase ">Button Links</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#cfdfd8] w-max  ">
                {buttonLinks.map((link, index) => (
                    <tr key={index} className="hover:bg-[#d5d5d5] hover:cursor-pointer" onMouseEnter={()=>setShowCopyIcon(index)}
                    onMouseLeave={()=>setShowCopyIcon(-1)}
                    onClick={()=>{copyToClipboard(buttonLinks[index])
                        setShowCopyIcon(-1)
                    }}
                   >
                        <td className="px-6 py-2 ">{ratings[index]}</td>
                        <td className="px-6 py-2">
                            <div className="overflow-hidden ">
                                <div className="  text-[#00a3ff]">{link}</div>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {showCopyIcon==0 && (
            <button className="absolute top-[76%] right-[15%]"><MdContentCopy /></button>
        )}
          {showCopyIcon==1 && (
            <button className="absolute top-[80%] right-[15%]"><MdContentCopy /></button>
        )}
          {showCopyIcon==2 && (
            <button className="absolute top-[84%] right-[15%]"><MdContentCopy /></button>
        )}
</div>
    </>
    )
}