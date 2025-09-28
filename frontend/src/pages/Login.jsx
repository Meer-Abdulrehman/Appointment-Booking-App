import React, { useContext, useState,useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isLogin) {
        // Signup
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Registered successful!")
         
        } else {
          toast.error(data.message);
        }
      } else {
        // Login
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login Successfully!")
        
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(()=>{
  if(token){
    navigate('/')
  }

  },[token])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg bg-white">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800">
          {isLogin ? "Login" : "Create Account"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {isLogin
            ? "Please login to book appointment"
            : "Please sign up to book appointment"}
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="bg-[#5f6FFF] text-white rounded-md py-2 hover:bg-[#4c57cc] transition cursor-pointer"
          >
            {isLogin ? "Login" : "Create account"}
          </button>
        </form>

        {/* Switch */}
        <p className="text-sm text-gray-600 mt-6 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-[#5f6FFF] cursor-pointer font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
