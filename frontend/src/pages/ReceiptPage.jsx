import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReceiptPage = () => {
  const { appointmentId } = useParams();
  const { backendUrl, token } = useContext(AppContext);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch receipt from backend
  const fetchReceipt = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-stripe-payment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        setReceipt(data.receipt);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) fetchReceipt();
  }, [appointmentId]);

  // Download receipt as PDF
  const downloadReceipt = () => {
    const input = document.getElementById("receipt-container");
    if (!input) {
      toast.error("Receipt not ready for download!");
      return;
    }

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt_${receipt?.receiptId}.pdf`);
    });
  };

  if (loading)
    return <p className="text-center mt-10 text-[#4b5563]">Loading receipt...</p>;
  if (!receipt)
    return <p className="text-center mt-10 text-[#b91c1c]">Receipt not found!</p>;

  return (
    <div
      className="max-w-3xl mx-auto mt-12 p-6 bg-[#ffffff] shadow-lg rounded-lg border border-[#d1d5db]"
      id="receipt-container"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-[#1f2937]">
        Payment Receipt
      </h2>

      {/* Doctor Info */}
      <div className="flex gap-4 p-4 bg-[#f9fafb] border border-[#d1d5db] rounded-lg mb-6 items-center">
        <img
          src={receipt.doctorImage || "https://via.placeholder.com/80"}
          alt={receipt.doctorName}
          className="w-20 h-20 rounded-full object-cover border border-[#9ca3af]"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#1f2937]">
            {receipt.doctorName}
          </h3>
          <p className="text-[#4b5563]">{receipt.doctorSpeciality}</p>
          <p className="text-[#374151] font-medium mt-1">Fees: ${receipt.amount}</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="flex gap-4 p-4 bg-[#f9fafb] border border-[#d1d5db] rounded-lg mb-6 items-center">
        <img
          src={receipt.userImage || "https://via.placeholder.com/80"}
          alt={receipt.userName}
          className="w-20 h-20 rounded-full object-cover border border-[#9ca3af]"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#1f2937]">Patient Info</h3>
          <p className="text-[#374151] mt-2">
            <span className="font-medium">Name:</span> {receipt.userName}
          </p>
          <p className="text-[#374151] mt-1">
            <span className="font-medium">Slot Date:</span> {receipt.slotDate}
          </p>
          <p className="text-[#374151] mt-1">
            <span className="font-medium">Slot Time:</span> {receipt.slotTime}
          </p>
          <p className="text-[#374151] mt-1">
            <span className="font-medium">Booking Date:</span> {receipt.date}
          </p>
        </div>
      </div>

      {/* Payment Status */}
      <div className="p-4 bg-[#d1fae5] border-l-4 border-[#10b981] rounded-lg text-center mb-6">
        <h3 className="text-xl font-bold text-[#047857]">
          Status: {receipt.status}
        </h3>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <button
          onClick={downloadReceipt}
          className="mt-4 w-full py-2 font-semibold rounded transition-all bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;
