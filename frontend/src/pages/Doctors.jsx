import React, { useEffect, useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])
  const navigate = useNavigate()
  const[showFilter, setShowFilter] = useState(false)
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="px-3 sm:px-0 pt-5">
      <p className="text-gray-600 mb-5">Browse Through The Doctor Specialist</p>
      <div className="flex gap-6">
 <div className="sm:hidden mt-4">
  <button
    className={`w-full py-2 px-4 border rounded-md text-sm font-medium transition-all duration-300 ${
      showFilter
        ? "bg-[#5f6FFF] text-white border-[#5f6FFF]"
        : "bg-white text-gray-700 border-gray-300"
    } hover:bg-[#5f6FFF] hover:text-white`}
    onClick={() => setShowFilter((prev) => !prev)}
  >
    Filters
  </button>
</div>

        {/* Left Sidebar */}
        <div className={`w-1/4 flex flex-col gap-3 ${showFilter? 'flex': 'hidden sm:flex'}`}>
  <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} 
    className={`border p-2 rounded cursor-pointer ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''}`}
  >
    General physician
  </p>

  <p 
    onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')}  
 className={`border p-2 rounded cursor-pointer ${speciality === 'Gynecologist' ? 'bg-indigo-100 text-black' : ''}`}
  >
    Gynecologist
  </p>

  <p 
    onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')}  
   className={`border p-2 rounded cursor-pointer ${speciality === 'Dermatologist' ? 'bg-indigo-100 text-black' : ''}`}
  >
    Dermatologist
  </p>

  <p 
    onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')}  
   className={`border p-2 rounded cursor-pointer ${speciality === 'Pediatricians' ? 'bg-indigo-100 text-black' : ''}`}
  >
    Pediatricians
  </p>

  <p 
    onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')}  
 className={`border p-2 rounded cursor-pointer ${speciality === 'Neurologist' ? 'bg-indigo-100 text-black' : ''}`}
  >
    Neurologist
  </p>

  <p 
    onClick={() => speciality === 'Physiotherapist' ? navigate('/doctors') : navigate('/doctors/Physiotherapist')}  
    className={`border p-2 rounded cursor-pointer ${speciality === 'Physiotherapist' ? 'bg-indigo-100 text-black' : ''}`}
  >
    Physiotherapist
  </p>
</div>


       
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterDoc.map((item, index) => (
            <div
              key={index}
             onClick={() => navigate(`/appointments/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
            > 
              <img className="bg-blue-50 w-full" src={item.image} alt={item.name} />
              <div className="p-4">
               <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                <p className={`w-2 h-2 ${item.available ? "bg-green-500" : "bg-gray-500"} rounded-full`}></p>
                <p>{item.available ? "Available" : "Not Available"}</p>
              </div>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
