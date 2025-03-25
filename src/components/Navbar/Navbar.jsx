import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'

const Navbar = () => {
   
    useGSAP (()=>{
        gsap.from('#vidit',{
            y:-100,opacity:0.2,stagger:0.2
        })
    })
  return (
    <div className='flex flex-row justify-between'>
      <Link to='/'><img src="/src/assets/pics-and-videos/PHOTO-2025-03-24-20-59-26.jpg" className='md:w-[240px] w-[30vw] h-auto md:h-[136px]' alt="" /></Link>
      <h2 id='vidit' className='hidden md:block md:pt-12 md:text-2xl '><Link to='/features'>Features</Link></h2>
      <h2 id='vidit' className='hidden md:block md:text-2xl md:pt-12'><Link to='/trialsessions'>Trial Session</Link></h2>
        <h2 id='vidit' className='hidden md:block md:text-2xl md:pt-12'><Link to='/about'>About Us</Link></h2>
      <div className='hidden md:block text-2xl pt-10 pr-4'>
        <button className='mr-12'><Link to='/login'>Login</Link></button>
        <button className='bg-black text-white w-[150px] h-[35px] rounded-3xl md:h-10 '>Sign Up</button>
      </div>
      <div className='md:hidden pt-2 pr-2 block'><a href="#" className="md:hidden block text-4xl cursor-pointer">&#8801;</a></div>
      
    </div>
  )
}

export default Navbar
