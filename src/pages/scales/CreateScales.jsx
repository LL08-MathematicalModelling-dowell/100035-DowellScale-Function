import React, { useState } from "react";
import { Formik, Form } from 'formik';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { rankingScalesSchema } from "../../utils/YupSchema";
import TextInput from "../../components/forms/inputs/TextInputs";
import SelectInput from "../../components/forms/inputs/SelectInput";
import { Button } from "../../components/button";
import Fallback from "../../components/Fallback";
import { useCreateScale } from "../../hooks/useCreateScale";
import { InputsModal } from "../../modals";

const CreateScales = ()=>{
    const { isLoading, scaleData, createScale } = useCreateScale();
    const [timeOn, setTimeOn] = useState(false);
    const [showInputModal, setShowInputModal] = useState(false);

    const [subInputs, setSubInputs] = useState([]);
    const [subInputsValue, setSubInputsValue] = useState([]);
    const [inputCount, setInputCount] = useState(1);

    const orientation = ['Vertical', 'Horizontal']
    const stagesArrangement = ['Alpherbetically ordered', 'Using ID Numbers', 'Shuffled']

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
        handleToggleInputModal();
    }

    const removeSubinputItem = (item)=>{
        const newInputItems = subInputs.filter((input)=> input !== item);
        setSubInputs(newInputItems);
    }
    return(
        <div className="h-screen w-full flex flex-col items-center justify-center">
            <div className="w-7/12 m-auto">
                <h2 className="capitalize text-center text-lg">set up your Ranking</h2>
            <Formik
                    initialValues={{
                        // user: true,
                        // username: "Michael",
                        // scalename: "",
                        // num_of_stages:6,
                        // stages: [],
                        // num_of_substages:0,
                        // item_count:2,
                        // item_list:[],
                        // stages_arrangement: "",
                        // scalecolor: "",
                        // fontcolor:"",
                        // fontstyle: "",
                        // orientation: "",
                        // ranking_method_stages: "",
                        // start_with_zero: true,
                        // reference: "",
                        // display_ranks: true

                        user: true,
                        username: "Joel",
                        scalename: "car ranking",
                        num_of_stages:6,
                        num_of_substages:3,
                        stages: [
                            "City 1",
                            "City 2",
                            "City 3",
                            "City 4",
                            "City 5",
                            "City 6"
                        ],
                        item_count:2,
                        item_list:["one", "two"],
                        stages_arrangement: "Using ID numbers",
                        scalecolor: "#FFFFFF",
                        fontcolor:"#FCFCFC",
                        fontstyle: "Sans Serif",
                        orientation: "Horizontal",
                        ranking_method_stages: "Unique Ranking",
                        start_with_zero: true,
                        reference: "Overall Ranking",
                        display_ranks: true
                    }}
                    validationSchema={rankingScalesSchema}
                    onSubmit={(values, { setSubmitting })=>{
                        const formData = {
                            user: values.user,
                            username: values.username,
                            scalename: values.scalename,
                            num_of_stages:values.num_of_stages,
                            stages: values.stages,
                            num_of_substages:values.num_of_substages,
                            item_count:values.item_count,
                            item_list:values.item_list,
                            stages_arrangement: values.stages_arrangement,
                            scalecolor: values.scalecolor,
                            fontcolor:values.fontcolor,
                            fontstyle: values.fontstyle,
                            orientation: values.orientation,
                            ranking_method_stages: values.ranking_method_stages,
                            start_with_zero: values.start_with_zero,
                            reference: values.reference,
                            display_ranks: values.display_ranks
                        };
                        createScale('ranking-scale', formData);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting })=>(
                        <Form>
                            <div className="border p-5">
                                <div className='grid grid-cols-3 gap-3 mb-10'>
                                    <div>
                                        <TextInput 
                                            label='scale name'
                                            name="scalename"
                                            autoFocus
                                            autoComplete="given-name"
                                            type="text"
                                            placeholder='scale name'
                                            
                                        />
                                    </div>
                                    <div>
                                        <TextInput
                                            label='num of stages'
                                            name="num_of_stages"
                                            type="number"
                                            placeholder="num of stages"
                                            onClick={handleToggleInputModal}
                                        />
                                        <div className="">
                                            {subInputsValue && subInputsValue.map((value)=>(
                                                <button className="px-5 py-1 bg-primary text-white rounded-full m-1 relative">{value}<span className="text-red-500 rounded-full bg-white px-2 absolute right-0">x</span></button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <SelectInput label="Select a orientation" name="orientation">
                                            <option value={''}>-- Select orientation  --</option>
                                            {orientation.map((orientation, i) => (
                                                <option key={i} value={orientation}>
                                                    {orientation}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center gap-3">
                                            {timeOn && <button onClick={handleToggleTime}><BsToggleOn className="text-primary h-6 w-6"/></button>}
                                            {!timeOn && <button  onClick={handleToggleTime}><BsToggleOff className="text-primary h-6 w-6"/></button>}
                                            <span>Toggle to set Time</span>
                                        </div>
                                        {
                                            timeOn && (
                                                <TextInput
                                                    name="fontstyle"
                                                    type="number"
                                                    placeholder=""
                                                />
                                            )
                                        }
                                        
                                    </div>
                                    
                                    <div className="w-full">
                                        <SelectInput label="Select a arrangement" name="stagesArrangement">
                                                <option value={''}>-- Select stages arrangement  --</option>
                                                {stagesArrangement.map((stagesArrangement, i) => (
                                                    <option key={i} value={stagesArrangement}>
                                                        {stagesArrangement}
                                                    </option>
                                                ))}
                                        </SelectInput>
                                    </div>
                                </div>
                                <div>
                                    {isLoading ? <Fallback/> : <Button type="submit" width={'3/12'} primary disabled={isSubmitting}>Save</Button>}
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
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

export default CreateScales;