import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_admin/assets.js';
import { AdminContext } from '../context/AdminContext.jsx';
import axios from 'axios'
import { toast } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // ✅ react-icons
import { DoctorContext } from '../context/DoctorContext.jsx';

const Login = () => {
  const [state, setState] = useState('Admin')
  const { setAToken, backendUrl } = useContext(AdminContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // ✅ eye toggle state
  const {setDToken} = useContext(DoctorContext)
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          console.log(data.token);
          
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'>
          <span className='text-[#5f6FFF]'>{state}</span> Login
        </p>

        <div className='w-full'>
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className='border border-[#dadada] rounded w-full p-2 mt-1' 
            type='email' 
            required 
          />
        </div>

        <div className='w-full relative'>
          <p>Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className='border border-[#dadada] rounded w-full p-2 mt-1 pr-10' 
            type={showPassword ? 'text' : 'password'} // ✅ toggle type
            required 
          />
          <span 
            className='absolute right-2 top-[38px] cursor-pointer text-gray-500'
            onMouseDown={() => setShowPassword(true)}   // 👁 hold → show password
            onMouseUp={() => setShowPassword(false)}    // 👁 release → hide password
            onMouseLeave={() => setShowPassword(false)} // cursor bahar → hide
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        <button className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base cursor-pointer'>
          Login
        </button>

        {state === 'Admin'
          ? <p>Doctor Login? <span className='text-[#5f6fff] underline cursor-pointer' onClick={() => setState('Doctor')}>Click Here</span></p>
          : <p>Admin Login? <span className='text-[#5f6fff] underline cursor-pointer' onClick={() => setState('Admin')}>Click Here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
