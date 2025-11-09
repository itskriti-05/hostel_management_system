import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="w-full z-20 fixed top-0 left-0 bg-black/40 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl h-16 mx-auto flex items-center justify-between px-8 py-4">
     
        <div className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="HostelEzz Logo" className="h-10 w-10 rounded-full shadow-md" />
          <span className="text-white font-bold text-xl tracking-tight">
            <a href="/#hostelezz">HostelEzz</a>
          </span>
        </div>

        <div className="flex items-center space-x-12">
          <nav className="hidden md:flex space-x-12 text-white font-medium">
            <a href="#features" className="hover:text-gray-200 transition-colors duration-200">
              Features
            </a>
            <a href="#about" className="hover:text-gray-200 transition-colors duration-200">
              About Us
            </a>
            <a href="#contact" className="hover:text-gray-200 transition-colors duration-200">
              Contact Us
            </a>
          </nav>
          
          <Link
            to="/signup"
            className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;