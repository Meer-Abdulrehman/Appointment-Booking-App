import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, default: Date.now },
  canceled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  sessionId: { type: String, default: "" } // ✅ Stripe session ID store karne ke liye
});

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);
export default appointmentModel;
