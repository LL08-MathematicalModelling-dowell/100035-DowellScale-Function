import React from 'react'
import dowellLogo from '../../../assets/dowell-logo.png';

const Booth = () => {
  return (
    <div className='flex flex-col rounded-lg items-center mt-10 w-[320px] h-[550px] m-auto border'>
      <img className='mt-10' src='https://cdn.discordapp.com/attachments/1108341894162952192/1247115439675277424/image.png?ex=665eda43&is=665d88c3&hm=f56e39dc3fdcc0568aaa30ee96283958693cb3909acc5dea18373633d5fc9f07&' alt='booth image'/>
      <h3 className='mt-[140px]'>Please enter your booth number</h3>
      <input className='w-[150px] h-[30px] border-2 border-black mt-5' />
      <button className='w-[70px] h-[30px] rounded-lg mt-[100px] bg-[#FEC39C]'>Go</button>
    </div>
  )
}

export default Booth
