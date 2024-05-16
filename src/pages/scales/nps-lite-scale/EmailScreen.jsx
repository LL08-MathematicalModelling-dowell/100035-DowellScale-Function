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
        <div className="absolute sm:top-[73%] md:top-[72%]  lg:top-[70%] lg:right-[12%] top-[70%] right-[12%]  p-2 flex flex-wrap">
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
                      <button className="flex justify-center text-[12px] text-white bg-[#606060] p-1 items-center gap-2 absolute right-[18%] top-[35%] sm:right-[16%] sm:top-[27%] md:right-[12%] md:top-[28%] lg:right-[12%] lg:top-[26%] xl:top-[26%] xl:right-[10%]"
                      onClick={()=>{copyToClipboard(codeToCopy)
                      
                      }}> <MdContentCopy /> Copy code</button>
                  16{isCopied && <p className="absolute text-[#00a3ff] 
                  right-[23%] top-[38%] sm:right-[19%] sm:top-[30%] md:right-[17%] md:top-[31%] lg:right-[17%] lg:top-[29%] xl:top-[30%] xl:right-[15%]">Copied!</p>}
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
            <button className="absolute sm:top-[77%] top-[75%] right-[10%]"><MdContentCopy /></button>
        )}
          {showCopyIcon==1 && (
            <button className="absolute sm:top-[81%] top-[79%] right-[10%]"><MdContentCopy /></button>
        )}
          {showCopyIcon==2 && (
            <button className="absolute top-[84%] right-[10%]"><MdContentCopy /></button>
        )}
</div>
    </>
    )
}