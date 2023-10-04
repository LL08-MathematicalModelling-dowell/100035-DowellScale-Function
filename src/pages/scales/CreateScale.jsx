import React, { useState } from "react";
import { Formik, Form } from 'formik';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { Button } from "../../components/button";
import Fallback from "../../components/Fallback";
import { useCreateScale } from "../../hooks/useCreateScale";
import { InputsModal } from "../../modals";
import CustomTextInput from "../../components/forms/inputs/CustomTextInput";

const CreateScale = ()=>{
    const { isLoading, scaleData, createScale } = useCreateScale();
    const [timeOn, setTimeOn] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);

    const [subInputs, setSubInputs] = useState([]);
    const [subInputsValue, setSubInputsValue] = useState([]);
    const [inputCount, setInputCount] = useState(1);
    const [selectedInputType, setSelectedInputType] = useState('');

    const [formData, setFormData] = useState({
        user: true,
        username: "Joel",
        scalename: "car ranking",
        num_of_stages:0,
        num_of_substages:3,
        stages: [],
        item_count:2,
        item_list:["item 1","item 2"],
        stages_arrangement: "",
        scalecolor: "",
        fontcolor:"#FF5733",
        fontstyle: "",
        orientation: "",
        ranking_method_stages: "Unique Ranking",
        start_with_zero: true,
        reference: "",
        display_ranks: true
    })

    const orientation = ['Vertical', 'Horizontal']
    const stagesArrangement = ['Alpherbetically ordered', 'Using ID Numbers', 'Shuffled']
    const ranking_reference = ['Overall Ranking', 'StageWise Ranking']
    const fontStyles = ['segoe print', 'times new romans', 'franklin gothic']

    console.log(subInputs, 'subInputs');

    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData({ ...formData, [name]:value });
    }

    const handleBlur = ()=>{
        setSubInputs([...Array(Number(formData.num_of_stages))].map((_, i) => i + 1));
        handleToggleInputModal();
    }

    const handleToggleTime = ()=>{
        setTimeOn(!timeOn);
    }

    const handleToggleInputModal = ()=>{
        setShowInputModal(!showInputModal);
    }
    const handleInputsValueChange = (index, value)=>{
        const updatedValues = [...subInputsValue];
        updatedValues[index] = value;
        setSubInputsValue(updatedValues);
    }
    
    const handleAddInputArea = ()=>{
        setInputCount(prev => prev + 1);
        setSubInputs([...subInputs, inputCount])
    };

    const handleSubmitSubinputs = ()=>{
        console.log(subInputsValue,  '***** inputs')
        setSubInputs([]);
        setValues([...values, '']);
        handleToggleInputModal();
    }

    const removeSubinputItem = (item)=>{
        const newInputItems = subInputs.filter((input)=> input !== item);
        setSubInputs(newInputItems);
    }

    const removeInputValueItem = (item)=>{
        const newInputItems = subInputsValue.filter((value)=> value !== item);
        setSubInputsValue(newInputItems);
    }

    const handleSubmitScales = ()=>{
        const payload = {
            user: formData.user,
            username: formData.username,
            scalename:formData.scalename,
            num_of_stages:formData.num_of_stages,
            num_of_substages:formData.num_of_stages,
            stages: subInputsValue,
            item_count:formData.item_count,
            item_list:formData.item_list,
            stages_arrangement: formData.stages_arrangement,
            scalecolor:formData.scalecolor,
            fontcolor:formData.fontcolor,
            fontstyle:formData.fontstyle,
            orientation:formData.orientation,
            ranking_method_stages:formData.ranking_method_stages,
            start_with_zero: true,
            reference:formData.reference,
            display_ranks: true
        }

        createScale('ranking-scale', payload);
        console.table(payload, '**** payload');
    }
    return(
        <div className="h-screen w-full flex flex-col items-center justify-center">
            <div className="w-7/12 m-auto">
                <h2 className="capitalize text-center text-lg">set up your Ranking</h2>
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

                            // onClick={()=>{
                            //     setSelectedInputType('stages');
                            //     handleToggleInputModal();
                            // }}
                            onBlur={handleBlur}
                        />
                        <div className="">
                            {subInputsValue.map((value)=>(
                                <button 
                                    onClick={()=>removeInputValueItem(value)}
                                    className="px-5 py-1 bg-primary text-white rounded-full m-1 relative">
                                    {value}<span className="text-red-500 rounded-full bg-white px-2 absolute right-0">x</span></button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <CustomTextInput
                            label='item count'
                            name="item_count"
                            type="number"
                            placeholder="item count"
                            
                        />
                        {/* <button className="bg-primary text-white px-1 py-1" 
                            onClick={()=>{
                                handleToggleInputModal();
                            }}
                        >Add Stage</button> */}
                        {/* <div className="">
                            {(selectedInputType === 'item_count') && subInputsValue && subInputsValue.map((value)=>(
                                <button 
                                    onClick={()=>removeInputValueItem(value)}
                                    className="px-5 py-1 bg-primary text-white rounded-full m-1 relative">
                                    {value}<span className="text-red-500 rounded-full bg-white px-2 absolute right-0">x</span></button>
                            ))}
                        </div> */}
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
            <div>
                {isLoading ? <Fallback/> : <Button type="submit" width={'3/12'} primary onClick={handleSubmitScales}>Save</Button>}
            </div>
            </div>
            {showInputModal && (<InputsModal 
                handleToggleInputModal={handleToggleInputModal}
                handleSubmitSubinputs={handleSubmitSubinputs}
                subInputs={subInputs}
                subInputsValue={subInputsValue}
                handleInputsValueChange={handleInputsValueChange}
                handleAddInputArea={handleAddInputArea}
                removeSubinputItem={removeSubinputItem}
            />)
            }
        </div>
    )
}

export default CreateScale;