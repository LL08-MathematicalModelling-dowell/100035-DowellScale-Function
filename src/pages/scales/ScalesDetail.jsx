import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { MdManageHistory } from 'react-icons/md';
import { BsArrowLeft} from 'react-icons/bs';
import useGetScale from '../../hooks/useGetScale';
import Fallback from '../../components/Fallback';
import { Button } from '../../components/button';

const ScalesDetail = () => {
    const { slug } = useParams();
    const { isLoading, scaleData, fetchScaleData} = useGetScale();
    const navigateTo = useNavigate();
    console.log(scaleData, 'scaleData')

    const itemsAvailable = [
        {
            name:'item 1',
            rankings:[0, 1, 2, 3, 4]
        },
        {
            name:'item 2',
            rankings:[0, 1, 2, 3, 4]
        },
        {
            name:'item 3',
            rankings:[0, 1, 2, 3, 4]
        },
        {
            name:'item 4',
            rankings:[0, 1, 2, 3, 4]
        },
        {
            name:'item 5',
            rankings:[0, 1, 2, 3, 4]
        },
    ]

    const itemName = itemsAvailable.map((item, index)=> {
        return <ul className='border p-2' key={index}>{item.name}</ul>
    });


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
                        <Button width={'full'} onClick={()=>navigateTo(`/scales-settings/${scale?.settings.scale_name || scale?.settings?.scalename}`)} key={index}>{scale?.settings?.scalename || scale?.settings?.scale_name}</Button>
                    </>
                ))}
            </div>
            <div className='h-full w-full lg:w-5/12 border flex-1  p-2'>
                <div className='w-full lg:w-8/12 flex items-center gap-5'>
                    <button 
                        onClick={()=>navigateTo(-1)}
                        className='w-3/12 bg-primary text-white flex items-center justify-center gap-2 hover:bg-gray-700/50 py- px-2 py-2 my-1 capitalize'> 
                    <BsArrowLeft className='text-white' />
                    back</button>
                    <div>
                        <h2 className='text-xl capitalize'>{slug.split('-').join(' ')}</h2>
                    </div>
                </div>
                <div className='w-full flex gap-3 flex-col md:flex-row'>
                    <>
                    <div className='w-1/2'>
                        <h3 className='my-2'>Items Available</h3>
                        <ul>
                            {itemName}
                        </ul>
                    </div>
                    <div className='w-1/2'>
                        <h3 className='my-2'>Rankings</h3>
                        {
                            itemsAvailable && itemsAvailable.map((item, index)=>(
                                <select name="" id="" disabled="" className='w-full px-2 border outline-0 py-2' key={index}>
                                    {item.rankings.map((ranking)=>(
                                        <option value={ranking} className='p-2 border-primary'>{ranking}</option>
                                    ))}
                                </select>
                            ))
                        }
                        
                    </div>
                    </>
                </div>
                <div className='w-full'>
                    <Button primary width={'full'} onClick={()=>navigateTo('/available-scales')}>Save and Proceed</Button>
                </div>
            </div>
        </div>
        <div className='w-full lg:w-8/12 flex items-center justify-end my-4'>
            <Button primary width={3/12} onClick={()=>navigateTo(`/create-scales?slug=${slug}`)}>create new scale</Button>
        </div>
    </div>
  )
}

export default ScalesDetail