import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets_admin/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, dashData, getDashData, cancelAppointment } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="w-full max-w-7xl mx-auto p-5">
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">
          Admin Dashboard
        </h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Doctors Card */}
          <div className="flex items-center p-5 rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <img
              src={assets.doctor_icon}
              alt="Doctors"
              className="w-12 h-12 mr-4"
            />
            <div>
              <p className="text-2xl font-bold">{dashData.doctors}</p>
              <p className="text-sm">Doctors</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="flex items-center p-5 rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-teal-500 text-white">
            <img
              src={assets.appointment_icon}
              alt="Appointments"
              className="w-12 h-12 mr-4"
            />
            <div>
              <p className="text-2xl font-bold">{dashData.appointments}</p>
              <p className="text-sm">Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="flex items-center p-5 rounded-lg shadow-lg bg-gradient-to-r from-pink-500 to-red-500 text-white">
            <img
              src={assets.patients_icon}
              alt="Patients"
              className="w-12 h-12 mr-4"
            />
            <div>
              <p className="text-2xl font-bold">{dashData.patient}</p>
              <p className="text-sm">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white rounded-lg shadow mt-10">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b rounded-t">
            <img
              src={assets.list_icon}
              alt="List Icon"
              className="w-6 h-6"
            />
            <p className="font-semibold text-gray-700">Latest Bookings</p>
          </div>

          {/* Appointment List */}
          <div className="divide-y">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3"
              >
                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.docData.image}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.docData.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>

                {/* Status / Action */}
                <div>
                  {item.canceled ? (
                    <p className="text-red-500 text-xs font-medium">
                      Cancelled
                    </p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">
                      Completed
                    </p>
                  ) : (
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      src={assets.cancel_icon}
                      alt="Cancel"
                      className="w-8 h-8 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
