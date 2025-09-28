import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Fotter = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        
        {/* Left section */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt='' />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Center section */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About Us</li>
            <li>Services</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Last section */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+92-3204335746</li>
            <li>abdulrehmantech.me@gmail.com</li>
          </ul>
        </div>

      </div>

      {/* Copyright section */}
      <div className='text-center text-gray-600 text-sm'>
        <hr className='mb-4' />
        <p className='py-5 text-sm text-center'>© 2025 Abdul Rehman Tech. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Fotter
