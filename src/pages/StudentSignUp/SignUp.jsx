import React, { useState } from 'react';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNo: ''
  });

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async() => {
    console.log("Sending signup data:", formData);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to register");
      }

      const result = await response.json();   // result has "token"

console.log("JWT Token received:", result.token);

localStorage.setItem("authToken", result.token);  // SAVE TOKEN HERE
localStorage.setItem("userId", result.id);
localStorage.setItem("role", result.role);

window.location.href = "/dashboard";

    } catch (error) {
      console.error("❌ Registration failed:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
    
      <div className="h-20"></div>
      
      <div className="flex flex-col lg:flex-row max-w-5xl mx-auto my-8 rounded-2xl overflow-hidden shadow-xl">
    
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-6 bg-white">
          <div className="w-full max-w-xs">
          
            <div className="mb-5">
              <p className="text-sm font-medium mb-1.5" style={{ color: 'black' }}>Hello Amigos! 👋</p>
              <h1 className="text-xl font-bold mb-1.5" style={{ color: '#1B3C53' }}>Create Your Student Account</h1>
              <p className="text-gray-500 text-xs leading-relaxed">
                Find your perfect roommate and manage your stay, all in one place.
              </p>
            </div>

      
            <div className="space-y-3.5">
              <div>
                <label htmlFor="name" className="block text-xs font-medium mb-1.5" style={{ color: '#1B3C53' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-full focus:outline-none transition bg-white"
                  style={{ focusRingColor: '#234C6A' }}
                  onFocus={(e) => e.target.style.borderColor = '#234C6A'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

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
                    placeholder="Create a strong password"
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

              <div>
                <label htmlFor="contactNo" className="block text-xs font-medium mb-1.5" style={{ color: '#1B3C53' }}>
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  required
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-full focus:outline-none transition bg-white"
                  onFocus={(e) => e.target.style.borderColor = '#234C6A'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-2.5 text-sm text-white font-semibold rounded-full transition shadow-md mt-3"
                style={{ backgroundColor: '#1B3C53' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#234C6A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1B3C53'}
              >
                Create Account
              </button>
            </div>

      
            <div className="mt-3 text-center text-xs text-gray-600">
              <p>
                By creating an account, you agree to our{" "}
                <a href="#" className="font-medium hover:underline" style={{ color: '#234C6A' }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium hover:underline" style={{ color: '#234C6A' }}>
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <div className="mt-2.5 text-center text-xs">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="font-semibold hover:underline" style={{ color: '#1B3C53' }}>
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>

       
        <div className="hidden lg:block lg:w-1/2 relative" style={{ background: 'linear-gradient(to bottom right, rgba(210, 193, 182, 0.2), rgba(69, 104, 130, 0.2))' }}>
          <div className="absolute inset-0 flex items-center justify-center ">
            <img
              src="/signupimg.png"
              alt="Students collaborating"
              className="w-full h-full object-cover rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>

     
      <div className="h-24 bg-gray-50"></div>
    </div>
  );
}