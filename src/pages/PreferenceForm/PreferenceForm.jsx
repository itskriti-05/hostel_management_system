import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PreferenceForm() {
  const [formData, setFormData] = useState({
    scheduleType: "",
    cleanlinessLevel: "",
    noisePreference: "",
    studyPreference: "",
    allergy: "",
    roomTempPreference: "",
    roomType: "",
  });
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    const fields = Object.keys(formData);
    const filled = fields.filter((key) => formData[key] !== "").length;
    setProgress((filled / fields.length) * 100);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      alert("Failed to submit preference");
      return;
    }

    alert("Preferences saved successfully!");
    navigate("/student-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Build Your Roommate Vibe!
          </h1>
          <p className="text-gray-600">
            Let's find your perfect match! Tell us a bit about your style, and
            we'll connect you with an awesome roommate.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Vibe Check Progress
            </span>
            <span className="text-sm font-medium text-[#1B3C53]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#1B3C53] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Your Daily Groove */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Daily Groove
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Schedule Type */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="text-blue-500 mr-2">🌅</span>
                  Are you a night owl or an early bird?
                </label>
                <select
                  value={formData.scheduleType}
                  onChange={(e) =>
                    handleSelectChange("scheduleType", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53] bg-gray-50"
                >
                  <option value="">Select...</option>
                  <option value="MORNING_PERSON">Early Bird</option>
                  <option value="NIGHT_PERSON">Night Owl</option>
                  <option value="FLEXIBLE">Flexible</option>
                </select>
              </div>

              {/* Cleanliness Level */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="text-green-500 mr-2">✨</span>
                  How tidy do you like your space?
                </label>
                <select
                  value={formData.cleanlinessLevel}
                  onChange={(e) =>
                    handleSelectChange("cleanlinessLevel", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53] bg-gray-50"
                >
                  <option value="">Select...</option>
                  <option value="HIGH">Super Tidy</option>
                  <option value="MEDIUM">Pretty Clean</option>
                  <option value="LOW">Relaxed</option>
                </select>
              </div>

              {/* Noise Preference */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="text-purple-500 mr-2">🔊</span>
                  What's your preferred noise level?
                </label>
                <select
                  value={formData.noisePreference}
                  onChange={(e) =>
                    handleSelectChange("noisePreference", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53] bg-gray-50"
                >
                  <option value="">Select...</option>
                  <option value="QUIET">Quiet Zone</option>
                  <option value="OKAY">Moderate</option>
                  <option value="NOISY">Lively</option>
                </select>
              </div>

              {/* Room Temperature */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="text-orange-500 mr-2">🌡️</span>
                  Room temp: cool or cozy?
                </label>
                <select
                  value={formData.roomTempPreference}
                  onChange={(e) =>
                    handleSelectChange("roomTempPreference", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53] bg-gray-50"
                >
                  <option value="">Select...</option>
                  <option value="CHILLED">Chilled like a polar bear</option>
                  <option value="COOL">Cool & Fresh</option>
                  <option value="NORMAL">Just Right</option>
                  <option value="FLEXIBLE">I'm Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Study & Fun Times */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Study & Fun Times
            </h2>

            {/* Study Preference */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <span className="text-green-500 mr-2">📚</span>
                How do you hit the books?
              </label>
              <select
                value={formData.studyPreference}
                onChange={(e) =>
                  handleSelectChange("studyPreference", e.target.value)
                }
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53] bg-gray-50"
              >
                <option value="">Select...</option>
                <option value="ALONE">Solo Focus Mode</option>
                <option value="GROUP">Group Study Sessions</option>
                <option value="FLEXIBLE">Either Works</option>
              </select>
            </div>
          </div>

          {/* Room & Well-being */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Room & Well-being
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Allergies */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500 mr-2">🤧</span>
                  Any allergies we should know about?
                </label>
                <select
                  value={formData.allergy}
                  onChange={(e) =>
                    handleSelectChange("allergy", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53] bg-gray-50"
                >
                  <option value="">Select...</option>
                  <option value="DIRT">Nope, I'm good!</option>
                  <option value="PERFUME">Perfume/Fragrance</option>
                  <option value="OTHERS">Other Allergies</option>
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="text-yellow-500 mr-2">🛏️</span>
                  Your ideal room setup?
                </label>
                <select
                  value={formData.roomType}
                  onChange={(e) =>
                    handleSelectChange("roomType", e.target.value)
                  }
                  required
                >
                  <option value="">Select Room Type</option>
                  <option value="ONE">Single (1 Person)</option>
                  <option value="TWO">Double (2 People)</option>
                  <option value="THREE">Triple (3 People)</option>
                  <option value="FOUR">Four Sharing</option>
                  <option value="FIVE">Five Sharing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#1B3C53] text-white font-semibold rounded-xl hover:bg-[#152e40] transition shadow-lg text-lg"
          >
            Find My Perfect Roommate Match! 🎉
          </button>
        </form>
      </div>
    </div>
  );
}
