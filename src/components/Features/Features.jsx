import React from 'react'
import FooterCards from '../FooterCards'
const Features = () => {
  return (
    <>
    <div className='text-center flex justify-center items-center md:text-5xl font-semibold text-2xl'>
      <h1 className='border-4 w-[40%]  border-purple-600 rounded-2xl md:w-[50%] md:py-6 py-2'>Features</h1>
    </div>
    <div className='flex flex-col mt-10 md:mt-16 md:text-2xl text-[70%] gap-5 md:bg-gray-100 rounded-2xl mx-1.5 py-4'>
        <FooterCards text='AI-Powered Grading – Automatically evaluates assignments, essays, MCQs, and handwritten submissions.'></FooterCards>
        <FooterCards text='Personalized Feedback – Provides students with AI-driven, detailed insights on mistakes and improvements.'></FooterCards>
        <FooterCards text='Manual Grade Adjustments – Teachers can review, edit, and override AI-generated grades if needed.'></FooterCards>
        <FooterCards text='Assignment & Answer Key Management – Upload, distribute, and store assignments and solutions.'></FooterCards>
        <FooterCards text='Adaptive Learning Suggestions – AI recommends study materials based on weak areas.'></FooterCards>
        <FooterCards text='Instant Feedback & Reports – No waiting—AI generates real-time performance analysis.'></FooterCards>
    </div>
    </>
  )
}

export default Features
