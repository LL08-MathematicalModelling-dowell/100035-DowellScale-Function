import React from "react";
import { Formik, Form } from 'formik';
import { rankingScalesSchema } from "../../utils/YupSchema";
import TextInput from "../../components/forms/inputs/TextInputs";
import { Button } from "../../components/button";
import Fallback from "../../components/Fallback";
import { useCreateScale } from "../../hooks/useCreateScale";

const CreateScales = ()=>{
    const { isLoading, scaleData, createScale } = useCreateScale();
    return(
        <div className="h-screen flex flex-col items-center justify-center">
            jaja
            <div>
            <Formik
                    initialValues={{
                        scalename: '',
                        num_of_stages: '',
                        // num_of_substages: '',
                        // stages_arrangement: '',
                        // stages: '',
                        // scalecolor: '',
                        // fontcolor: '',
                        // fontstyle:'',
                        // orientation: '',
                        // ranking_method_stages: '',
                        // start_with_zero: '',
                        // reference: '',
                        // display_ranks: '',
                    }}
                    validationSchema={rankingScalesSchema}
                    onSubmit={(values, { setSubmitting })=>{
                        const formData = {
                            scalename: values.scalename,
                            num_of_stages: values.num_of_stages,
                            // num_of_substages: values.num_of_substages,
                            // stages_arrangement: values.stages_arrangement,
                            // stages: values.stages,
                            // scalecolor: values.scalecolor,
                            // fontcolor: values.fontcolor,
                            // fontstyle:values.fontstyle,
                            // orientation: values.orientation,
                            // ranking_method_stages: values.ranking_method_stages,
                            // start_with_zero: values.start_with_zero,
                            // reference: values.reference,
                            // display_ranks: values.display_ranks,
                        };
                        createScale(ranking-scale, formData);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting })=>(
                        <Form>
                            <div className='w-full relative'>
                                <TextInput 
                                    label='scale name'
                                    name="scalename"
                                    autoFocus
                                    autoComplete="given-name"
                                    type="text"
                                    placeholder='scale name'
                                    
                                />
                                <TextInput
                                    label='num of stages'
                                    name="num_of_stages"
                                    type="number"
                                    placeholder="num of stages"
                                />
                            </div>
                            <div>
                                {/* {isLoading ? <Fallback/> : <Button type="submit" primary disabled={isSubmitting}>submit</Button>} */}
                                <Button type="submit" primary disabled={isSubmitting}>submit</Button>
                            </div>
                        
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default CreateScales;