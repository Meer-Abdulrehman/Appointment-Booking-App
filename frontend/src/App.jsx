import React from 'react'
import {Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import Login from './pages/Login'
import MyAppointments from './pages/MyAppointments'
import Appointments from './pages/Appointments';
import Navbar from './components/Navbar'
import Fotter from './components/Fotter';
import ReceiptPage from './pages/ReceiptPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path ="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path ="/about" element={<About />} />
        <Route path ="/contact" element={<Contact />} />
        <Route path ="/my-profile" element={<MyProfile />} />
        <Route path ="/login" element={<Login />} />
        <Route path ="/my-appointments" element={<MyAppointments />} />
       <Route path="/appointments/:docId" element={<Appointments />} />
       <Route path="/receipt/:appointmentId" element={<ReceiptPage />} />
      </Routes>
        <Fotter />
    
    </div>
  )
}

export default App