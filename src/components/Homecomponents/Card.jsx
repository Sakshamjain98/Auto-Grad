import React from 'react'

const Card = (props) => {
  return (
    <div className='mt-5 flex flex-col justify-center items-center gap-7 md:w-100 border-b-4 p-2 border-purple-600 rounded-2xl transition-all duration-500 hover:border-l-4'>
      <img src={props.img} alt="" className='border-b-2 border-gray-500 h-[60%]' />
      <div className='border-gray-500 border-top-2'>
      <h1 className='text-2xl font-medium text-center'>{props.text}</h1>
      <h3 className='text-[120%] md:text-2xl'>{props.desc}</h3>
      </div>
    </div>
  )
}

export default Card
