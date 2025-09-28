import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const navigate = useNavigate()

  // Fetch user appointments and verify pending payments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/list-appointments',
        { headers: { token } }
      )

      if (data.success) {
        const appts = data.appointments.reverse()
        setAppointments(appts)

        // Automatically verify pending payments
        appts.forEach(appt => {
          if (!appt.payment) verifyPaymentHandler(appt._id)
        })
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else toast.error(data.message)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  // Stripe dynamic import
  const stripePromise = import("@stripe/stripe-js").then(({ loadStripe }) =>
    loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  )

  // Pay Online button handler
  const handlePayOnline = async (appointment) => {
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error("Stripe failed to initialize.")

      // 1️⃣ Create Stripe session
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-stripe",
        { appointmentId: appointment._id },
        { headers: { token } }
      )

      if (!data.success) return toast.error(data.message)

      // 2️⃣ Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })
      if (error) throw new Error(error.message)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  // Verify payment handler using backend session info
  const verifyPaymentHandler = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/verify-stripe-payment",
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        // Update appointment payment status in UI
        setAppointments(prev =>
          prev.map(appt =>
            appt._id === appointmentId ? { ...appt, payment: true } : appt
          )
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 🔄 Auto-refresh appointments every 5 seconds
  useEffect(() => {
    if (token) {
      getUserAppointments()
      const interval = setInterval(getUserAppointments, 5000) // 5s baad backend call
      return () => clearInterval(interval)
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt='' />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address</p>
              <p className='text-xs'>{item.docData.address.line1}, {item.docData.address.line2}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-2 justify-end'>
              {/* Online Payment Pending */}
              {!item.canceled && !item.payment && !item.isCompleted && (
                <>
                  <button
                    onClick={() => handlePayOnline(item)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 cursor-pointer'>
                    Pay Online
                  </button>
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'>
                    Cancel Appointment
                  </button>
                </>
              )}

              {/* Online Paid */}
              {!item.canceled && item.payment && !item.isCompleted && (
                <>
                  <button
                    className='text-sm text-center sm:min-w-48 py-2 border rounded bg-white text-green-400 cursor-not-allowed border-green-300'>
                    Paid
                  </button>
                  <button
                    onClick={() => navigate(`/receipt/${item._id}`)}
                    className='text-sm text-center sm:min-w-48 py-2 border border-gray-600 text-gray-700 hover:bg-gray-300 rounded transition-all duration-300'>
                    View Receipt
                  </button>
                </>
              )}

              {/* Appointment Cancelled */}
              {item.canceled && (
                <button className='sm:min-w-48 py-2 border border-red-500 text-red-500 cursor-pointer'>
                  Appointment cancelled
                </button>
              )}

              {/* Appointment Completed (cash pay or online both) */}
              {!item.canceled && item.isCompleted && (
                <button className='sm:min-w-48 py-2 border border-green-400 text-green-500 font-medium rounded bg-white cursor-default'>
                  Checkup Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
