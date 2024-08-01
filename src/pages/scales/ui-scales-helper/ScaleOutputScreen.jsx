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
                    <p className=" p-2 mb-5 text-[12px] sm:text-[14px] text-center font-medium">Copy the source code of your scale and integrate it on your website</p>
                    <div className="h-[300px] w-[95%] bg-white overflow-auto p-2 text-[12px] relative">
                        <pre  style={{ fontFamily: 'Roboto, sans-serif' }} className="text-[12px] md:text-[14px]">
                       {codeToCopy}
                       </pre>
                      <button className="flex justify-center text-[12px] text-white bg-[#606060] p-1 items-center gap-2 absolute top-[2%] right-[2%]"
                      onClick={()=>{copyToClipboard(codeToCopy)
                      
                      }}> <MdContentCopy /> Copy code</button>
                  {isCopied && <p className="absolute text-[#00a3ff]  top-[16%] right-[2%]">Copied!</p>}
                    </div>
            
      
</div>
    </>
    )
}