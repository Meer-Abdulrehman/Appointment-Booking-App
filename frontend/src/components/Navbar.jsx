import React, { useState, useContext } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData, setUserData, darkMode, setDarkMode } =
    useContext(AppContext);

  const logout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");
    toast.success("Logout Successfully!");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      {/* ✅ Logo */}
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      {/* ✅ Desktop Menu */}
      <ul className="hidden md:flex items-center gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
        </NavLink>

        {/* ✅ Admin Panel Button (Desktop) */}
        <li>
          <a
            href="http://localhost:5174/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-full border border-gray-500"
          >
            Admin Panel
          </a>
        </li>

        {/* ✅ Dark Mode Toggle Icon */}
        <li>
         
        </li>
      </ul>

      {/* ✅ Right Side */}
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            {userData.image ? (
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={userData.image}
                alt="Profile"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                {userData.name ? userData.name[0].toUpperCase() : "U"}
              </div>
            )}
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  MyAppointments
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer"
          >
            Create Account
          </button>
        )}

        {/* ✅ Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />

        {/* ✅ Mobile Sidebar */}
        {showMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="bg-white w-64 h-full p-6">
              <div className="flex justify-between items-center mb-6">
                <img className="w-32" src={assets.logo} alt="" />
                <img
                  onClick={() => setShowMenu(false)}
                  className="w-6 cursor-pointer"
                  src={assets.cross_icon}
                  alt="Close"
                />
              </div>
              <ul className="flex flex-col gap-4 font-medium text-gray-700">
                <NavLink to="/" onClick={() => setShowMenu(false)}>
                  <p className="w-28 py-2 rounded-full text-center">HOME</p>
                </NavLink>
                <NavLink to="/doctors" onClick={() => setShowMenu(false)}>
                  <p className="w-28 py-2 rounded-full text-center">
                    ALL DOCTORS
                  </p>
                </NavLink>
                <NavLink to="/about" onClick={() => setShowMenu(false)}>
                  <p className="w-28 py-2 rounded-full text-center">ABOUT</p>
                </NavLink>
                <NavLink to="/contact" onClick={() => setShowMenu(false)}>
                  <p className="w-28 py-2 rounded-full text-center">CONTACT</p>
                </NavLink>

                {/* ✅ Admin Panel Button (Mobile) */}
                <a
                  href="http://localhost:5174/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowMenu(false)}
                  className="w-full md:w-28 py-2 md:py-2 rounded-full text-center hover:bg-gray-100 bg-white text-gray-500 border border-gray-500 transition-colors duration-200"
                >
                  Admin Panel
                </a>

              
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
