import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets.js";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  console.log("Appointments:", appointments); // Debug log

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh]   ">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments?.length > 0 ? (
          appointments.reverse().map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full"
                  src={item?.userData?.image || assets.default_user_image}
                  alt=""
                />
                <p>{item?.userData?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs inline border border-[#5F6FFF] px-2 rounded-full">
                  {item?.payment ? "Online paid" : "CASH"}
                </p>
              </div>
              <p className="max-sm:hidden">{calculateAge(item?.userData?.dob || "")}</p>
              <p>
                {slotDateFormat(item?.slotDate || "")}, {item?.slotTime || ""}
              </p>
              <p>
                {currency}
                {item?.amount || "0"}
              </p>
              {item?.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item?.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <img
                    onClick={() => cancelAppointment(item?._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                  <img
                    onClick={() => completeAppointment(item?._id)}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-5">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;