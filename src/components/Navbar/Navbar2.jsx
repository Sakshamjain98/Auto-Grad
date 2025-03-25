import React from 'react'
import { Link } from 'react-router-dom'
const Navbar2 = () => {
  return (
      <div className='flex flex-row justify-between px-3'>
      <Link to='/'><img src="/src/assets/pics-and-videos/PHOTO-2025-03-24-20-59-26.jpg" className='md:w-[240px] w-[30vw] h-auto md:h-[136px]' alt="" /></Link>
      <h2 id='vidit' className='hidden md:block md:pt-12 md:text-2xl '><Link to='/features'>Features</Link></h2>
      <h2 id='vidit' className='hidden md:block md:text-2xl md:pt-12'><Link to='/trialsessions'>Trial Session</Link></h2>
        <h2 id='vidit' className='hidden md:block md:text-2xl md:pt-12'><Link to='/about'>About Us</Link></h2>
    </div>
  )
}

export default Navbar2
