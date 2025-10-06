import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// App config
const app = express();
const port = process.env.PORT || 4000;

// DB + Cloudinary connect
connectDB();
connectCloudinary();

// ✅ Middleware
app.use(express.json());

// ✅ CORS configuration
app.use(cors({
  origin: [
    "https://appointment-booking-app-frontend-one.vercel.app",   // deployed frontend
    "https://appointment-booking-app-admin.vercel.app"           // deployed admin
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


// ✅ API routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// ✅ Listener (only for local dev)
// ⚠️ On Vercel, you should export app instead of listening
app.listen(port, () => {
  console.log('Server is starting on port', port);
});

export default app; // ✅ Needed for Vercel
