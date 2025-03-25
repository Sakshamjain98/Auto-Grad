import React from 'react'
import FooterCards from './FooterCards'
const Review = (props) => {
  return (
    <div>
      <FooterCards>{props.text}</FooterCards>
    </div>
  )
}

export default Review
