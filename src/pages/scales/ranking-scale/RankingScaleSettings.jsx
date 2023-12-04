
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { BsArrowLeft} from 'react-icons/bs';
import { useParams, useNavigate } from "react-router-dom";
import useGetSingleScale from "../../../hooks/useGetSingleScale";
import useCreateRankingScalesResponse from "../../../hooks/useCreateRankingScalesResponse";
import Fallback from "../../../components/Fallback";
import { Button } from "../../../components/button";


const RankingScaleSettings = ()=>{
    const { slug } = useParams();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const { CreateRankingScalesResponse } = useCreateRankingScalesResponse();
    const [currentStage, setCurrentStage] = useState(0);
    const [itemsAvailableSchema, setItemsAvailableSchema] = useState([]);

    console.log(sigleScaleData, 'sigleScaleData')


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
    });
 
    
    const stages = sigleScaleData ? dataStages[0] : ['City 5', 'City 6'];
    const itemsAvailable = dataItems ? dataItems[0] : ['item 111', 'item 222'];
    const rankings = [0, 1];

    // const [itemsAvailableSchema, setItemsAvailableSchema] = useState(
    //     stages.map((item)=>{
    //         const updatedItems = {
    //             item:item,
    //             option:0
    //         }
    //         return updatedItems
    //     })
    // );

    // console.log(itemsAvailableSchema, 'itemsAvailableSchema')
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
                scale_id: sigleScaleData[0]?._id,
                brand_name: "New Brand",
                product_name:"New Product",
                num_of_stages: sigleScaleData[0]?.settings?.num_of_stages,
                num_of_substages:sigleScaleData[0]?.settings?.num_of_substages,
                username: "natan",
                rankings:updatedDb
              }
            try {
                const response = await CreateRankingScalesResponse(payload);
                toast.success('successfully updated');
                if(response.status===200){
                    setTimeout(() => {
                        navigateTo(`/100035-DowellScale-Function/${'ranking-scale'}`)
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

    useEffect(() => {
        if (sigleScaleData && sigleScaleData[0]) {
          const items = sigleScaleData[0].settings.item_list.map(item => item);
          setItemsAvailableSchema(items.map(item => ({ item, option: 0 })));
        }
      }, [sigleScaleData]);
    


    if (loading) {
        return <Fallback />;
    }
    return(
        <div className='flex flex-col items-center justify-center h-screen font-Montserrat'>
        <div className='w-full px-10 py-4 m-auto border border-primary lg:w-8/12'>
            <h2 className='py-3 text-center'>Ranking Scale Name:  
            <span className='text-sm font-medium'>{sigleScaleData &&
                        sigleScaleData?.map((scale)=>(
                            <span>{scale?.settings?.scalename || scale?.settings?.scale_name}</span>
                        ))
                }</span>
            </h2>
            <div className={`h-96 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}>
                <div className='flex-1 w-full h-full p-2 border stage lg:w-5/12'>
                {loading ? <h3>...loading data</h3> : (
                    <>
                        <div className='flex items-center w-full gap-5'>
                            <button 
                                onClick={handlePrev} disabled={currentStage===0}
                                className='flex items-center justify-center w-3/12 gap-2 px-2 py-2 my-1 text-white capitalize bg-primary hover:bg-gray-700/50 py-'> 
                                <BsArrowLeft className='text-white' />
                                Go Back
                            </button>
                            <h2 className='w-3/12 py-2 text-center border'>stage {currentStage + 1} of {stages.length}</h2>
                            <h2 className='w-6/12 py-1 text-sm text-center capitalize border'>
                                {stages[currentStage]}
                            </h2>
                        </div>
                        <div className='flex flex-col w-full gap-3 md:flex-row'>
                            <>
                                <div className='w-full'>
                                    <h2 className='px-2 border my-7'>Items available</h2>
                                {
                                    <ul>
                                        {
                                            itemsAvailableSchema.map((item, index)=>(
                                                <li key={index} className='px-3 py-1 border'>{item.item}</li>
                                            ))
                                        }
                                    </ul>
                                }
                                </div>
                                <div className='w-full'>
                                    <h2 className='px-2 border my-7'>Select Rankings</h2>
                                    {itemsAvailableSchema.map((item, index) => (
                                    <div className='w-full' key={index}>
                                        {/* <h2 className='px-2 border my-7'>{item.item}</h2> */}
                                        <select
                                            name={`ranking-${index}`}
                                            value={item.option}
                                            onChange={(e)=>handleSelectOption(e, index)}
                                            className='w-full px-3 py-1 border outline-0'
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
                    <div className="flex justify-end gap-3">
                        {sigleScaleData && sigleScaleData.map((scale, index)=>(
                            <>
                                <Button width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/update-ranking-scale/${scale._id}`)} key={index}>update scale</Button>
                            </>
                        ))}
                        <Button onClick={handleSubmit}
                        disabled={currentStage !== stages.length - 1}
                        width={'3/4'} primary>Save Response</Button>
                    </div>
                    
                </div>
            </div>
            {/* <div className='flex items-center justify-end w-full my-4'>
                <Button primary width={'3/4'} onClick={()=>navigateTo(`/create-scale?slug=${slug}`)}>create new scale</Button>
            </div> */}
        </div>
    </div>
    )
}

export default RankingScaleSettings;