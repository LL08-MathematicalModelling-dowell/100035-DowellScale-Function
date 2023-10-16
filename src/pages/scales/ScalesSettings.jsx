
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import useGetSingleScale from "../../hooks/useGetSingleScale";
import { useUpdateResponse } from "../../hooks/useUpdateResponse";
import Fallback from "../../components/Fallback";
import CustomTextInput from "../../components/forms/inputs/CustomTextInput";
import { Button } from "../../components/button";
import { fontStyles } from "../../utils/constants/fontStyles";

import { InputsModal } from "../../modals";

const ScalesSettings = ()=>{
    const { slug } = useParams();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const [timeOn, setTimeOn] = useState(false);
    const { _id, settings } = (sigleScaleData && sigleScaleData[0]) || {};
    const [isLoading, setIsLoading] = useState(false);
    const updateResponse = useUpdateResponse();
    const navigateTo = useNavigate();


    const [showStagesInputModal, setShowStagesInputModal] = useState(false);
    const [showItemListInputModal, setShowItemListInputModal] = useState(false);

    const [subInputs, setSubInputs] = useState([]);
    const [subInputsValue, setSubInputsValue] = useState([]);
    const [subItems, setSubItems] = useState([]);
    const [subItemsValue, setSubItemsValue] = useState([]);
    const [inputCount, setInputCount] = useState(null);
    const [itemListCount, setItemListCount] = useState(1);

    console.log(subInputsValue, 'subInputsValue')


    const scalename = settings?.scalename;
    const num_of_stages = settings?.num_of_stages;
    const num_of_substages = settings?.num_of_substages;
    const stages = settings?.stages;
    const item_count = settings?.item_count;
    const item_list = settings?.item_list;
    const scalecolor = settings?.scalecolor;
    const fontcolor = settings?.fontcolor;
    const fontstyle = settings?.fontstyle;
    const orientation = settings?.orientation;
    const ranking_method_stages = settings?.ranking_method_stages;
    const start_with_zero = settings?.start_with_zero;
    const reference = settings?.reference;
    const stages_arrangement = settings?.stages_arrangement;
    const display_ranks = settings?.display_ranks;
        

    const [updateFormData, setUpdateFormData] = useState(
        Object.assign({}, { 
            user: true,
            username: "Joel",
            scalename,
            num_of_stages, 
            num_of_substages, 
            stages, 
            item_count, 
            item_list,
            scalecolor, 
            fontcolor, 
            fontstyle, 
            orientation,
            ranking_method_stages,
            start_with_zero, 
            reference,
            stages_arrangement,
            display_ranks 
        })
    );

    const updateOrientation = ['Vertical', 'Horizontal'];
    const stagesArrangement = ['Alpherbetically ordered', 'Using ID Numbers', 'Shuffled'];
    const ranking_reference = ['Overall Ranking', 'StageWise Ranking'];

    
    

    const updatePayload = {
            scale_id:_id,
            user: true,
            username: "Joel",
            scalename:updateFormData.scalename,
            num_of_stages:updateFormData.num_of_stages, 
            num_of_substages:updateFormData.num_of_substages, 
            stages:subInputsValue, 
            item_count:updateFormData.item_count, 
            item_list:updateFormData.item_list,
            scalecolor:updateFormData.scalecolor, 
            fontcolor:updateFormData.fontcolor, 
            fontstyle:updateFormData.fontstyle, 
            orientation:updateFormData.orientation,
            ranking_method_stages:updateFormData.ranking_method_stages,
            start_with_zero:updateFormData.start_with_zero, 
            reference:updateFormData.reference,
            stages_arrangement:updateFormData.stages_arrangement,
            display_ranks:updateFormData.display_ranks 
    }

    console.log(updatePayload, '****updatePayload')



    const handleCreateStages = ()=>{
        setSubInputs([...Array(Number(updateFormData?.num_of_stages))].map((_, i) => i + 1));
        handleToggleInputModal();
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
        setSubInputs([...subInputs, inputCount])

        setUpdateFormData((prev)=>({
            ...prev,
            num_of_stages:prev.num_of_stages + 1
        }));
    }; 

    const handleSubmitStagesSubinputs = ()=>{
        setSubInputs([]);
        setSubInputsValue([...subInputsValue]);
        handleToggleInputModal();
    }

    const removeStagesSubinput = (item)=>{
        setInputCount(prev => prev - 1);
        // const newInputItems = subInputs.filter((input)=> input !== item);
        // setSubInputs(newInputItems);
        setSubInputs(prev => prev.filter(input => input !== item));
        setUpdateFormData(prev => ({
            ...prev,
            num_of_stages: prev.num_of_stages - 1
          }));
    }

    const removeInputValueItem = (item)=>{
        const newInputItems = subInputsValue.filter((value)=> value !== item);
        setSubInputsValue(newInputItems);
        setInputCount(prev => prev - 1);
        setUpdateFormData(prev => ({
            ...prev,
            num_of_stages: prev.num_of_stages - 1
          }));
    }


    const handleToggleTime = ()=>{
        setTimeOn(!timeOn);
    }

    const handleFetchSingleScale = async (scaleId) => {
        try {
            await fetchSingleScaleData(scaleId);
        } catch (error) {
            console.error("Error fetching single scale data:", error);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            await handleFetchSingleScale(slug);
        }
        fetchData();
    }, [slug]);

    useEffect(() => {
        if (settings) {
          setUpdateFormData({
            scalename: settings?.scalename || '',
            num_of_stages: Number(settings.num_of_stages) || 0,
            num_of_substages: Number(settings.num_of_substages) || 0,
            stages: settings.stages || [],
            item_count: settings.item_count || 0,
            item_list: settings.item_list || [],
            scalecolor: settings.scalecolor || '',
            fontcolor: settings.fontcolor || '',
            fontstyle: settings.fontstyle || '',
            orientation: settings.orientation || '',
            ranking_method_stages: settings.ranking_method_stages || '',
            start_with_zero: settings.start_with_zero || '',
            reference: settings.reference || '',
            stages_arrangement: settings?.stages_arrangement || '',
            display_ranks: settings.display_ranks || ''
          });
          
        }
      }, [settings]);

    useEffect(()=>{
        if(updateFormData.stages){
            setSubInputsValue([...updateFormData.stages]);
        }
    },[updateFormData.stages]);

    useEffect(()=>{
        if(updateFormData.num_of_stages){
            setInputCount(updateFormData.num_of_stages);
        }
    },[updateFormData.num_of_stages]);

      

    const handleChange = (e)=>{
        const { name, value } = e.target;
        setUpdateFormData({ ...updateFormData, [name]:value });
    }

    const handleUpdateRankingScale = async()=>{
        console.log(updatePayload)
        try {
            setIsLoading(true);
            const response = await updateResponse(updatePayload);
            // console.log(response, 'updated response')
            toast.success('successfully updated');
            setTimeout(()=>{
                navigateTo(`/all-scales/${'ranking-scale'}`);
            },2000)
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

    if(loading || isLoading){
        return <Fallback />
    }
    return(
        <div className="h-screen w-full flex flex-col items-center justify-center">
        <div className="w-7/12 m-auto border border-2 p-10">
            <h2 className="capitalize text-center text-lg mb-7">update <span className="text-primary font-xl border-b">{scalename}</span></h2>
        <div>
            <div className='grid grid-cols-3 gap-3 mb-10'>
                <CustomTextInput 
                    label='scale name'
                    name='scalename'
                    value={updateFormData?.scalename}
                    type='text'
                    handleChange={handleChange}
                    placeholder='enter scale name'
                />
                <div>
                    <CustomTextInput 
                        label='number of stages'
                        name='num_of_stages'
                        value={updateFormData?.num_of_stages}
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
                <div className="">
                    <CustomTextInput
                        label='item count'
                        name="item_count"
                        value={updateFormData.item_count}
                        handleChange={handleChange}
                        type="number"
                        placeholder="item count"
                    />
                  
                </div>
                <CustomTextInput 
                    label='number of substages'
                    name='num_of_substages'
                    value={updateFormData.num_of_substages}
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
                        value={updateFormData.orientation}
                        onChange={handleChange}
                    >
                        <option value={''}>-- Select orientation  --</option>
                        {updateOrientation.map((orientation, i) => (
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
                        value={updateFormData.stages_arrangement}
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
                        value={updateFormData.reference}
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
                        value={updateFormData.scalecolor}
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
                        value={updateFormData.fontcolor}
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
                        value={updateFormData.fontstyle}
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
        <Button primary width={'full'} onClick={handleUpdateRankingScale}>Update scale</Button>
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
        
    </div>
    )
}

export default ScalesSettings;