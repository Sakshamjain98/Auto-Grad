import React, { useEffect } from 'react'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
const Headers = () => {
    useGSAP(()=>{
        gsap.from('#home-animate',{
            y:100,duration:1.2,opacity:0,
        })
    })
  return (
    <><div className='flex flex-col justify-center items-center md:gap-5 gap-1 mt-10'>
      <h2 id='home-animate' className='text-gray-500 md:text-2xl  text-[55%] '>AI-powered teacher assistant for automated grading and personalized feedback</h2>
      <h1 id='home-animate' className='md:text-7xl text-2xl font-bold '>Seamless Learning</h1>
      <h1 id='home-animate' className='md:text-7xl text-2xl font-bold '>experience & outcomes <span id='home-animate' className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 transition-all duration-500 hover:bg-gradient-to-l hover:from-rose-400 hover:via-fuchsia-500 hover:to-indigo-500">
  using AI
</span>

</h1>
      <button className='md:mt-[40px] mt-3.5 bg-black text-white text-1xl md:w-[180px] md:h-[50px] h-[30px] w-[158px]   rounded-2xl hover:bg-slate-800'>Create Account</button>
      <div className='flex flex-row gap-10 justify-center md:pl-14 pl-5 my-2  text-gray-500'>
      
        <h4 className='text-[80%] md:text-2xl'>30 Days Free Trial</h4>
        <h4 className='text-[80%] md:text-2xl' >|</h4>
        <h4 className='text-[80%] md:text-2xl'>No Credit Card Required</h4>
      </div>

    </div>

    </>
  )
}

export default Headers
