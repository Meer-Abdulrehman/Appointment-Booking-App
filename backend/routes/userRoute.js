import express from 'express';
import {registerUser,  loginUser,getProfile,updateProfile, bookedAppointments,listAppointments, cancelAppointment,paymentStripe,verifyStripePayment} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js'
const userRouter = express.Router();
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/booked-appointments',authUser,bookedAppointments)
userRouter.get('/list-appointments',authUser,listAppointments)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-stripe',authUser,paymentStripe)
userRouter.post('/verify-stripe-payment',authUser,verifyStripePayment)

export default userRouter;