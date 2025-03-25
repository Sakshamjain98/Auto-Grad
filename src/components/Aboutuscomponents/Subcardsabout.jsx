import React from 'react'

const Subcardsabout = (props) => {
  return (
    <div className='flex flex-col gap-7 bg-gray-100 rounded-2xl md:w-[40%] border-purple-400 border-b-4 '>
        <h1 className='text-center md:pt-4 mt-5 text-4xl text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 transition-colors duration-500 hover:bg-gradient-to-l hover:from-rose-400 hover:via-fuchsia-500 hover:to-indigo-500 '>{props.head}</h1>
      <div className='bg-gray-200 rounded-2xl mx-10 md:text-3xl p-7 pb-6 mb-5'>
        {props.desc}
      </div>
    </div>
  )
}

export default Subcardsabout
