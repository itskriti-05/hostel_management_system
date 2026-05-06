import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    branch: "",
    year: "",
    gender: "",
    hostelType: "",
    parentContactNo: "",
  });

  const saveProfile = async () => {
    await fetch("http://localhost:8080/api/student/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(form),
    });

    alert("Profile completed successfully");
    navigate("/student-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Please fill in the details below to continue
        </p>

        {/* Branch */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch
          </label>
          <input
            type="text"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Computer Science"
          />
        </div>

        {/* Year */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </select>
        </div>

        {/* Hostel Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hostel Type
          </label>
          <select
            value={form.hostelType}
            onChange={(e) => setForm({ ...form, hostelType: e.target.value })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Hostel</option>
            <option value="GIRLS_HOSTEL">Girls Hostel</option>
            <option value="BOYS_HOSTEL">Boys Hostel</option>
          </select>
        </div>

        {/* Parent Contact */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Contact Number
          </label>
          <input
            type="text"
            value={form.parentContactNo}
            onChange={(e) =>
              setForm({ ...form, parentContactNo: e.target.value })
            }
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9876543210"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() =>
              navigate("/student-dashboard", {
                replace: true,
                state: { refresh: true },
              })
            }
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
