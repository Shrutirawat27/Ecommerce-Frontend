import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
    <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
