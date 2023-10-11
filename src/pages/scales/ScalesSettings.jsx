
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import useGetSingleScale from "../../hooks/useGetSingleScale";
import Fallback from "../../components/Fallback";
import CustomTextInput from "../../components/forms/inputs/CustomTextInput";

const ScalesSettings = ()=>{
    const { slug } = useParams();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const [timeOn, setTimeOn] = useState(false);
    
    // const { position, jobDescription } = formData || {};
    // const [jobDetails, setJobDetails] = useState(
    //     Object.assign({}, { position, jobDescription })
    // );


    
    const data = sigleScaleData && sigleScaleData?.map((scale)=> {
        return scale
    })

    console.log(sigleScaleData && sigleScaleData[0], '**** sigleScaleData');

    const [formData, setFormData] = useState({
        user: true,
        username: "Joel",
        scalename: "car ranking",
        num_of_stages:(sigleScaleData && sigleScaleData[0]?.settings?.num_of_stages),
        num_of_substages:(sigleScaleData && sigleScaleData[0]?.settings?.num_of_substages),
        stages: [],
        item_count:(sigleScaleData && sigleScaleData[0]?.settings?.item_count),
        item_list:["item 1","item 2"],
        stages_arrangement: "",
        scalecolor: (sigleScaleData && sigleScaleData[0]?.settings?.scalecolor),
        fontcolor:(sigleScaleData && sigleScaleData[0]?.settings?.fontcolor),
        fontstyle: (sigleScaleData && sigleScaleData[0]?.settings?.fontstyle),
        orientation: "",
        ranking_method_stages: "Unique Ranking",
        start_with_zero: true,
        reference: "",
        display_ranks: true
    });

    const orientation = ['Vertical', 'Horizontal']
    const stagesArrangement = ['Alpherbetically ordered', 'Using ID Numbers', 'Shuffled']
    const ranking_reference = ['Overall Ranking', 'StageWise Ranking']
    const fontStyles = ['segoe print', 'times new romans', 'franklin gothic']


    const handleToggleTime = ()=>{
        setTimeOn(!timeOn);
    }

    const handleFetchSingleScale = async(scaleId)=>{
        await fetchSingleScaleData(scaleId);
    }

    useEffect(()=>{
        handleFetchSingleScale(slug);
    },[slug]);

    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData({ ...formData, [name]:value });
    }

    if(loading){
        return <Fallback />
    }
    return(
        <div className="h-screen w-full flex flex-col items-center justify-center">
        <div className="w-7/12 m-auto border p-10">
            <h2 className="capitalize text-center text-lg mb-7">set up your Ranking</h2>
        <div>
            <div className='grid grid-cols-3 gap-3 mb-10'>
                <CustomTextInput 
                    label='scale name'
                    name='scalename'
                    value={formData.scalename}
                    type='text'
                    handleChange={handleChange}
                    placeholder='enter scale name'
                />
                <div>
                    <CustomTextInput 
                        label='number of stages'
                        name='num_of_stages'
                        value={formData.num_of_stages}
                        type='number'
                        handleChange={handleChange}
                        placeholder='enter number of stages'
                    />
                </div>
                <div className="">
                    <CustomTextInput
                        label='item count'
                        name="item_count"
                        type="number"
                        placeholder="item count"
                    />
                  
                </div>
                <CustomTextInput 
                    label='number of substages'
                    name='num_of_substages'
                    value={formData.num_of_substages}
                    type='number'
                    handleChange={handleChange}
                    placeholder='enter number of substages'
                />
                <div>
                    <label htmlFor="orientation" className="text-sm font-normal mb-1 ml-1">orientation</label>
                    <select 
                        label="Select a orientation" 
                        name="orientation" 
                        className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                        value={formData.orientation}
                        onChange={handleChange}
                    >
                        <option value={''}>-- Select orientation  --</option>
                        {orientation.map((orientation, i) => (
                            <option key={i} >
                                {orientation}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="arrangement" className="text-sm font-normal mb-1 ml-1">arrangement</label>
                    <select 
                        label="Select arrangement" 
                        name="stages_arrangement" 
                        className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                        value={formData.stages_arrangement}
                        onChange={handleChange}
                    >
                        <option value={''}>-- Select stages arrangement  --</option>
                            {stagesArrangement.map((stagesArrangement, i) => (
                                <option key={i} >
                                    {stagesArrangement}
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="reference" className="text-sm font-normal mb-1 ml-1">reference</label>
                    <select label="Select a reference" 
                        name="reference" 
                        className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                        value={formData.reference}
                        onChange={handleChange}
                    >
                        <option value={''}>-- Select ranking reference  --</option>
                            {ranking_reference.map((reference, i) => (
                                <option key={i}>
                                    {reference}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="w-full">
                    <div className="flex items-center gap-3">
                        {timeOn && <button onClick={handleToggleTime}><BsToggleOn className="text-primary h-6 w-6"/></button>}
                        {!timeOn && <button  onClick={handleToggleTime}><BsToggleOff className="text-primary h-6 w-6"/></button>}
                        <span>Toggle to set Time</span>
                    </div>
                    {
                        timeOn && (
                            <CustomTextInput
                                name="time"
                                type="number"
                                placeholder="enter a valid time"
                            />
                        )
                    }
                    
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor='scalecolor'>scale color</label>
                    <input 
                        label='scale color'
                        name="scalecolor"
                        autoComplete="given-name"
                        type="color"
                        placeholder='scale color'
                        value={formData.scalecolor}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor='fontcolor'>font color</label>
                    <input 
                        label='font color'
                        name="fontcolor"
                        autoComplete="given-name"
                        type="color"
                        placeholder='font color'
                        value={formData.fontcolor}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>
                <div>
                    <label htmlFor="arrangement" className="text-sm font-normal mb-1 ml-1">font style</label>
                    <select 
                        label="Select font style" 
                        name="fontstyle" 
                        className="appearance-none block w-full mt-1 text-[#989093] text-sm font-light py-2 px-2 outline-0 rounded-[8px] border border-[#DDDADB] pl-4"
                        value={formData.fontstyle}
                        onChange={handleChange}
                    >
                        <option value={''}>-- Select font style  --</option>
                            {fontStyles.map((style, i) => (
                                <option key={i} >
                                    {style}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
        </div>
        
        </div>
        
    </div>
    )
}

export default ScalesSettings;