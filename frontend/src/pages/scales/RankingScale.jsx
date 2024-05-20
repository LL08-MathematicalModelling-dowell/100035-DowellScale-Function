import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import useCreateRankingScalesResponse from '../../hooks/useCreateRankingScalesResponse';
import { MdManageHistory } from 'react-icons/md';
import { BsArrowLeft} from 'react-icons/bs';
import { toast } from 'react-toastify';
import useGetScale from '../../hooks/useGetScale';
import useGetSingleScale from '../../hooks/useGetSingleScale';
import Fallback from '../../components/Fallback';
import { Button } from '../../components/button';


const RankingScale = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData} = useGetScale();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const { CreateRankingScalesResponse } = useCreateRankingScalesResponse();
    const [currentStage, setCurrentStage] = useState(0);

    // console.log(scaleData[112], '*** scaleData')




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
            await CreateRankingScalesResponse(payload)
            
        } else {
            setCurrentStage(prev => prev + 1);
        }
    }
    

    const handleFetchSingleScale = async(scaleId)=>{
        await fetchSingleScaleData(scaleId);
    }


    useEffect(()=>{
        fetchScaleData('ranking-scale');
    },[]);
    

    


    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='flex flex-col items-center justify-center h-screen font-Montserrat'>
        <div className='w-full px-10 py-4 m-auto border border-primary lg:w-8/12'>
            <h2 className='py-3 text-center'>Ranking Scale Name:  
            <span className='text-sm font-medium'>{sigleScaleData ?
                        sigleScaleData?.map((scale)=>(
                            <span>{scale?.settings?.scalename || scale?.settings?.scale_name}</span>
                        )) : (scaleData[0]?.settings?.scalename || scaleData[0]?.settings?.scale_name)
                }</span>
            </h2>
            <div className={`h-96 w-full  m-auto flex flex-col lg:flex-row items-center shadow-lg p-2`} style={{backgroundColor:`${sigleScaleData && sigleScaleData[0].settings.scalecolor}`}}>
                <div className={`h-full w-full lg:w-3/12 border overflow-y-auto ${currentStage > 0 && 'hidden'}`}>
                    <h2 className='flex items-center gap-2 p-2 font-medium'>
                        <span className=''>
                        <MdManageHistory className='text-primary'/>
                        </span> Scale History
                    </h2>
                    {scaleData && scaleData.map((scale, index)=>(
                        <>
                            {/* <Button width={'full'} onClick={()=>handleFetchSingleScale(scale._id)} key={index}>{scale?.settings?.scalename || scale?.settings?.scale_name}</Button> */}
                            <Button width={'full'} onClick={()=>navigateTo(`/100035-DowellScale-Function/ranking-scale-settings/${scale._id}`)} key={index}>{scale?.settings?.scalename || scale?.settings?.scale_name}</Button>
                        </>
                    ))}
                </div>
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
                            {/* <Button width={'1/2'} onClick={handlePrev} disabled={currentStage===0}>Previous</Button> */}
                            <h2 className='w-3/12 py-2 text-center border'>stage {currentStage + 1} of {stages.length}</h2>
                            <h2 className='w-6/12 py-1 text-sm text-center capitalize border'>
                                {/* {slug.split('-').join(' ')} */}
                                {stages[currentStage]}
                                {/* {sigleScaleData ?
                                    sigleScaleData?.map((scale)=>(
                                        <span>{scale?.settings?.scalename || scale?.settings?.scale_name}</span>
                                    )) : (scaleData[0]?.settings?.scalename || scaleData[0]?.settings?.scale_name)
                            } */}
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
                    {sigleScaleData && sigleScaleData.map((scale, index)=>(
                        <>
                            <Button width={'full'} onClick={()=>navigateTo(`/100035-DowellScale-Function/scales-update-settings/${scale._id}`)} key={index}>update scale</Button>
                        </>
                    ))}
                </div>
            </div>
            <div className='flex items-center justify-end w-full my-4'>
                <Button primary width={'3/4'} onClick={()=>navigateTo(`/100035-DowellScale-Function/create-scale?slug=${slug}`)}>create new scale</Button>
            </div>
        </div>
    </div>
  )
}

export default RankingScale