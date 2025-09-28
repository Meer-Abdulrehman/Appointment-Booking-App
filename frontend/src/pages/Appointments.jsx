import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
const Appointments = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol,backendUrl,token, getDoctorsData } = useContext(AppContext)
  const [docInfo, setDocInfo] = useState(null)
  const [docSlot, setDocSlot] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const navigate =useNavigate()
  // ✅ Doctor Info
  const fetchDocInfo = async () => {
    const foundDoc = doctors.find(doc => doc._id === docId)
    if (foundDoc) {
      setDocInfo(foundDoc)
    }
  }

  // ✅ Slot Calculation
  const getAvailableSlots = async () => {
    let today = new Date()
    let allSlots = []

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date(today)
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
       let day = currentDate.getDate()
let month = currentDate.getMonth() + 1
let year = currentDate.getFullYear()
const slotDate = `${year}-${month}-${day}`

// Make sure booked slots are in same HH:MM format (24-hour)
const slotTime = formattedTime

const bookedSlotsForDate = docInfo.slots_booked[slotDate] || []  // empty array if none
const isSlotAvailable = !bookedSlotsForDate.includes(slotTime)

if (isSlotAvailable) {
  timeSlots.push({
    datetime: new Date(currentDate),
    time: slotTime
  })
}
       
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      allSlots.push(timeSlots)
    }
    setDocSlot(allSlots)
  }
const bookAppointment = async () => {
  if (!token) {
    toast.warn('Login to book appointment')
    return navigate('/login')
  }
  try {
    const date = docSlot[slotIndex][0].datetime

    // Format slotDate as YYYY-MM-DD
    const slotDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

    // Use the slotTime selected by user (from state)
    const slotTimeSelected = slotTime

    const { data } = await axios.post(
      backendUrl + '/api/user/booked-appointments',
      { docId, slotDate, slotTime: slotTimeSelected },
      { headers: { token } }
    )

   if (data.success) {
  toast.success('Appointment booked'); // ✅ frontend toast
  navigate('/my-appointments');
} else {
  toast.error(data.message);
}

  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId]) 

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-6">
          <div>
            <img
              className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          {/* Right Info Section */}
          <div className="flex-1 border border-gray-400 rounded-lg p-6 bg-white">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img src={assets.verified_icon} alt="verified" className="w-5" />
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div className="mt-5">
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="info" className="w-4 h-4" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}{docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Slots Section */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>

          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlot.length > 0 &&
              docSlot.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-[#5f6FFF] text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlot.length > 0 &&
              docSlot[slotIndex]?.map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-[#5f6FFF] text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button onClick={bookAppointment} className='bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6'>
            Book An Appointment
          </button>
        </div>

        {/* ✅ Related Doctors Section */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  )
}

export default Appointments
