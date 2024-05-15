import { CiCirclePlus } from "react-icons/ci";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useState } from "react";

export default function ConfigureNpxLite({formData,setFormData,setConfirmScale}){
    const[numErr,setNumErr]=useState(false)
const[nameErr,setNameErr]=useState(false)
const[channelErr,setChannelErr]=useState(-1)
const[instanceErr,setInstanceErr]=useState({index:-1,idx:-1})
const[requiredChannel,setRequiredChannel]=useState(-1)
const[requiredInstance,setRequiredInstance]=useState({index:-1,idx:-1})


function handleFormData(value, name, index = 0, idx = 0) {
    switch (name) {
        case "scaleName":
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            if (value.length < 3) setNameErr(true);
            else setNameErr(false);
            break;

        case "numResponses":
            let num = Number(value);
            setFormData(prev => ({
                ...prev,
                [name]: num
            }));
            if (num < 30 || num > 10000) {
                setNumErr(true);
            } else {
                setNumErr(false);
            }
            break;

        case "channelName":
            setRequiredChannel(-1)
            const nameExists = formData.channels.some((channel, idx) => idx !== index && channel.channelName === value);
            if (nameExists) {
                setChannelErr(index)
            }else{
                setChannelErr(-1);
            }
            setFormData(prev => ({
                ...prev,
                channels: prev.channels.map((channel, idx) => idx === index ? { ...channel, channelName: value } : channel)
            }));
          
            break;

        case "InstanceName":
            setRequiredInstance({index:-1,idx:-1})
            const instanceExists = formData.channels[index].instances.includes(value)
              
            
            if (instanceExists) {
                setInstanceErr({index,idx});
            } else {
                setInstanceErr({index:-1,idx:-1});
            }
  
            setFormData(prev => ({
                ...prev,
                channels: prev.channels.map((channel, i) => i === index ? {
                    ...channel,
                    instances: channel.instances.map((inst, iidx) => iidx === idx ? value : inst)
                } : channel)
            }));
        
            break;

        default:
            return formData;
    }
}



function increaseInstance(index){
    setFormData((prev)=>({
        ...prev,
        channels:prev.channels.map((channel,idx)=>idx==index?{
            ...channel,
            instances:[...channel.instances,""]
        }:channel)
    }))
}

function decreaseInstance(index){
  
    setFormData(prev => ({
        ...prev,
        channels: prev.channels.map((channel, idx) => {
            if (idx === index && channel.instances.length>1) {
                return {
                    ...channel,
                    instances: channel.instances.slice(0, -1)
                };
            }
            return channel;
        })
    }));
    if(instanceErr.index==index){
        setInstanceErr({index:-1,idx:-1})
    }

    
}

function addChannel(){
    let newChannel={
        channelName:"",
        instances:[""]
    }
    setFormData(prev => ({
        ...prev,
        channels:[...prev.channels,newChannel]
        
    }));
    
}

function deleteChannel(index){
    setFormData(prev => ({
        ...prev,
        channels: prev.channels.filter((channel, idx) => idx !== index)
        
    })); 
    if(channelErr==index){
        setChannelErr(-1)
    }
}

function handleNext(){
            let error=false
        if(formData.scaleName.length<3){
            setNameErr(true)
            error=true
        }

        if(formData.numResponses<25 || formData.numResponses>10000){
            setNumErr(true)
            error=true
            
        }

        formData.channels.map((channel, index) => {
        
            if (channel.channelName.length === 0) {
                setRequiredChannel(index);
                error=true
            }
        });


        formData.channels.map((channel, index) => {
            channel.instances.map((instance, idx) => {
                if (instance.length === 0) {
                    setRequiredInstance({index, idx});
                    error=true
                }
            });
        });



        if(error)
            return
        else
        setConfirmScale(true)
// setStep((prev)=>prev+1)

}

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
                value={formData["scaleName"]} 
                name="scaleName" 
                placeholder="Enter scale name" 
                onChange={e => handleFormData(e.target.value, e.target.name)} 
                className="p-2 rounded-md px-4"
            />
             {nameErr && <p className="text-[12px] text-red-500">**min 3 characters</p>}
        </div>
       
        <div className="flex flex-col w-max gap-1 mt-5">
            <label className="p-2 font-medium" htmlFor="numResponses">No. of Responses per Instance:</label>
            <input type="number" value={formData["numResponses"]} name="numResponses" placeholder="Enter number" 
             className="p-2 rounded-md px-4"
             onChange={e => handleFormData(e.target.value,e.target.name)} />
             {numErr && <p className="text-[12px] text-red-500">**(min:25- max:10000)</p>}
        </div>
        </div>
        <div className="w-max flex flex-col justify-start items-start"> 
        {formData.channels.map((channel,index1)=>(
            <>
           
            <div key={index1} className="flex flex-col lg:flex-row lg:justify-center lg:items-center gap-5 mt-5 channel-changes  ml-8">
            <p className="hidden lg:block mt-9 font-medium text-[18px]">{index1+1}.</p>
             <div className="flex flex-col justify-start items-start gap-1">
             
                <div className="flex flex-col  gap-1">
            <label className="p-2 font-medium" htmlFor="channelName">Specify Channel:</label>
            <div className="flex justify-center items-center gap-2 ">
           
         
            <input type="text" value={channel.channelName}  name="channelName" placeholder="Enter channel name" 
             className="p-2 rounded-md px-4 w-max"
            onChange={e => handleFormData(e.target.value,e.target.name,index1)} />
             {index1>0 &&(
                    <RiDeleteBin2Fill className=" text-2xl cursor-pointer" onClick={()=>deleteChannel(index1)}/>
               )}
         </div>
           {channelErr==index1 && <p className="text-[12px] text-red-500">**channel name already exists</p>}
           {requiredChannel==index1 && <p className="text-[12px] text-red-500">**required</p>}
           </div>
        </div>
        <div className="flex gap-1 md:gap-3 justify-center items-center w-max">
        <div className={`${index1==0 ? "ml-0 lg:ml-6" : "ml-0"} flex flex-col  gap-1`}>
            <label className="p-2 font-medium" htmlFor="InstanceName">Specify Instances:</label>
            {channel.instances.map((instance, index) => (
                <div  key={index} className="flex flex-col  gap-2">
            <input
                key={index}
                type="text"
                value={instance}
                name="InstanceName"
                placeholder={`Enter instance ${index+1} name`}
                onChange={e =>  handleFormData(e.target.value,e.target.name,index1,index)}
                className="p-2 rounded-md px-4"
            />
            {instanceErr.index==index1 && instanceErr.idx==index && <p className="text-[12px] text-red-500">**instance name already exists</p>}
            {requiredInstance.index==index1 && requiredInstance.idx==index && <p className="text-[12px] text-red-500">**required</p>}
            </div>
            ))}
           
        </div>
        <div className="flex justify-center items-center gap-1 md:gap-2 mt-10 h-max w-max">
        <button onClick={()=>decreaseInstance(index1)}>-</button>
        <p className="md:p-2 p-[1px] rounded-xl md:rounded-none bg-white">{channel.instances.length} </p>
        <button onClick={()=>increaseInstance(index1)}>+</button>
      
        </div>
        </div>
      
            </div>
            </>
        ))}
        </div>
        <div className="flex flex-col mt-10 justify-center items-center w-full gap-10">
         <button className="flex  justify-center items-center ml-5  gap-2 bg-[#0D99FF] rounded p-2  w-[70%]"
         onClick={addChannel}
         >Add Channel <CiCirclePlus/></button>
         
        <button className="bg-green-600 p-2 px-20 rounded mt-5 flex justify-center items-center" onClick={()=>handleNext()}>Confirm</button>
        </div>
        </div>
     </div>
     </>
    )
}