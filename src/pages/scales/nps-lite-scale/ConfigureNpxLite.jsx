import { CiCirclePlus } from "react-icons/ci";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { Fragment } from "react";

export default function ConfigureNpxLite(props){
    return(
        <>
         <style scoped>
                {
                    `
                    .channel-changes{
                        display: grid;
                       
                    }
                    @media(min-width:968px){
                    .channel-changes{
                        display: flex
                    }
                }
                    `
                }
            </style>

        <div className="flex flex-col   gap-5  items-center text-[16px]"  style={{ fontFamily: 'Roboto, sans-serif' }}>
            <div className="w-max flex flex-col justify-center items-center">
        <div className="w-max flex flex-col justify-center items-center">
        <div className="flex flex-col gap-1 mt-10 w-full">
            <label className="p-2  font-medium" htmlFor="scaleName">Scale Name:</label>
            <input 
                type="text" 
                value={props.formData["scaleName"]} 
                name="scaleName" 
                placeholder="Enter scale name" 
                onChange={e => props.handleFormData(e.target.value, e.target.name)} 
                className="p-2 rounded-md px-4"
            />
             {props.nameErr && <p className="text-[12px] text-red-500">**min 3 characters</p>}
        </div>
       
        <div className="flex flex-col w-max gap-1 mt-5">
            <label className="p-2 font-medium" htmlFor="numResponses">No. of Responses per Instance:</label>
            <input type="number" value={props.formData["numResponses"]} name="numResponses" placeholder="Enter number" 
             className="p-2 rounded-md px-4"
             onChange={e => props.handleFormData(e.target.value,e.target.name)} />
             {props.numErr && <p className="text-[12px] text-red-500">**(min:25- max:10000)</p>}
        </div>
        </div>
        {props.formData.channels.map((channel,index1)=>(
            <>
           
            <div key={index1} className="flex  gap-10 mt-5 channel-changes justify-center items-center ml-8">
                <p className="mt-8">{index1+1}</p>
             <div className="flex flex-col  gap-1">
                <div className="flex flex-col  gap-1">
            <label className="p-2 font-medium" htmlFor="channelName">Specify Channel:</label>
            <input type="text" value={channel.channelName}  name="channelName" placeholder="Enter channel name" 
             className="p-2 rounded-md px-4 w-max"
            onChange={e => props.handleFormData(e.target.value,e.target.name,index1)} />
           {props.channelErr==index1 && <p className="text-[12px] text-red-500">**channel name already exists</p>}
           {props.requiredChannel==index1 && <p className="text-[12px] text-red-500">**required</p>}
           </div>
        </div>
        <div className="flex gap-3">
        <div className="flex flex-col  gap-1">
            <label className="p-2 font-medium" htmlFor="InstanceName">Specify Instances:</label>
            {channel.instances.map((instance, index) => (
                <div  key={index} className="flex flex-col  gap-2">
            <input
                key={index}
                type="text"
                value={instance}
                name="InstanceName"
                placeholder={`Enter instance ${index+1} name`}
                onChange={e =>  props.handleFormData(e.target.value,e.target.name,index1,index)}
                className="p-2 rounded-md px-4"
            />
            {props.instanceErr.index==index1 && props.instanceErr.idx==index && <p className="text-[12px] text-red-500">**instance name already exists</p>}
            {props.requiredInstance.index==index1 && props.requiredInstance.idx==index && <p className="text-[12px] text-red-500">**required</p>}
            </div>
            ))}
           
        </div>
        <div className="flex justify-center items-center gap-2 mt-10 h-max w-max">
        <button onClick={()=>props.decreaseInstance(index1)}>-</button>
        <p className="p-2 bg-white">{channel.instances.length} </p>
        <button onClick={()=>props.increaseInstance(index1)}>+</button>
        {index1>0 &&(
         <RiDeleteBin2Fill className="text-2xl cursor-pointer" onClick={()=>props.deleteChannel(index1)}/>
      )}
        </div>
        </div>
      
            </div>
            </>
        ))}
        <div className="flex flex-col mt-10 justify-center items-center w-full gap-10">
         <button className="flex  justify-center items-center ml-5  gap-2 bg-[#0D99FF] rounded p-2  w-[70%]"
         onClick={props.addChannel}
         >Add Channel <CiCirclePlus/></button>
         
        <button className="bg-green-600 p-2 px-20 rounded mt-5 flex justify-center items-center" onClick={()=>props.handleNext()}>Confirm</button>
        </div>
        </div>
     </div>
     </>
    )
}