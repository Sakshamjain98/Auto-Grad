import React from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
 
const Keycards = (props) => {
    
    
    
  return (
    <div id='img-key' className='flex-col justify-center items-center md:w-auto md:h-auto h-[350px] inline'>
      <img src={props.img} alt="" />
      <h1 className='text-center text-2xl font-medium'>{props.text}</h1>
    </div>
  )
}

export default Keycards
