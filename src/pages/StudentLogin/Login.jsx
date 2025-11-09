import React, { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    console.log("Login Data", formData);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Login failed");
      }

      const result = await response.json();
      console.log("✅ Login success:", result);

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("❌ Login failed:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Spacer for transparent header */}
      <div className="h-15"></div>
      
      <div className="flex flex-col lg:flex-row max-w-5xl mx-auto my-12 rounded-2xl overflow-hidden shadow-xl min-h-[80vh]">

        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative items-stretch" style={{ background: 'linear-gradient(to bottom right, rgba(210, 193, 182, 0.2), rgba(69, 104, 130, 0.2))' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
              alt="Students collaborating"
              className="w-full h-full object-cover rounded-xl shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-10 py-12 bg-white">

          <div className="w-full max-w-xs">
            {/* Header */}
            <div className="mb-5">
              <p className="text-sm font-medium mb-1.5" style={{ color:'black' }}>Welcome Back! 👋</p>
              <h1 className="text-xl font-bold mb-1.5" style={{ color: '#1B3C53' }}>Log In to HostelEzz</h1>
              <p className="text-gray-500 text-xs leading-relaxed">
                Access your hostel dashboard and manage your stay.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-3.5">
              <div>
                <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: '#1B3C53' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-full focus:outline-none transition bg-white"
                  onFocus={(e) => e.target.style.borderColor = '#234C6A'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium mb-1.5" style={{ color: '#1B3C53' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full px-3.5 py-2 text-sm pr-10 border border-gray-300 rounded-full focus:outline-none transition bg-white"
                    onFocus={(e) => e.target.style.borderColor = '#234C6A'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="w-3.5 h-3.5 border-gray-300 rounded"
                    style={{ accentColor: '#1B3C53' }}
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="font-medium hover:underline" style={{ color: '#234C6A' }}>
                  Forgot Password?
                </a>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-2.5 text-sm text-white font-semibold rounded-full transition shadow-md mt-3"
                style={{ backgroundColor: '#1B3C53' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#234C6A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1B3C53'}
              >
                Log In
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-3 text-center text-xs">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="font-semibold hover:underline" style={{ color: '#1B3C53' }}>
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-24 bg-gray-50"></div>
    </div>
  );
}