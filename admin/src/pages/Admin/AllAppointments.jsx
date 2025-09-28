import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const AllAppointments = () => {
  const { aToken, getAllAppointments, appointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  // Safe calculateAge function
  const CalculateAge = (dob) => {
    if (!dob) return ''
    const birthDate = new Date(dob)
    if (isNaN(birthDate)) return ''
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-4 text-lg font-medium text-gray-700'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm'>
        {/* Table Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-100 text-gray-600 font-semibold gap-x-4'>
          <p className='text-left'>#</p>
          <p className='text-left'>Patient Name</p>
          <p className='text-center'>Age</p>
          <p className='text-left'>Date & Time</p>
          <p className='text-left'>Doctor Name</p>
          <p className='text-right'>Fees</p>
          <p className='text-center'>Actions</p>
        </div>

        {/* Table Rows */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap justify-between max-sm:gap-4 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 gap-x-4'
          >
            <p className='text-left'>{index + 1}</p>

            {/* Patient */}
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8 rounded-full object-cover' src={item.userData.image} alt='' />
              <p className='truncate max-w-[130px]'>{item.userData.name}</p>
            </div>

            {/* Age */}
            <p className='text-center'>{CalculateAge(item.userData.dob)}</p>

            {/* Slot Date & Time */}
            <p className='text-left truncate max-w-[150px]'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            {/* Doctor */}
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8 rounded-full bg-gray-200 object-cover' src={item.docData.image} alt='' />
              <p className='truncate max-w-[130px]'>{item.docData.name}</p>
            </div>

            {/* Fees */}
            <p className='text-right'>{currency}{item.amount}</p>

            {/* Actions */}
            <div className='text-center'>
              {item.canceled
                ? <p className='text-red-500 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium'>Completed</p>:
                <img onClick={() => cancelAppointment(item._id)} className='w-8 h-8 cursor-pointer' src={assets.cancel_icon} alt='' />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments
