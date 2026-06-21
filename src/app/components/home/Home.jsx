import Link from "next/link";
import React from "react";
import {
  Check,
  Clock,
  FileText,
  Users,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Home = () => {
  const halls = [
    {
      name: "Sheikh Rasel Hall",
      beds: 150,
      capacity: "Room for 150 students",
      features: "Mess Facility",
      status: "Available",
    },
    {
      name: "Bijoy Dibosh Hall",
      beds: 120,
      capacity: "Room for 120 students",
      features: "Mess Facility",
      status: "Available",
    },
    {
      name: "Shadinota Hall",
      beds: 100,
      capacity: "Room for 100 students",
      features: "Mess Facility",
      status: "Available",
    },
  ];

  const faq = [
    {
      question: "What is the eligibility criteria for hall allocation?",
      answer:
        "All full-time students enrolled at GSTU are eligible to apply for hall accommodation. Priority is given based on academic performance and previous year's allocation status.",
    },
    {
      question: "What are the hall allocation deadlines?",
      answer:
        "Applications are usually accepted during the semester break. Check the Important Notices section for current deadlines and key dates.",
    },
    {
      question: "How long does the approval process take?",
      answer:
        "The approval process typically takes 7-14 business days. You can track your application status in real-time through your dashboard.",
    },
    {
      question: "Can I change my hall preference after applying?",
      answer:
        "You can modify your preference only before the final submission. After approval, changes require special permission from the hall authority.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Important Notices Section */}
      <section className="bg-red-50 border-l-4 border-red-600 px-6 md:px-10 py-6 max-w-6xl mx-auto my-6">
        <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
          <Clock size={20} />
          Important Notice
        </h3>
        <p className="text-red-700 text-sm md:text-base">
          📌 Hall allocation applications are now open. Submission deadline:{" "}
          <span className="font-bold">30 June 2026</span>. All students must
          complete their applications through this portal. For queries, contact
          the Hall Office.
        </p>
      </section>

      {/* Quick Stats Section */}
      <section className="bg-blue-900 text-white px-6 md:px-10 py-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Halls", value: "3", icon: "🏛️" },
            { label: "Available Beds", value: "370", icon: "🛏️" },
            { label: "Students Served", value: "2,500+", icon: "👥" },
            { label: "Years Operating", value: "25+", icon: "📅" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-blue-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 md:px-10 py-12 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Campus Hall Booking System
          </h1>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            Welcome to the official GSTU Hall Booking Portal. This system helps
            students apply for hostel accommodation in campus halls. All
            applications are processed transparently, and students can track
            their status in real-time. For returning students, previous
            allocations are considered for renewal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold text-center transition"
          >
            Login to Apply
          </Link>
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-semibold text-center transition"
          >
            New Registration
          </Link>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="bg-gray-50 px-6 md:px-10 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            How to Apply for Hall Accommodation
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                step: "1",
                title: "Register/Login",
                desc: "Create account or login with your credentials",
              },
              {
                step: "2",
                title: "Fill Application",
                desc: "Complete the hall application form",
              },
              {
                step: "3",
                title: "Submit Documents",
                desc: "Upload required documents and proof",
              },
              {
                step: "4",
                title: "Track Status",
                desc: "Monitor your application progress",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded border border-gray-300 p-5"
              >
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Halls Section */}
      <section className="px-6 md:px-10 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Available Halls
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Hall Name
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Capacity
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Available Beds
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left">
                  Facilities
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {halls.map((hall, idx) => (
                <tr key={idx} className="hover:bg-blue-50 transition">
                  <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">
                    {hall.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    {hall.capacity}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700">
                    {hall.beds}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-700 text-sm">
                    {hall.features}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {hall.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Important Requirements */}
      <section className="bg-blue-50 px-6 md:px-10 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Requirements & Documents
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Required Documents
              </h3>
              <ul className="space-y-3">
                {[
                  "Valid Student ID",
                  "Academic Transcript",
                  "Character Certificate",
                  "Parent's Guardian Information",
                  "Health Certificate (Optional)",
                  "Photo (4x6 inches)",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <Check size={18} className="text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Eligibility Criteria
              </h3>
              <ul className="space-y-3">
                {[
                  "Currently enrolled full-time student",
                  "Valid Academic Record",
                  "No disciplinary actions pending",
                  "Complete all required forms",
                  "Meet Hall Authority standards",
                  "Parent/Guardian consent required",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <Check size={18} className="text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 md:px-10 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faq.map((item, idx) => (
            <details key={idx} className="group">
              <summary className="bg-gray-100 hover:bg-gray-200 cursor-pointer px-6 py-4 rounded font-semibold text-gray-900 flex items-center justify-between">
                <span>{item.question}</span>
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <div className="bg-gray-50 px-6 py-4 border-l-4 border-blue-600">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-900 text-white px-6 md:px-10 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Need Help?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Phone size={24} />,
                title: "Contact",
                details: [
                  "Hall Office: +88-1234-567890",
                  "Admin Support: +88-0198-765432",
                ],
              },
              {
                icon: <Mail size={24} />,
                title: "Email",
                details: ["halls@gstu.edu.bd", "support@gstu.edu.bd"],
              },
              {
                icon: <MapPin size={24} />,
                title: "Location",
                details: ["Hall Office, GSTU Campus", "Gopalganj, Bangladesh"],
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3 mb-3">
                  {item.icon}
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                {item.details.map((detail, i) => (
                  <p key={i} className="text-gray-300 text-sm mb-2">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-blue-900 text-white text-center px-6 py-6 text-sm">
        <p>
          © 2024 Gopalganj Science & Technology University. All Rights Reserved.
        </p>
        <p className="text-blue-200 mt-2">
          Last Updated: June 2026 | For technical support, contact IT Cell
        </p>
      </section>
    </div>
  );
};

export default Home;
