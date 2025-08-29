import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
      {/* Left Section */}
      <div className="md:w-2/5">
        <h1 className="uppercase text-3xl font-bold mb-3 text-gray-900">
          HALL BOOKING
        </h1>
        <p className="text-xl font-semibold mb-3 text-gray-700">
          Halls Available For Bookings
        </p>
        <p className="mb-5 text-gray-700">
          <Link className="text-blue-500 underline" href="/">
            Click here
          </Link>{" "}
          to check availability of halls
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-800">
          <li>Sheikh Rasel Hall</li>
          <li>Bijoy Dibosh Hall</li>
          <li>Shadinota Hall</li>
        </ol>
      </div>

      {/* Right Section */}
      <div className="md:w-3/5 border p-5 shadow-lg rounded-md bg-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          STEPS TO BOOK A HALL
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            <Link href="/login" className="text-blue-500 underline">
              Click here to login
            </Link>
          </li>
          <li>
            Check the calendar for the availability of the halls on specific
            dates.
          </li>
          <li>Click "Add new request" and fill in the form and submit.</li>
          <li>
            You will receive an email upon submitting this form and an email
            after the request is approved.
          </li>
          <li>
            Meanwhile, the status of your record can be tracked from your
            dashboard.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Home;
