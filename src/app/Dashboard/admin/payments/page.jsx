"use client";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock, TrendingDown } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");
  const [staffId, setStaffId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments/summary");
      const data = await res.json();
      setPayments(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!paidAmount || !staffId) {
      setMessage("Paid amount and Staff ID are required!");
      setMessageType("error");
      return;
    }

    setRecordingPayment(true);
    try {
      const res = await fetch("/api/admin/payments/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: selectedPayment.payment_id,
          paid_amount: parseFloat(paidAmount),
          staff_id: parseInt(staffId),
          remarks,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Payment recorded successfully!");
        setMessageType("success");
        setPaidAmount("");
        setStaffId("");
        setRemarks("");
        setSelectedPayment(null);
        loadPayments();
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to record payment");
      setMessageType("error");
    } finally {
      setRecordingPayment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="text-green-600" size={20} />;
      case "overdue":
        return <AlertCircle className="text-red-600" size={20} />;
      case "pending":
        return <Clock className="text-yellow-600" size={20} />;
      default:
        return <TrendingDown className="text-gray-600" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading payment data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Payment Management
      </h1>

      {/* Statistics Section */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Due",
            value: `${payments.reduce((sum, p) => sum + parseFloat(p.total_due || 0), 0).toFixed(2)} ৳`,
            color: "bg-red-50",
            icon: "💳",
          },
          {
            label: "Total Paid",
            value: `${payments.reduce((sum, p) => sum + parseFloat(p.total_paid || 0), 0).toFixed(2)} ৳`,
            color: "bg-green-50",
            icon: "✓",
          },
          {
            label: "Students with Due",
            value: payments.filter((p) => parseFloat(p.total_due) > 0).length,
            color: "bg-yellow-50",
            icon: "⚠️",
          },
          {
            label: "Total Students",
            value: payments.length,
            color: "bg-blue-50",
            icon: "👥",
          },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Details Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Reg. No
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Hall / Room
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Total Due
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Total Paid
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Pending Months
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {payment.first_name} {payment.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment.student_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment.hall_name
                      ? `${payment.hall_name} / ${payment.room_no}`
                      : "Not Allocated"}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600 text-right">
                    {parseFloat(payment.total_due).toFixed(2)} ৳
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">
                    {parseFloat(payment.total_paid).toFixed(2)} ৳
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      {payment.pending_months}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(
                        parseFloat(payment.total_due) > 0 ? "pending" : "paid",
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          parseFloat(payment.total_due) > 0
                            ? "pending"
                            : "paid",
                        )}`}
                      >
                        {parseFloat(payment.total_due) > 0 ? "DUE" : "PAID"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
