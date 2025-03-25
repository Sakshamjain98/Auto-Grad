import React from 'react'

const Aboutuscard = () => {
  return (
    <div className='flex flex-col justify-center items-center mt-6  md:gap-8 gap-3'>
      <img src="/src/assets/pics-and-videos/study.png" className='w-[80%] md:w-[60%] border-4 border-purple-500 rounded-2xl' alt="" />
      <h1 className='md:text-5xl text-3xl font-semibold text-gray-500 md:mt-25'>About Us</h1>
      <h2 className='md:text-4xl mx-3 text-slate-800 px-6'>Education isn’t just about grades—it’s about growth, insight, and transformation. At AutoGrad, we’re on a mission to redefine learning with the power of AI, making education more efficient, insightful, and student-focused.</h2>
    </div>

  )
}

export default Aboutuscard
