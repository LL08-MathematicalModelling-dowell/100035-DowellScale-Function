import React from 'react'

const InputsModal = ({ 
    handleToggleInputModal, 
    subInputs, 
    subInputsValue, 
    handleInputsValueChange, 
    handleAddInputArea, 
    handleSubmitSubinputs,
    removeSubinputItem
}) => {
  return (
    <div className='h-screen w-full flex flex-col justify-center fixed top-0 left-0 bg-primary/40'>
        <button 
            onClick={handleToggleInputModal}
            className='px-2 bg-red-500 text-white rounded-full absolute right-10 top-10'>
            x
        </button>
        <div className='w-5/12 m-auto border bg-white p-5'>
            <div className='flex justify-end'>
                <button className='bg-gray-500 flex items-center gap-5 px-5 py-2 text-white my-5' 
                onClick={handleAddInputArea}>Add more values <span>+</span></button>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                {subInputs.map((content, index)=>(
                    <div key={content} className='relative'>
                        <input 
                            type="text" 
                            value={subInputsValue[index]} 
                            placeholder={`Add a new ${content}`}
                            onChange={(e)=>handleInputsValueChange(index, e.target.value)}
                            className='w-full border border-2 outline-0 p-2'
                        />
                        <button className='bg-red-400 absolute top-0 right-0 py-[10px] px-2 text-white' onClick={()=>removeSubinputItem(content)}>remove</button>
                    </div>
                ))}
            </div>
            <div className=''>
                {subInputs.length > 0 && (
                    <button 
                    className='bg-primary flex items-center gap-5 px-5 py-2 text-white my-5'
                    onClick={handleSubmitSubinputs}>
                    submit
                    <span>--</span>
                </button>
                )}
            </div>
        </div>
    </div>
  )
}

export default InputsModal