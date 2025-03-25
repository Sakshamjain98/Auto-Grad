import React from 'react'
import Aboutuscard from './Aboutuscard'
import Subcardsabout from './Subcardsabout'
import Aboutusfooter from './Aboutusfooter'
const About = () => {
  return (
    <>
    <div className='flex justify-center items-center md:text-5xl text-1xl md:mb-10  text-gray-400'>
      <h1>Smart Grading, Personalised Feedback – Powered by AI</h1>
    </div>
    <Aboutuscard></Aboutuscard>
    <div className='flex md:flex-row flex-col gap-2.5 mt-10 px-9'>
    <Subcardsabout head='For Teachers' desc='Education isn’t just about grades—it’s about growth, insight, and transformation. At AutoGrad, we’re on a mission to redefine learning with the power of AI, making education more efficient, insightful, and student-focused.'></Subcardsabout>
    <Subcardsabout head='For Students' desc='We provide intelligent, personalised feedback, helping them learn from mistakes, improve faster, and achieve more.'></Subcardsabout>
    <Subcardsabout head='For Admin' desc='We streamline the evaluation process, collecting answer sheets, digitising them, and ensuring a smooth transition from paper to AI-driven insights.'></Subcardsabout>
    </div>
    <div className='flex flex-col justify-center items-center mt-7 bg-[radial-gradient(ellipse_at_center,_#D3D3FF,_#800080,_#000000)] w-full h-[40vh] '>
       <Aboutusfooter></Aboutusfooter>
    </div>
    </>
  )
}

export default About
