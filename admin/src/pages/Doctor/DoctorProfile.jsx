import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        docId: profileData._id,
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
        about: profileData.about, // new addition
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-[#5F6FFF]/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* Name, Degree, Experience */}
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>

            {/* About */}
            <div className="mt-4">
              <p className="text-sm font-medium text-neutral-800">About:</p>
              {isEdit ? (
                <textarea
                  className="w-full mt-1 p-2 border rounded text-sm"
                  rows={3}
                  value={profileData.about}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      about: e.target.value,
                    }))
                  }
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1 max-w-[700px]">
                  {profileData.about}
                </p>
              )}
            </div>

            {/* Fees */}
            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    className="border px-2 py-1 rounded text-sm"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            {/* Address */}
            <div className="flex gap-2 mt-4 text-sm">
              <p className="font-medium">Address:</p>
              <div>
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      className="border px-2 py-1 mb-2 rounded block"
                      placeholder="Line 1"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                      value={profileData.address.line1}
                    />
                    <input
                      type="text"
                      className="border px-2 py-1 rounded block"
                      placeholder="Line 2"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                      value={profileData.address.line2}
                    />
                  </>
                ) : (
                  <p>
                    {profileData.address.line1}
                    <br />
                    {profileData.address.line2}
                  </p>
                )}
              </div>
            </div>

            {/* Available Checkbox */}
            <div className="flex gap-2 items-center mt-4">
              <input
                type="checkbox"
                checked={profileData.available}
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
              />
              <label className="text-sm">Available</label>
            </div>

            {/* Action Buttons */}
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-[#5F6FFF] text-sm rounded-full mt-5 hover:bg-[#5F6FFF] hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-[#5F6FFF] text-sm rounded-full mt-5 hover:bg-[#5F6FFF] hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
  