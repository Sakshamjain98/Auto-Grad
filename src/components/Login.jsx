import React from 'react'

const Login = () => {
  return (
    <div className='flex flex-col md:flex-row'>
      <div id="left" className='md:w-[50%] md:h-[87vh] flex justify-center items-center bg-purple-200'>
        <div className='flex flex-col gap-7'>
            <h1 className='text-5xl'>Login</h1>
            <div>
                <h2 className='text-3xl'>E-mail</h2>
                <input type="e-mail" />
            </div>
            <div>
                <h2 className='text-3xl'>Password</h2>
                <input type="text" />
            </div>
            <button>Login</button>
        </div>
      </div>
      <div id="right" className='md:w-[50%] md:h-[87vh] bg-amber-500'>
        asd
      </div>
    </div>
  )
}

export default Login
