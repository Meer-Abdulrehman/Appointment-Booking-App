import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken, getAllDoctors])   // ✅ yahan bug fix (getAllDoctors ko bhi dependency me add kiya)

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">All Doctors</h1>
      
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {doctors.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-md p-5 text-center hover:shadow-lg transition-transform transform hover:-translate-y-1"
          >
          <div className="w-full h-56 bg-indigo-50 group-hover:bg-[#5f6FFF] rounded-xl overflow-hidden flex items-center justify-center transition-all duration-500">
  <img 
    src={item.image} 
    alt="" 
    className="w-full h-full object-cover"
  />
</div>

            <div>
              <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
            </div>

            <div className="mt-3">
              <input onChange={()=>changeAvailability(item._id)}
                type="checkbox" 
                checked={item.available} 
                readOnly
                className="w-4 h-4 accent-green-600 cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
