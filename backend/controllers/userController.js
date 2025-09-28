import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { transporter } from "../config/nodeMailer.js";
import { WELCOME_EMAIL_TEMPLATE } from "../config/emailTemplate.js";
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";




export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Empty field check
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    // Password validation
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a strong password (min 8 chars)",
      });
    }

    // Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    // 📧 Send Welcome Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "🎉 Welcome to Prescripto!",
      text: `Hi ${newUser.name}, welcome to Prescripto! 🎉  
We’re excited to have you on board. You can now explore our platform, manage appointments, and connect with trusted healthcare professionals.  
`,
      html: WELCOME_EMAIL_TEMPLATE
        .replace("{{name}}", newUser.name)
        .replace("{{email}}", newUser.email),
    };

    await transporter.sendMail(mailOptions);

    // ✅ Sirf ek hi final response
    return res.json({
      success: true,
      message: "User registered successfully ",
      token,
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Empty field check
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
}; 


// api to get the user data from db
export const getProfile = async (req, res) => {
  try {
    // yahan req.userId token verify middleware se aayega
    const userData = await userModel.findById(req.userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "data missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const image_URL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: image_URL });
    }

    res.json({ success: true, message: "profile updated successfully" });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// booked appointment 
export const bookedAppointments = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId; // ✅ get userId from token

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) { // ✅ fix typo
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};


export const listAppointments = async (req, res) => {
  try {
    const userId = req.userId; 

    const appointments = await appointmentModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};



// api to cancelled appointment 

export const cancelAppointment = async(req,res)=>{
  try {
    const {appointmentId} = req.body
    const userId = req.userId;
    const appointmentData = await appointmentModel.findById(appointmentId)
    // verify appointment user
    if(appointmentData.userId !== userId){
      return res.json({success:false, message:"unauthrized action"})
    }
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


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// payment integration (Stripe)
export const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.canceled) {
      return res.json({ success: false, message: "Appointment not found or cancelled" });
    }

    if (!appointmentData.amount) {
      return res.json({ success: false, message: "Amount not set for this appointment" });
    }

    // Stripe checkout session create
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Appointment Payment" },
            unit_amount: appointmentData.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
       success_url: `http://localhost:5173/receipt/${appointmentData._id}`,
      cancel_url: "http://localhost:5173/my-appointments",
    });

    // ✅ Save sessionId in appointment document
    appointmentData.sessionId = session.id;
    await appointmentData.save();

    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};



export const verifyStripePayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (!appointmentData.sessionId) {
      return res.json({ success: false, message: "No Stripe session found" });
    }

    // Stripe session retrieve
    const session = await stripe.checkout.sessions.retrieve(appointmentData.sessionId);

    // Payment check
    if (session.payment_status === "paid" && !appointmentData.payment) {
      appointmentData.payment = true;
      await appointmentData.save();
    }

    // ✅ Receipt generation
    // Inside verifyStripePayment controller
const receipt = {
  receiptId: session.id,
  userName: appointmentData.userData?.name || "N/A",
  userImage: appointmentData.userData?.image || null,        // Add this
  doctorName: appointmentData.docData?.name || "N/A",
  doctorSpeciality: appointmentData.docData?.speciality || "N/A",
  doctorImage: appointmentData.docData?.image || null,       // Add this
  amount: appointmentData.amount,
  status: appointmentData.payment ? "Paid" : "Unpaid",
  slotDate: appointmentData.slotDate,
  slotTime: appointmentData.slotTime,
  date: new Date(appointmentData.date).toLocaleString(),
};


    return res.json({
      success: true,
      message: "Payment verified",
      paymentStatus: appointmentData.payment,
      receipt,
    });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};


export default { registerUser, loginUser, getProfile, updateProfile, bookedAppointments,listAppointments, cancelAppointment, verifyStripePayment };
