import React from 'react'

import DashboardReview from '../Dashboard/DashboardReview'
import Assignments from '../Dashboard/Assignments'
const Dashboard = () => {
  return (
    <>
    <div className='flex'>
      <div id='left' className='flex-col justify-center  items-center'>
        <h1 className='md:text-8xl text-6xl mt-14 px-8 font-bold'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 transition-all duration-500 hover:bg-gradient-to-l hover:from-rose-400 hover:via-fuchsia-500 hover:to-indigo-500'>Auto</span>Grad
        </h1>
        <h2 className='w-[80%]  px-8 text-2xl md:mt-16 mt-8 md:text-3xl'>
        The AutoGrad Dashboard will serve as a central hub for teachers, students, and admins, providing real-time insights, automated grading, and AI-powered feedback.
        </h2>
        <div className='flex mt-7'>
            <input type="text" className='w-[50%] text-2xl border-4 mx-7 rounded-3xl 'placeholder='Upload Assignment' />
            <button className='bg-amber-300 w-[20%]  rounded-2xl'>Upload</button>
        </div>
      </div>
      <div id='right' className='flex justify-center items-center mx-10 mt-12 md:block hidden'>
            <img src="/src/assets/pics-and-videos/image copy 6.png" alt="" />
      </div>
      
    </div>
    <div className='flex md:flex-row flex-col justify-between mt-20 mb-30 mx-9'>
        <div className='flex gap-10 mx-6 md:flex-row md:justify-between flex-col'>
        <h2 className='md:text-7xl text-3xl mt-4'>Top Student Reviews</h2>
        <DashboardReview head='Siddarth' text='The AI feedback is accurate and helps students improve faster.'></DashboardReview>
        <DashboardReview head='Siddarth' text='The AI feedback is accurate and helps students improve faster.'></DashboardReview>
        <DashboardReview head='Siddarth' text='The AI feedback is accurate and helps students improve faster.'></DashboardReview></div>
    </div>
    <div className='border-4 border-amber-950 md:mt-12 mx-16 mt-0 rounded-2xl'>
    <div className='hidden md:flex mt-6 justify-around   py-5'>
        <Assignments></Assignments>
        <Assignments></Assignments>
        <Assignments></Assignments>
        <Assignments></Assignments>
        <Assignments></Assignments>
    </div>
    <h1 className='text-center cursor-pointer md:text-3xl'>View All Assignments
    </h1>
    </div>
    

    </>
  )
}

export default Dashboard
