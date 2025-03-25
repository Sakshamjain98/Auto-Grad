import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Home from './components/Homecomponents/Home'
import About from './components/Aboutuscomponents/About'
import Features from './components/Features/Features'
import Navbar from './components/Navbar/Navbar'
import Navbar2 from './components/Navbar/Navbar2'
import Login from './components/Login'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  const router=createBrowserRouter([
    {path:"/",element: <div><Navbar /><Home /></div>},
    {path:"/about",element:<div><Navbar /><About /></div>},
    {path:"/features",element:<div><Navbar /><Features /></div>},
    {path:"/login",element:<div><Navbar2 /><Login/></div>},
    {path:"/dashboard",element:<div><Navbar/><Dashboard/></div>},
    {path:'/dashboardteacher',element:<div><Navbar2/></div>}
  ]);
  return (
    
    <>
      <RouterProvider router={router}></RouterProvider>
     
    </>
  )
}

export default App
