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
                    .flex-changes{
                        justify-content: flex-start;
                        align-items: flex-start;
                        margin-left:40px;
                    }

                    @media(min-width:968px){
                    .channel-changes{
                        display: flex
                    }
                    .flex-changes{
                    justify-content: flex-center;
                    align-items: center;
                    }
                }
                    `
                }
            </style>

        <div className="flex flex-col   gap-5  flex-changes">
        <div className="flex flex-col flex-changes gap-3 mt-10 w-full ">
            <label className="p-2 font-medium" htmlFor="scaleName">Scale Name:</label>
            <input 
                type="text" 
                value={props.formData["scaleName"]} 
                name="scaleName" 
                placeholder="Enter scale name" 
                onChange={e => props.handleFormData(e.target.value, e.target.name)} 
                className="p-2 rounded-md px-4"
            />
             {props.nameErr && <p className="text-xs text-red-600 items-end">**min 3 characters</p>}
        </div>

        <div className="flex flex-col flex-changes gap-5">
            <label className="p-2 font-medium" htmlFor="numResponses">No. of Responses per Instance:</label>
            <input type="number" value={props.formData["numResponses"]} name="numResponses" placeholder="Enter number" 
             className="p-2 rounded-md px-4"
             onChange={e => props.handleFormData(e.target.value,e.target.name)} />
             {props.numErr && <p className="text-xs text-red-600 items-end">**(min:25- max:10000)</p>}
        </div>
        {props.formData.channels.map((channel,index1)=>(
            <>
           
            <div key={index1} className="flex flex-changes gap-5 channel-changes">
             <div className="flex flex-col  gap-5">
                <div className="flex flex-col  gap-3">
            <label className="p-2 font-medium" htmlFor="channelName">Specify Channel:</label>
            <input type="text" value={channel.channelName}  name="channelName" placeholder="Enter channel name" 
             className="p-2 rounded-md px-4 w-max"
            onChange={e => props.handleFormData(e.target.value,e.target.name,index1)} />
           {props.channelErr==index1 && <p className="text-xs text-red-600 items-end">**channel name already exists</p>}
           {props.requiredChannel==index1 && <p className="text-xs text-red-600 items-end">**required</p>}
           </div>
        </div>
        <div className="flex gap-3">
        <div className="flex flex-col  gap-3">
            <label className="p-2 font-medium" htmlFor="InstanceName">Specify Instances:</label>
            {channel.instances.map((instance, index) => (
                <div  key={index} className="flex flex-col  gap-3">
            <input
                key={index}
                type="text"
                value={instance}
                name="InstanceName"
                placeholder={`Enter instance ${index+1} name`}
                onChange={e =>  props.handleFormData(e.target.value,e.target.name,index1,index)}
                className="p-2 rounded-md px-4"
            />
            {props.instanceErr.index==index1 && props.instanceErr.idx==index && <p className="text-xs text-red-600 items-end">**instance name already exists</p>}
            {props.requiredInstance.index==index1 && props.requiredInstance.idx==index && <p className="text-xs text-red-600 items-end">**required</p>}
            </div>
            ))}
           
        </div>
        <div className="flex justify-center items-center gap-2 mt-10">
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
         <button className="flex flex-changes gap-2 bg-blue-600 rounded-lg p-2 px-12"
         onClick={props.addChannel}
         >Add Channel <CiCirclePlus/></button>
        <button className="bg-green-600 p-2 px-10 rounded-lg  flex-changes" onClick={()=>props.handleNext()}>Confirm</button>
     </div>
     </>
    )
}