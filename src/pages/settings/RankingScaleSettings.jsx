
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { BsArrowLeft} from 'react-icons/bs';
import { useParams, useNavigate } from "react-router-dom";
import useGetSingleScale from "../../hooks/useGetSingleScale";
import useCreateRankingScalesResponse from "../../hooks/useCreateRankingScalesResponse";
import Fallback from "../../components/Fallback";
import { Button } from "../../components/button";


const RankingScaleSettings = ()=>{
    const { slug } = useParams();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const { CreateRankingScalesResponse } = useCreateRankingScalesResponse();
    const [currentStage, setCurrentStage] = useState(0);


    const dataStages = sigleScaleData && sigleScaleData?.map((scale)=>{
        const stages = scale?.settings?.stages.map((stage)=>{
            return stage;
        })
        return stages;
    });

    const dataItems = sigleScaleData && sigleScaleData?.map((scale)=>{
        const itemList = scale?.settings?.item_list.map((list)=>{
            return list;
        })
        return itemList;
    })

    // console.log(dataItems[0], 'dataItems')


    
    
    const stages = sigleScaleData ? dataStages[0] : ['City 5', 'City 6'];
    // console.log(stages, 'stages')
    const itemsAvailable = dataItems ? dataItems[0] : ['item 111', 'item 222'];
    // console.log(itemsAvailable, 'itemsAvailable')
    const rankings = [0, 1];

    const [itemsAvailableSchema, setItemsAvailableSchema] = useState(
        (dataItems ? dataItems[0] : itemsAvailable).map((item)=>{
            const updatedItems = {
                item:item,
                option:0
            }
            return updatedItems
        })
    );

    console.log(itemsAvailableSchema, 'itemsAvailableSchema')
    const [db, setDb] = useState([
        {
            stage_name: stages[currentStage],
            stage_rankings: itemsAvailableSchema.map(item => ({
                name: item.item,
                rank: item.option
            }))
        }
    ]);


    const navigateTo = useNavigate();

    
    const handlePrev = ()=>{
        if(currentStage > 0){
            setCurrentStage(prev => prev - 1);
        }
    }

    const handleSelectOption = (e, index) => {
        const selectedOption = e.target.value;
    
        setItemsAvailableSchema(prevSchema => {
            const updatedSchema = [...prevSchema];
            updatedSchema[index].option = selectedOption;
            return updatedSchema;
        });
    };
    

    const handleSubmit = async() => {
        const selectedOptions = itemsAvailableSchema.map(item => item.option);
        const isDuplicate = new Set(selectedOptions).size !== selectedOptions.length;
        if (isDuplicate) {
            toast.error('Please assign unique ranks to each item');
            return;
        }
        const updatedDb = [...db];
        updatedDb[currentStage] = {
            stage_name: stages[`${currentStage}`],
            stage_rankings: itemsAvailableSchema.map(item => ({
                name: item.item,
                rank: Number(item.option)
            }))
        };
        setDb(updatedDb);
    
        if (currentStage === stages.length - 1) {
            const payload =  {
                scale_id: "651bd7295c8f069f1f078ed5",
                brand_name: "New Brand",
                product_name:"New Product",
                num_of_stages: 2,
                num_of_substages:0,
                username: "natan",
                rankings:updatedDb
              }
            try {
                const response = await CreateRankingScalesResponse(payload);
                toast.success('successfully updated');
                if(response.status===200){
                    setTimeout(() => {
                        navigateTo(`/all-scales/${'ranking-scale'}`)
                    }, 2000);
                }
            } catch (error) {
                console.log(error)   
            }
            
        } else {
            setCurrentStage(prev => prev + 1);
        }
    }
    

    const handleFetchSingleScale = async(scaleId)=>{
        await fetchSingleScaleData(scaleId);
    }

    useEffect(() => {
        const fetchData = async () => {
            await handleFetchSingleScale(slug);
        }
        fetchData();
    }, [slug]);
    


    if (loading) {
        return <Fallback />;
    }
    return(
        <div className='h-screen  flex flex-col items-center justify-center font-Montserrat'>
        <div className='border border-primary w-full lg:w-8/12 m-auto py-4 px-10'>
            <h2 className='text-center py-3'>Ranking Scale Name:  
            <span className='font-medium text-sm'>{sigleScaleData &&
                        sigleScaleData?.map((scale)=>(
                            <span>{scale?.settings?.scalename || scale?.settings?.scale_name}</span>
                        ))
                }</span>
            </h2>
            <div className={`h-96 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}>
                <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
                {loading ? <h3>...loading data</h3> : (
                    <>
                        <div className='w-full  flex items-center gap-5'>
                            <button 
                                onClick={handlePrev} disabled={currentStage===0}
                                className='w-3/12 bg-primary text-white flex items-center justify-center gap-2 hover:bg-gray-700/50 py- px-2 py-2 my-1 capitalize'> 
                                <BsArrowLeft className='text-white' />
                                Go Back
                            </button>
                            <h2 className='w-3/12 border text-center py-2'>stage {currentStage + 1} of {stages.length}</h2>
                            <h2 className='text-sm capitalize border w-6/12 py-1 text-center'>
                                {stages[currentStage]}
                            </h2>
                        </div>
                        <div className='w-full flex gap-3 flex-col md:flex-row'>
                            <>
                                <div className='w-full'>
                                    <h2 className='border px-2 my-7'>Items available</h2>
                                {
                                    <ul>
                                        {
                                            itemsAvailableSchema.map((item, index)=>(
                                                <li key={index} className='border px-3 py-1'>{item.item}</li>
                                            ))
                                        }
                                    </ul>
                                }
                                </div>
                                <div className='w-full'>
                                    <h2 className='border px-2 my-7'>Select Rankings</h2>
                                    {itemsAvailableSchema.map((item, index) => (
                                    <div className='w-full' key={index}>
                                        {/* <h2 className='border px-2 my-7'>{item.item}</h2> */}
                                        <select
                                            name={`ranking-${index}`}
                                            value={item.option}
                                            onChange={(e)=>handleSelectOption(e, index)}
                                            className='w-full border px-3 py-1 outline-0'
                                        >
                                            {rankings.map((ranking) => (
                                                <option key={ranking} value={ranking}>
                                                    {ranking}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                                </div>
                            </>
                        </div>
                    </>
                    )}
                    <div className='flex items-center gap-3 mt-10'>
                    
                        <Button width={'full'} primary onClick={handleSubmit}>{(currentStage === stages.length - 1) ? 'submit scale' : 'save and proceed'}</Button>
                    
                    </div>
                    <div className="flex gap-3 justify-end">
                        {sigleScaleData && sigleScaleData.map((scale, index)=>(
                            <>
                                <Button width={'3/4'} onClick={()=>navigateTo(`/ranking-scale-settings/${scale._id}`)} key={index}>update scale</Button>
                            </>
                        ))}
                        <Button width={'3/4'} primary>Save Response</Button>
                    </div>
                    
                </div>
            </div>
            {/* <div className='w-full flex items-center justify-end my-4'>
                <Button primary width={'3/4'} onClick={()=>navigateTo(`/create-scale?slug=${slug}`)}>create new scale</Button>
            </div> */}
        </div>
    </div>
    )
}

export default RankingScaleSettings;