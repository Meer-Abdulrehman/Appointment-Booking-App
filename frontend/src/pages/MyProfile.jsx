import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {toast} from 'react-toastify';
const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    // backend call yahan add karna later
    try {
      const formData = new FormData()
      formData.append("userId", userData._id);
      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',userData.address)
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)
      image && formData.append('image',image)
      const {data}= await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}})
      if(data.success){
      toast.success(data.message)
      await loadUserProfileData()
      setIsEdit(false)
      setImage(false)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  return (
    userData && (
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl border border-gray-200">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center gap-3 mb-8">
          {isEdit ? (
            <label htmlFor="image">
              <div className="relative cursor-pointer">
                <img
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile Preview"
                  className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md object-cover"
                />
                <img
                  src={assets.upload_icon}
                  alt="Upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full p-1 shadow-md"
                />
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img
              src={userData.image}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md object-cover"
            />
          )}

          {/* Name */}
          {isEdit ? (
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="text-xl font-semibold text-gray-800 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-xl font-semibold text-gray-800">
              {userData.name}
            </p>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Contact Info */}
        <div className="mb-8">
          <p className="text-lg font-semibold text-blue-600 mb-4">
            CONTACT INFORMATION
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-700">{userData.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700">{userData.phone}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700">{userData.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="mb-8">
          <p className="text-lg font-semibold text-blue-600 mb-4">
            BASIC INFORMATION
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-gray-700">{userData.gender}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-700">{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center">
          {isEdit ? (
            <button
               onClick={updateUserProfileData}
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition cursor-pointer"
            >
              Save Information
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
