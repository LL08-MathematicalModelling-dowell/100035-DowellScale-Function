import React from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft} from 'react-icons/bs';
import { Button } from "../../components/button";


const AvailableScales = ()=>{
    const navigateTo = useNavigate();
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

    return (
        <div className='h-screen  flex flex-col items-center justify-center'>
            <div className='h-auto w-full lg:w-8/12  shadow-lg p-2'>
            <button 
                onClick={()=>navigateTo(-1)}
                className='w-3/12 bg-primary text-white flex items-center justify-center gap-2 hover:bg-gray-700/50 py- px-2 py-2 my-1 capitalize'> 
            <BsArrowLeft className='text-white' />
            back
            </button>
                    
                <div className="border border-primary p-5">
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
                        <Button primary width={'full'}>Save and Proceed</Button>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-5">
                    <Button primary>update scale</Button>
                    <Button primary>save response</Button>
                </div>
            </div>
            
        </div>
    )
}

export default AvailableScales;