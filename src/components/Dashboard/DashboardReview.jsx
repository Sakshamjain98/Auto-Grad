import React from 'react'

const DashboardReview = (props) => {
  return (
    <div className='flex-col justify-center items-center bg-amber-100 w-3xs p-6 rounded-2xl'>
      <div>
        {props.text}
      </div>
      <div className='bg-gray-300 p-3 mt-2.5 text-center rounded-2xl'>
        {props.head}
      </div>
    </div>
  )
}

export default DashboardReview
