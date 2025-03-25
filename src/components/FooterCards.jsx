import React from 'react'

const FooterCards = (props) => {
  return (
    <div className='flex justify-center items-center p-3.5 mx-21 hover:border-purple-800 transition-colors duration-500 border-purple-300 border-4 rounded-3xl'>
      <h1>{props.text}</h1>
    </div>
  )
}

export default FooterCards
