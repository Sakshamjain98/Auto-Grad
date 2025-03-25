import React, { useEffect } from 'react'
import Headers from './Headers'
import Ai_assitant from './Ai-assitant'
import Card from './Card'
import KeyBenefits from './KeyBenefits'
import Keycards from './Keycards'
import HomeFooter from './HomeFooter'
import Aboutusfooter from '../Aboutuscomponents/Aboutusfooter'

import gsap from 'gsap'
const Home = () => {
    
  return (
    <>
    <div id='fff'>
      <Headers></Headers>
      <Ai_assitant />
    </div>
    <div className='flex flex-col md:flex-row px-10  w-full gap-8 justify-center '>
    <Card img='/src/assets/pics-and-videos/image.png' text='Teachers' desc='Say goodbye to manual grading and save hours to focus on inspiring minds.'/>
    <Card img='/src/assets/pics-and-videos/image.png' text='Admin' desc='Digitise & automate evaluations, ensuring a seamless AI-driven assessment.'/>
    <Card img='/src/assets/pics-and-videos/image.png' text='Students' desc='Get instant, intelligent feedback that helps you learn faster & improve smarter.'/>
    </div>
    <KeyBenefits></KeyBenefits>
    <div className='flex justify-around flex-col md:flex-row gap-10 p-10'>
    <Keycards img='/src/assets/pics-and-videos/image copy 2.png' text='Increased Efficiency'></Keycards>
    <Keycards img='/src/assets/pics-and-videos/image copy 3.png' text='Man-Power Reduction'></Keycards>
    <Keycards img='/src/assets/pics-and-videos/image copy 3.png' text='Scalable Solutions'></Keycards>
    <Keycards img='/src/assets/pics-and-videos/image copy 2.png' text='Time Saving'></Keycards>
    </div>
    <HomeFooter></HomeFooter>
    <div className='flex flex-col justify-center items-center mt-7 bg-[radial-gradient(ellipse_at_center,_#D3D3FF,_#800080,_#000000)] w-full h-[40vh] '>
       <Aboutusfooter></Aboutusfooter>
    </div>
    </>
  )
}

export default Home
