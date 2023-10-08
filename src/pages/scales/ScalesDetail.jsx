import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { MdManageHistory } from 'react-icons/md';
import { BsArrowLeft} from 'react-icons/bs';
import useGetScale from '../../hooks/useGetScale';
import useGetSingleScale from '../../hooks/useGetSingleScale';
import Fallback from '../../components/Fallback';
import { Button } from '../../components/button';


const ScalesDetail = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData} = useGetScale();
    const { loading, sigleScaleData, fetchSingleScaleData } = useGetSingleScale();
    const [currentStage, setCurrentStage] = useState(0);
    
    
    const stages = ['Stage 1', 'Stage 2', 'Stage 3',];
    const itemsAvailable = ['item 111', 'item 222'];
    const rankings = [3, 1];

    const [itemsAvailableSchema, setItemsAvailableSchema] = useState(
        itemsAvailable.map((item)=>{
            const updatedItems = {
                item:item,
                option:0
            }
            return updatedItems
        })
    );
    const [db, setDb] = useState([
        {
            stage: stages[currentStage],
            items: itemsAvailableSchema.map(item => ({
                itemName: item.item,
                rank: item.option
            }))
        }
    ]);


    const navigateTo = useNavigate();

    

    const handleNext = ()=>{
        const updatedDb = [...db, {
            stage: `Stage ${currentStage + 1}`,
            items: itemsAvailableSchema.map(item => ({
                itemName: item.item,
                rank: item.option
            }))
        }];
        setDb(updatedDb);
        setCurrentStage(prev => prev + 1);
    }
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

        console.log(selectedOption, '***** schema')
    };
    

    const handleSubmit = () => {
        const updatedDb = [...db];
        updatedDb[currentStage] = {
            stage: `Stage ${currentStage + 1}`,
            items: itemsAvailableSchema.map(item => ({
                itemName: item.item,
                rank: item.option
            }))
        };
        setDb(updatedDb);
    
        if (currentStage === stages.length - 1) {
            // Perform additional actions for the last stage
            console.log(updatedDb, 'database');
        } else {
            setCurrentStage(prev => prev + 1);
        }
    }
    

    const handleFetchSingleScale = async(scaleId)=>{
        await fetchSingleScaleData(scaleId);
    }


    useEffect(()=>{
        fetchScaleData(slug);
    },[]);

    


    if (isLoading) {
        return <Fallback />;
    }
  return (
    <div className='h-screen  flex flex-col items-center justify-center'>
        
        <div className='h-96 w-full lg:w-8/12 flex flex-col lg:flex-row items-center shadow-lg p-2'>
            <div className='h-full w-full lg:w-3/12 border overflow-y-auto  p-'>
                <h2 className='p-2 flex gap-2 items-center'>
                    <span>
                    <MdManageHistory className='text-primary'/>
                    </span> Scale History
                </h2>
                {scaleData && scaleData.map((scale, index)=>(
                    <>
                        <Button width={'full'} onClick={()=>handleFetchSingleScale(scale._id)} key={index}>{scale?.settings?.scalename || scale?.settings?.scale_name}</Button>
                    </>
                ))}
            </div>
            <div className='stage h-full w-full lg:w-5/12 border flex-1  p-2'>
            {loading ? <h3>...loading data</h3> : (
                <>
                    <div className='w-full  flex items-center gap-5'>
                        <button 
                            onClick={()=>navigateTo(-1)}
                            className='w-3/12 bg-primary text-white flex items-center justify-center gap-2 hover:bg-gray-700/50 py- px-2 py-2 my-1 capitalize'> 
                            <BsArrowLeft className='text-white' />
                            Go Back
                        </button>
                        <span className='w-3/12 border px-10 py-1'>stage {currentStage + 1} of {stages.length}</span>
                        <h2 className='text-xl capitalize border w-6/12 px-2 py-1 text-center'>
                            {/* {slug.split('-').join(' ')} */}
                            {stages[currentStage]}
                            {/* {sigleScaleData ?
                                sigleScaleData?.map((scale)=>(
                                    <span>{scale?.settings?.scalename || scale?.settings?.scale_name}</span>
                                )) : (scaleData[0]?.settings?.scalename || scaleData[0]?.settings?.scale_name)
                        } */}
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
                    <Button width={'full'} onClick={handlePrev} disabled={currentStage===0}>Previous</Button>
                    <Button width={'full'} primary onClick={handleSubmit}>save and proceed</Button>
                </div>
            </div>
        </div>
        <div className='w-full lg:w-8/12 flex items-center justify-end my-4'>
            <Button primary width={3/12} onClick={()=>navigateTo(`/create-scale?slug=${slug}`)}>create new scale</Button>
        </div>
    </div>
  )
}

export default ScalesDetail