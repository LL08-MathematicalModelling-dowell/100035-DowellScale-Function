import scaleconfirmedimage from "../../../../src/assets/scaleconfirmed.png"
import handleSharing from "../../../utils/handleSharing";
export default function ConfirmationScale({formData,setButtonLinks,setButtonLinksGenerated}){
    return(
        <>
        <div>
                 <p className="w-full  font-medium">Your NPS LITE SCALE has been confirmed!</p>
                 <div className="flex flex-col justify-center items-center gap-3 mt-10">
                    <img src={scaleconfirmedimage}  alt='image'></img>
                    <p className="font-medium">You can start sharing your scale on different platforms</p>
                    <button className=" font-medium p-2 px-12 bg-[#129561] rounded mt-12 text-white"
                    onClick={()=>{handleSharing(formData,setButtonLinks,setButtonLinksGenerated)}}>Start Sharing</button>
                 </div>
                </div>
        </>
    )
}