import React, { useState,useContext } from "react";
import { assets } from "../../assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from 'axios';
const AddDoctor = () => {
  // 🔹 States for all fields
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");

  const {aToken,backendUrl} = useContext(AdminContext)
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (!docImg) {
      return toast.error("image not selected");
    }

    const formData = new FormData();
    formData.append("image", docImg);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("experience", experience);
    formData.append("fees", fees);
    formData.append("speciality", speciality);
    formData.append("education", education);
    formData.append("address", JSON.stringify([address1, address2]));
    formData.append("about", about);

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const { data } = await axios.post(
      backendUrl + "/api/admin/add-doctor",
      formData,
      { headers: { aToken } }   
    );

    if (data.success) {
      toast.success(data.message);
      setDocImg(null);
      setName("");
      setEmail("");
      setPassword("");
      setExperience("1 Year");
      setFees("");
      setSpeciality("General physician");
      setEducation("");
      setAddress1("");
      setAddress2("");
      setAbout("");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};


  return (
    <form className="m-5 w-full flex justify-center" onSubmit={handleSubmit}>
      <div className="bg-white px-8 py-8 border rounded-xl shadow-md w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <p className="mb-6 text-2xl font-semibold text-gray-700">Add Doctor</p>

        {/* Upload Section */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="upload"
              className="w-28 h-28 object-cover border-2 border-dashed border-gray-300 rounded-full p-2 hover:border-[#5f6FFF]"
            />
          </label>
          <input
            type="file"
            id="doc-img"
            hidden
            onChange={(e) => setDocImg(e.target.files[0])}
          />
          <p className="mt-2 text-sm text-gray-500 text-center">
            Upload Doctor <br /> Picture
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <p className="mb-1 font-medium">Doctor Name</p>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            />
          </div>

          {/* Email */}
          <div>
            <p className="mb-1 font-medium">Doctor Email</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            />
          </div>

          {/* Password */}
          <div>
            <p className="mb-1 font-medium">Doctor Password</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            />
          </div>

          {/* Experience */}
          <div>
            <p className="mb-1 font-medium">Experience</p>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={`${i + 1} Year`}>
                  {i + 1} Year
                </option>
              ))}
            </select>
          </div>

          {/* Fees */}
          <div>
            <p className="mb-1 font-medium">Fees</p>
            <input
              type="number"
              placeholder="Fees"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            />
          </div>

          {/* Speciality */}
          <div>
            <p className="mb-1 font-medium">Speciality</p>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            >
              <option>General physician</option>
              <option>Gynecologist</option>
              <option>Dermatologist</option>
              <option>Pediatricians</option>
              <option>Neurologist</option>
              <option>Physiotherapist</option>
            </select>
          </div>

          {/* Education */}
          <div>
            <p className="mb-1 font-medium">Education</p>
            <input
              type="text"
              placeholder="Education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            />
          </div>

          {/* Address */}
          <div>
            <p className="mb-1 font-medium">Address</p>
            <input
              type="text"
              placeholder="Address 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
              className="w-full mb-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            />
            <input
              type="text"
              placeholder="Address 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
            />
          </div>
        </div>

        {/* About */}
        <div className="mt-6">
          <p className="mb-1 font-medium">About</p>
          <textarea
            placeholder="Write About Doctor"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-[#5f6FFF] hover:bg-[#4e59d6] text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
          >
            Add Doctor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
