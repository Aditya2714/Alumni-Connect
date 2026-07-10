import React from 'react'
import Topbar from './Components/Topbar'
import { Outlet } from 'react-router-dom'
import Footer from './Components/Footer'
import { ToastContainer } from 'react-toastify'

function Layout() {
  return (
    <>
      <ToastContainer/>
  
      <Topbar />
      <Outlet />
     

      <Footer />
    </>
  )
}

export default Layout
