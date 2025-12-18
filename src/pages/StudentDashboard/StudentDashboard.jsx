import React, { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  MessageSquare,
  AlertCircle,
  Star,
  X,
  User,
  Bell,
  Upload,
} from "lucide-react";

const StudentDashboard = () => {
  const [menuData, setMenuData] = useState({
    day: "MONDAY",
    meals: {
      BREAKFAST: ["Poha", "Bread & Butter", "Tea/Coffee", "Banana"],
      LUNCH: [
        "Dal Tadka",
        "Jeera Rice",
        "Roti",
        "Mixed Veg Curry",
        "Salad",
        "Curd",
      ],
      SNACKS: ["Samosa", "Green Chutney", "Tea/Coffee"],
      DINNER: [
        "Rajma Curry",
        "Steamed Rice",
        "Roti",
        "Aloo Gobi",
        "Pickle",
        "Sweet Dish",
      ],
    },
  });

  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [setPreferenceModal, setSetPreferenceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [profileForm, setProfileForm] = useState({
    branch: "",
    hostelType: "",
    gender: "",
    parentContactNo: "",
    year: 0,
  });

  const [preferenceForm, setPreferenceForm] = useState({
    scheduleType: null,
    cleanlinessLevel: null,
    noisePreference: null,
    studyPreference: null,
    allergy: null,
    roomTempPreference: null,
    roomType: null,
  });

  const [complaintForm, setComplaintForm] = useState({
    title: "",
    description: "",
    roomId: "",
  });

  const [feedbackForm, setFeedbackForm] = useState({
    rating: 0,
    comment: "",
  });

  const API_BASE_URL = "http://localhost:8080/api";

  const getAuthToken = () => localStorage.getItem("authToken");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProfile(),
        fetchMenu(),
        fetchMyComplaints(),
        fetchMyFeedbacks(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

const updateProfile = async () => {
  try {
    console.log("Saving profile...", profileForm); // DEBUG

    const res = await fetch(`${API_BASE_URL}/student/profile`, {
      method: "PUT",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileForm),
    });

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    const data = await res.json();
    setProfile(data);
    setShowProfileModal(false);
  } catch (err) {
    console.error("Profile update error:", err);
    alert("Failed to save profile");
  }
};


  // const fetchMenu = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/menu`, {
  //       headers: authHeaders
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       if (data && data.length > 0) {
  //         const today = getDayOfWeek().toUpperCase();
  //         const todayMenu = data.find(m => m.day === today);
  //         setMenuData(todayMenu || data[0]);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching menu:', error);
  //   }
  // };

  const fetchMyComplaints = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/complaint/my`, {
        headers: authHeaders,
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchMyFeedbacks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/my`, {
        headers: authHeaders,
      });
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const submitComplaint = async () => {
    if (
      !complaintForm.title ||
      !complaintForm.description ||
      !complaintForm.roomId
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/complaint`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(complaintForm),
      });

      if (response.ok) {
        alert("Complaint filed successfully!");
        setShowComplaintModal(false);
        setComplaintForm({ title: "", description: "", roomId: "" });
        fetchMyComplaints();
      } else {
        alert("Failed to file complaint");
      }
    } catch (error) {
      console.error("Error filing complaint:", error);
      alert("Error filing complaint");
    }
  };

  const submitFeedback = async () => {
    if (!feedbackForm.rating || !feedbackForm.comment) {
      alert("Please provide rating and comment");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(feedbackForm),
      });

      if (response.ok) {
        alert("Feedback submitted successfully!");
        setShowFeedbackModal(false);
        setFeedbackForm({ rating: 0, comment: "" });
        fetchMyFeedbacks();
      } else {
        alert("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback");
    }
  };

  const getDayOfWeek = () => {
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    return days[new Date().getDay()];
  };

  const getDayAbbr = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[new Date().getDay()];
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.name,
      profile.email,
      profile.contactNo,
      profile.branch,
      profile.year,
      profile.gender,
      profile.hostelType,
      profile.parentContactNo,
    ];
    const filledFields = fields.filter((field) => field && field !== 0).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const pendingCount = complaints.filter((c) => c.status === "PENDING").length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "RESOLVED"
  ).length;

  const submitPreference = async () => {
    // if (!preferenceForm.scheduleType || !preferenceForm.cleanlinessLevel ||
    //     !preferenceForm.noisePreference || !preferenceForm.studyPreference ||
    //     !preferenceForm.allergy || !preferenceForm.roomType ||        !preferenceForm.roomTempPreference) {
    //   alert("Please fill all fields");
    //   return;
    // }

    try {
      const res = await fetch(`${API_BASE_URL}/preference`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(preferenceForm),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        alert(
          "Error occurred. You may have already submitted preferences or your profile is incomplete."
        );
        return;
      }

      alert("Preferences saved successfully");
      setSetPreferenceModal(false);
      setPreferenceForm({
        scheduleType: null,
        cleanlinessLevel: null,
        noisePreference: null,
        studyPreference: null,
        allergy: null,
        roomTempPreference: null,
      });
    } catch (error) {
      console.log("Error submitting preference", error);
      alert("Something went wrong");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back, {profile?.name || "Rohan"}!
              </h1>
              <p className="text-xs text-gray-500">
                Let's see what's happening in your hostel today.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-4 h-4 text-gray-600" />
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full hover:bg-orange-100">
                <User className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-600 font-medium">
                  Profile
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Find Your Perfect Roommate!
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Complete your Roommate Preference Form in your profile to start
                seeing potential matches.
              </p>
              <button
                onClick={() => {
                  setShowProfileModal(true);
                }}
                className="px-4 py-1.5 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 bg-orange-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">Mess Menu</h3>
            </div>
            <div className="flex gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <button
                  key={day}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    day === getDayAbbr()
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            {menuData?.meals ? (
              <>
                {menuData.meals.BREAKFAST && (
                  <MealCard
                    icon="🍳"
                    title="Breakfast"
                    items={menuData.meals.BREAKFAST}
                    time="8:00 AM - 9:30 AM"
                    bgColor="bg-blue-50"
                  />
                )}
                {menuData.meals.LUNCH && (
                  <MealCard
                    icon="🍛"
                    title="Lunch"
                    items={menuData.meals.LUNCH}
                    time="12:30 PM - 2:00 PM"
                    bgColor="bg-green-50"
                  />
                )}
                {menuData.meals.SNACKS && (
                  <MealCard
                    icon="🍪"
                    title="Snacks"
                    items={menuData.meals.SNACKS}
                    time="4:30 PM - 5:30 PM"
                    bgColor="bg-yellow-50"
                  />
                )}
                {menuData.meals.DINNER && (
                  <MealCard
                    icon="🍽️"
                    title="Dinner"
                    items={menuData.meals.DINNER}
                    time="7:30 PM - 9:00 PM"
                    bgColor="bg-purple-50"
                  />
                )}
              </>
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-400">
                <UtensilsCrossed className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No menu available for today</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="bg-white rounded-lg shadow-sm p-5 flex flex-col"
              style={{ minHeight: "280px" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Roommate Matching
                  </h4>
                  <p className="text-xs text-gray-600">
                    Fill out your preference form to discover and connect with
                    potential roommates for the upcoming semester.
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center text-gray-300">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="text-xs text-center text-gray-500 mb-3">
                Complete your profile to unlock matches.
              </p>
              {/*made a setpreferencemodal for this*/}
              <button
                onClick={() => {
                  setSetPreferenceModal(true);
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 mt-auto"
              >
                Update Preferences
              </button>
            </div>

            <div
              className="bg-white rounded-lg shadow-sm p-5 flex flex-col"
              style={{ minHeight: "280px" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Rate Today's Meal
                  </h4>
                  <p className="text-xs text-gray-600">
                    How was the lunch today? Your feedback helps us improve.
                  </p>
                </div>
              </div>

              <div className="flex-1 flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-8 h-8 text-gray-300 cursor-pointer hover:text-yellow-400"
                  />
                ))}
              </div>

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 mt-auto"
              >
                Submit Feedback
              </button>
            </div>

            <div
              className="bg-white rounded-lg shadow-sm p-5 flex flex-col"
              style={{ minHeight: "280px" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Hostel Complaints
                  </h4>
                  <p className="text-xs text-gray-600">
                    Track your complaints or raise a new one. We're here to
                    help.
                  </p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-600 mb-1">Pending Issues</p>
                  <p className="text-xl font-bold text-red-600">
                    {pendingCount}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-600 mb-1">Resolved Issues</p>
                  <p className="text-xl font-bold text-green-600">
                    {resolvedCount}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowComplaintModal(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 mt-auto"
              >
                File a New Complaint
              </button>
            </div>
          </div>
        </div>
      </div>

      {setPreferenceModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-40 flex items-center justify-center p-2 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full my-7">
            <div className="p-6 border-b border-gray-200 pb-0 pt-10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Set Room Preferences
                </h2>
                <button
                  onClick={() => setSetPreferenceModal(false)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* <p className="text-sm text-gray-600">
                Fill out all fields and save your preferences.
              </p> */}
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Schedule Type
                </label>
                <select
                  value={preferenceForm.scheduleType || ""}
                  onChange={(e) =>
                    setPreferenceForm({
                      ...preferenceForm,
                      scheduleType: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                >
                  <option value="">Select</option>
                  <option value="MORNING_PERSON">Morning Person</option>
                  <option value="NIGHT_PERSON">Night Person</option>
                  <option value="FLEXIBLE">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Cleanliness Level
                </label>
                <select
                  value={preferenceForm.cleanlinessLevel || ""}
                  onChange={(e) =>
                    setPreferenceForm({
                      ...preferenceForm,
                      cleanlinessLevel: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                >
                  <option value="">Select</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Noise Preference
                </label>
                <select
                  value={preferenceForm.noisePreference || ""}
                  onChange={(e) =>
                    setPreferenceForm({
                      ...preferenceForm,
                      noisePreference: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                >
                  <option value="">Select</option>
                  <option value="QUIET">Quiet</option>
                  <option value="OKAY">Okay</option>
                  <option value="NOISY">Noisy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Study Preference
                </label>
                <select
                  value={preferenceForm.studyPreference || ""}
                  onChange={(e) =>
                    setPreferenceForm({
                      ...preferenceForm,
                      studyPreference: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                >
                  <option value="">Select</option>
                  <option value="ALONE">Alone</option>
                  <option value="GROUP">Group</option>
                  <option value="FLEXIBLE">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Allergy
                </label>
                <select
                  value={preferenceForm.allergy || ""}
                  onChange={(e) =>
                    setPreferenceForm({
                      ...preferenceForm,
                      allergy: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                >
                  <option value="">Select</option>
                  <option value="DIRT">Dirt</option>
                  <option value="PERFUME">Perfume</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Room Temperature
                </label>
                <select
                  value={preferenceForm.roomTempPreference || ""}
                  onChange={(e) =>
                    setPreferenceForm({
                      ...preferenceForm,
                      roomTempPreference: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                >
                  <option value="">Select</option>
                  <option value="CHILLED">Chilled</option>
                  <option value="COOL">Cool</option>
                  <option value="NORMAL">Normal</option>
                  <option value="FLEXIBLE">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Room Type
                </label>
                <select
                  value={preferenceForm.roomType || ""}
                  onChange={(e) =>
                    setPreferenceForm({
                      ...preferenceForm,
                      roomType: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg text-sm"
                >
                  <option value="">Select</option>
                  <option value="ONE">One</option>
                  <option value="TWO">Two</option>
                  <option value="THREE">Three</option>
                  <option value="FOUR">Four</option>
                </select>
              </div>

              <button
                onClick={submitPreference}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {showComplaintModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Submit a Complaint
                </h2>
                <button
                  onClick={() => setShowComplaintModal(false)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                We take your concerns seriously. Please fill out the form below
                to report an issue and our team will get back to you.
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Complaint Category
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white">
                  <option>Select a category</option>
                  <option>Maintenance</option>
                  <option>Cleanliness</option>
                  <option>Facilities</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={complaintForm.title}
                  onChange={(e) =>
                    setComplaintForm({
                      ...complaintForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Briefly describe the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  value={complaintForm.roomId}
                  onChange={(e) =>
                    setComplaintForm({
                      ...complaintForm,
                      roomId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., A-101"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={complaintForm.description}
                  onChange={(e) =>
                    setComplaintForm({
                      ...complaintForm,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="Please provide as much detail as possible, including dates, times, and any individuals involved..."
                />
              </div>

              <button
                onClick={submitComplaint}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-40 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full my-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Mess Feedback
                </h2>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Help us improve your dining experience! Your feedback is
                valuable.
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Rate Your Meal
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() =>
                        setFeedbackForm({ ...feedbackForm, rating: star })
                      }
                      className={`w-10 h-10 cursor-pointer transition-colors ${
                        star <= feedbackForm.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  ))}
                </div>
                {feedbackForm.rating > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {feedbackForm.rating === 1 && "Poor"}
                    {feedbackForm.rating === 2 && "Fair"}
                    {feedbackForm.rating === 3 && "Good"}
                    {feedbackForm.rating === 4 && "Very Good"}
                    {feedbackForm.rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Comments & Suggestions
                </label>
                <textarea
                  value={feedbackForm.comment}
                  onChange={(e) =>
                    setFeedbackForm({
                      ...feedbackForm,
                      comment: e.target.value,
                    })
                  }
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="What did you like? What can we improve?"
                />
              </div>

              <button
                onClick={submitFeedback}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Student Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Profile Form */}
            {/* Branch */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Branch
              </label>
              <input
                type="text"
                value={profileForm.branch}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, branch: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* Year */}
            <div>
              <label className="text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                value={profileForm.year}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, year: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={profileForm.gender}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, gender: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Hostel Type */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Hostel Type
              </label>
              <select
                value={profileForm.hostelType}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, hostelType: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Select</option>
                <option value="BOYS_HOSTEL">Boys Hostel</option>
                <option value="GIRLS_HOSTEL">Girls Hostel</option>
              </select>
            </div>

            {/* Parent Contact */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Parent Contact No
              </label>
              <input
                type="text"
                value={profileForm.parentContactNo}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    parentContactNo: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>

              <button
                onClick={updateProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MealCard = ({ icon, title, items, time, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-3`}>
    <div className="text-2xl mb-2">{icon}</div>
    <h4 className="font-semibold text-gray-900 mb-1 text-sm">{title}</h4>
    <p className="text-xs text-gray-600 mb-2">{time}</p>
    <div className="text-xs text-gray-700 space-y-0.5">
      {items && Array.isArray(items) ? (
        items.slice(0, 3).map((item, idx) => <div key={idx}>{item}</div>)
      ) : (
        <div className="text-gray-400">No items</div>
      )}
    </div>
  </div>
);

export default StudentDashboard;
