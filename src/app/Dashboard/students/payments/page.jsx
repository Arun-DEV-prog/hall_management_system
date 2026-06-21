"use client";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await fetch("/api/students/payments");
      const data = await res.json();
      setPayments(data.data || []);
      setSummary(
        data.summary || {
          total_due: 0,
          total_paid: 0,
          pending_months: 0,
          paid_months: 0,
        },
      );
    } catch (error) {
      console.error(error);
      setSummary({
        total_due: 0,
        total_paid: 0,
        pending_months: 0,
        paid_months: 0,
      });
    } finally {
      setLoading(false);
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
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Status</h1>

      {/* Summary Cards */}
      {summary && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Due",
              value: `${summary.total_due.toFixed(2)} ৳`,
              color: "bg-red-50",
              icon: "💳",
            },
            {
              label: "Total Paid",
              value: `${summary.total_paid.toFixed(2)} ৳`,
              color: "bg-green-50",
              icon: "✓",
            },
            {
              label: "Pending Months",
              value: summary.pending_months,
              color: "bg-yellow-50",
              icon: "⏱️",
            },
            {
              label: "Paid Months",
              value: summary.paid_months,
              color: "bg-blue-50",
              icon: "📅",
            },
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.color} rounded-lg shadow p-6`}>
              <p className="text-gray-600 text-sm font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Payment History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Monthly Payment History
        </h2>

        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No payment records yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(payment.month).toLocaleDateString("en-BD", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        Due:{" "}
                        {new Date(payment.due_date).toLocaleDateString("en-BD")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      payment.status,
                    )}`}
                  >
                    {payment.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Charged Amount</p>
                    <p className="text-lg font-bold text-gray-900">
                      {parseFloat(payment.amount).toFixed(2)} ৳
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Paid Amount</p>
                    <p className="text-lg font-bold text-green-600">
                      {parseFloat(payment.paid_amount || 0).toFixed(2)} ৳
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Pending Amount</p>
                    <p className="text-lg font-bold text-red-600">
                      {parseFloat(payment.pending_amount || 0).toFixed(2)} ৳
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Paid On</p>
                    <p className="text-lg font-bold text-gray-900">
                      {payment.payment_date
                        ? new Date(payment.payment_date).toLocaleDateString(
                            "en-BD",
                          )
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Status Alert */}
      {summary && summary.total_due > 0 && (
        <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-6 rounded">
          <div className="flex items-start gap-4">
            <AlertCircle
              className="text-red-600 flex-shrink-0 mt-1"
              size={24}
            />
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">
                Payment Outstanding
              </h3>
              <p className="text-red-700 mb-4">
                You have an outstanding balance of{" "}
                <span className="font-bold">
                  {summary.total_due.toFixed(2)} ৳
                </span>{" "}
                for <span className="font-bold">{summary.pending_months}</span>{" "}
                month(s).
              </p>
              <p className="text-sm text-red-600">
                Please contact the Hall Office to make the payment at your
                earliest convenience.
              </p>
            </div>
          </div>
        </div>
      )}

      {summary && summary.total_due === 0 && (
        <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded">
          <div className="flex items-start gap-4">
            <CheckCircle
              className="text-green-600 flex-shrink-0 mt-1"
              size={24}
            />
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-2">
                All Payments Up to Date
              </h3>
              <p className="text-green-700">
                Congratulations! All your payments are up to date.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
