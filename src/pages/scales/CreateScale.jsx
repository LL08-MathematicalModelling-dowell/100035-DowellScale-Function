import React, { useState, useEffect } from "react";
import { Formik, Form } from 'formik';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetchUserContext } from "../../contexts/fetchUserContext";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { Button } from "../../components/button";
import Fallback from "../../components/Fallback";
import { useCreateScale } from "../../hooks/useCreateScale";
import { InputsModal, ItemListInputModal } from "../../modals";
import CustomTextInput from "../../components/forms/inputs/CustomTextInput";

import { fontStyles } from "../../utils/constants/fontStyles";

const CreateScale = ()=>{
    const { isLoading, scaleData, createScale } = useCreateScale();
    const [timeOn, setTimeOn] = useState(false);
    const [showStagesInputModal, setShowStagesInputModal] = useState(false);
    const [showItemListInputModal, setShowItemListInputModal] = useState(false);

    const [subInputs, setSubInputs] = useState([]);
    const [subInputsValue, setSubInputsValue] = useState([]);
    const [subItems, setSubItems] = useState([]);
    const [subItemsValue, setSubItemsValue] = useState([]);
    const [inputCount, setInputCount] = useState(1);
    const [itemListCount, setItemListCount] = useState(1);
    const navigateTo = useNavigate();

    const { fetchSessionId, user  } = useFetchUserContext();

  

    


    const [formData, setFormData] = useState({
        user: true,
        username: "Joel",
        scalename: "",
        num_of_stages:1,
        num_of_substages:3,
        stages: [],
        item_count:1,
        item_list:[],
        stages_arrangement: "",
        scalecolor: "#e3e3e3",
        fontcolor:"#FF5733",
        fontstyle: "",
        orientation: "",
        ranking_method_stages: "Unique Ranking",
        start_with_zero: true,
        reference: "",
        display_ranks: true,
        time:0
    })

    const requiredFields = [
        'scalename', 
        'num_of_stages', 
        'item_count', 
        'num_of_substages', 
        'orientation', 
        'stages_arrangement', 
        'reference',
        'fontstyle',
    ];
    const orientation = ['Vertical', 'Horizontal']
    const stagesArrangement = ['Alpherbetically ordered', 'Using ID Numbers', 'Shuffled']
    const ranking_reference = ['Overall Ranking', 'StageWise Ranking']
  

    console.log(subInputs, 'subInputs');

    useEffect(()=>{
        fetchSessionId();
    },[])

    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData({ ...formData, [name]:value });
    }

    const handleCreateStages = ()=>{
        setSubInputs([...Array(Number(formData.num_of_stages))].map((_, i) => i + 1));
        handleToggleInputModal();
    }

    const handleCreateItems = ()=>{
        setSubItems([...Array(Number(formData.item_count))].map((_, i) => i + 1));
        handleToggleItemListInputModal();
    }

    const handleToggleTime = ()=>{
        setTimeOn(!timeOn);
    }

    const handleToggleInputModal = ()=>{
        setShowStagesInputModal(!showStagesInputModal);
    }

    const handleInputsValueChange = (index, value)=>{
        const updatedValues = [...subInputsValue];
        updatedValues[index] = value;
        setSubInputsValue(updatedValues);
    }
    
    const handleAddInputArea = ()=>{
        setInputCount(prev => prev + 1);
        setFormData((prev)=>({
            ...prev, num_of_stages:prev.num_of_stages + 1
        }))
        setSubInputs([...subInputs, inputCount])
    };

    const handleSubmitStagesSubinputs = ()=>{
        setSubInputs([]);
        setSubInputsValue([...subInputsValue]);
        handleToggleInputModal();
    }

    const removeStagesSubinput = (item)=>{
        setInputCount(prev => prev - 1);
        setFormData({ ...formData,  num_of_stages:inputCount});
        const newInputItems = subInputs.filter((input)=> input !== item);
        setSubInputs(newInputItems);
    }

    const removeInputValueItem = (item)=>{
        const newInputItems = subInputsValue.filter((value)=> value !== item);
        setSubInputsValue(newInputItems);
    }

    

    // all functions for item list
    const handleToggleItemListInputModal = ()=>{
        setShowItemListInputModal(!showItemListInputModal);
    }

    const handleItemListValueChange = (index, value)=>{
        const updatedValues = [...subItemsValue];
        updatedValues[index] = value;
        setSubItemsValue(updatedValues);
    }
    
    const handleAddItemListInputArea = ()=>{
        setItemListCount(prev => prev + 1);
        // setFormData({ ...formData,  item_count:itemListCount});
        setFormData(prev =>({ ...prev, item_count:prev.item_count + 1}))
        setSubItems([...subItems, itemListCount]);
    };

    const handleSubmitItemListSubinputs = ()=>{
        setSubItems([]);
        setSubItemsValue([...subItemsValue]);
        handleToggleItemListInputModal();
    }

    const removeItemListSubinput = (item)=>{
        setItemListCount(prev => prev - 1);
        setFormData({ ...formData,  item_count:itemListCount});
        const newInputItems = subItems.filter((input)=> input !== item);
        setSubItems(newInputItems);
    }

    const removeItemListValue = (item)=>{
        const newInputItems = subItemsValue.filter((value)=> value !== item);
        setSubItemsValue(newInputItems);
    }

    const handleSubmitScales = async()=>{
        const payload = {
            user: formData.user,
            username: user.username,
            scalename:formData.scalename,
            num_of_stages:Number(formData.num_of_stages),
            num_of_substages:formData.num_of_stages,
            stages: subInputsValue,
            item_count:Number(formData.item_count),
            item_list:subItemsValue,
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

        console.log(payload, 'payload here')
        for (const field of requiredFields) {
            if (!formData[field]) {
                toast.error(`Please complete the "${field.replace(/_/g, ' ')}" field.`);
                return;
            }
        }

        if (timeOn===true && (formData.time < 9)) {
            toast.error('Time cannot be empty, please set a time greater than 9');
            return;
        }
        if (payload.stages.length === 0) {
            toast.error('Click on number of stages to provide at least one stage item.');
            return;
        }
        if (payload.item_list.length === 0) {
            toast.error('Click on item count to add at least one item in the list.');
            return;
        }

        try {
            await createScale('ranking-scale', payload);
            if(scaleData.status===201){
                toast.success(scaleData.data.success);
                setTimeout(()=>{
                    navigateTo(`/scales-settings/${scaleData?.data?.scale_id}`)
                },2000)
            }
        } catch (error) {
            console.log('error')
            toast.success('an error occured');
        }
    }
    return(
        <div className="h-screen w-full flex flex-col items-center justify-center">
            <div className="w-7/12 m-auto border p-10">
                <h2 className="capitalize text-center text-lg mb-7">set up your Ranking Scale</h2>
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
                    <div className="w-full">
                        <CustomTextInput 
                            label='number of stages'
                            name='num_of_stages'
                            value={formData.num_of_stages}
                            type='number'
                            handleChange={handleChange}
                            placeholder='enter number of stages'

                            onClick={()=>{
                                handleCreateStages();
                            }}
                        />
                        <div className="">
                            {subInputsValue.map((value)=>(
                                <button 
                                    onClick={()=>removeInputValueItem(value)}
                                    className="px-5 py-1 bg-primary text-white rounded-full m-1 relative">
                                    {value}<span className="text-red-500 rounded-full bg-white px-2 absolute right-0">x</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* create items count input */}
                    <div className="w-full">
                        <CustomTextInput
                            label='item count'
                            name="item_count"
                            value={formData.item_count}
                            type="number"
                            placeholder="item count"
                            // className='w-full outline-0 border py-1 px-1 rounded-sm text-gray-700'
                            onClick={()=>{
                                handleCreateItems();
                            }}
                        />
                        <div className="">
                            {subItemsValue.map((value)=>(
                                <button 
                                    onClick={()=>removeItemListValue(value)}
                                    className="px-5 py-1 bg-primary text-white rounded-full m-1 relative">
                                    {value}<span className="text-red-500 rounded-full bg-white px-2 absolute right-0">x</span>
                                </button>
                            ))}
                        </div>
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
                        <label htmlFor="arrangement" className="text-sm font-normal mb-1 ml-1">stages arrangement</label>
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
                                <input
                                    name="time"
                                    type="number"
                                    placeholder="enter a valid time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className='w-full outline-0 border py-1 px-1 rounded-sm text-gray-700'
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
                {isLoading ? <Fallback/> : <Button type="submit" width={'full'} primary onClick={handleSubmitScales}>Save</Button>}
            </div>
            </div>
            {showStagesInputModal && (<InputsModal 
                handleToggleInputModal={handleToggleInputModal}
                handleSubmitStagesSubinputs={handleSubmitStagesSubinputs}
                subInputs={subInputs}
                subInputsValue={subInputsValue}
                handleInputsValueChange={handleInputsValueChange}
                handleAddInputArea={handleAddInputArea}
                removeSubinput={removeStagesSubinput}
            />)
            }
            {showItemListInputModal && (<ItemListInputModal 
                handleToggleItemListInputModal={handleToggleItemListInputModal}
                handleSubmitStagesSubinputs={handleSubmitItemListSubinputs}
                subItems={subItems}
                subItemsValue={subItemsValue}
                handleInputsValueChange={handleItemListValueChange}
                handleAddInputArea={handleAddItemListInputArea}
                removeSubinput={removeItemListSubinput}
            />)
            }
        </div>
    )
}

export default CreateScale;