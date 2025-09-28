import validator from 'validator';
import bcrypt from 'bcryptjs'; 
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
// api to add the doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, education, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    // ✅ proper validation
    if (!name || !email || !password || !speciality || !education || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: 'missing details' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'please enter a valid email' });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'password must be at least 8 characters long' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ image upload fix
    let imageUrl = '';
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      imageUrl = imageUpload.secure_url;
    }

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      education,
      experience,
      about,
      fees,
      address: JSON.parse(address), // ✅ typo fix (adress → address)
      date: Date.now(), // ✅ typo fix (Data → Date)
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: 'doctor is added successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
     
      const token = jwt.sign(
        { email }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

   
      return res.json({ success: true, message: 'admin logged in successfully', token });
    } else {
      return res.json({ success: false, message: 'invalid credentials' });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get all doctor from db
const allDoctors = async (req,res)=>{
  try {
    const doctors = await doctorModel.find({}).select("-password")
    res.json({success:true,doctors})
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  }
}

 const appointmentAdmin = async (req,res)=>{
  try {
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})
  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  }
}

 const appointmentCancel = async(req,res)=>{
  try {
    const {appointmentId} = req.body
   
    const appointmentData = await appointmentModel.findById(appointmentId)
  
    await appointmentModel.findByIdAndUpdate(appointmentId,{canceled:true})

    // releasing doctor slot
     const {docId,slotDate,slotTime} = appointmentData
     const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
     slots_booked[slotDate] = slots_booked[slotDate].filter(e=> e !== slotTime)
     await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({success:true,message:"appointment cancelled successfully!"})
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}

const adminDashboard = async(req,res)=>{
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});
    const dashedData = {
      doctors:doctors.length,
      appointments: appointments.length,
      patient: users.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }
    res.json({success:true,data:dashedData})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

 

export { addDoctor,adminLogin, allDoctors,appointmentAdmin,appointmentCancel,adminDashboard };
