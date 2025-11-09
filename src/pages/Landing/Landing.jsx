import React, { useState, useEffect } from "react";
import { cards, rotatingTexts } from "./Constants";
import "./Landingstyle.css";

export default function Landing() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const heroSection = () => {
    return (
      <section className="bg-gradient-to-r from-blue-200 to-[#22435b] min-h-screen flex items-center py-12 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row items-center justify-between gap-16 mt-25">
        
   
        <div className="flex-1 text-center md:text-left space-y-6">
          <div>
            <p className="text-5xl font-semibold text-gray-900 mb-6">
              Your portal for
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              <span
                key={currentTextIndex}
                className="inline-block bg-gradient-to-r from-[#1B3C53] to-blue-800 text-transparent bg-clip-text  text-6xl"
              >
               
                A Better Hostel Life
              </span>
            </h1>
          </div>

          <p className="text-gray-800 text-base md:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
            A unified hostel management system that matches students with <p className="text-black inline font-bold"> compatible roommates</p> based on preferences.
Streamlines complaints and mess feedback .
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <a
              href="/Login"
              className="bg-[#1B3C53] text-white px-8 py-3 rounded-lg font-semibold shadow-md 
              hover:bg-blue-700 transition-all duration-300 ease-in-out"
            >
              Let's Get started
            </a>
            
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center mb-12">
          <img
            src="/student_accomodation1.png"
            alt="Hostel Management Illustration"
            className="max-w-lg w-full"
          />
        </div>
      </div>
    </section>

    );
  };

  const featureSection = () => {
    return (
       <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
   
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Hostel Living
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From finding compatible roommates to addressing maintenance requests, 
            our platform is designed to improve your hostel life.
          </p>
        </div>

        {/* Features*/}
        <div className="space-y-12">
   
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-gray-300 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-full aspect-[592/320] bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-gray-400">
                <div className="rounded-xl hover:scale-105 hover:shadow-2xl transition duration-200 ease-in-out cursor-pointer">
                  <img src="/studentmatch.png" alt="" />
                </div>
             
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">
                Intelligent Roommate Matching
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our advanced algorithm analyzes your lifestyle preferences, study habits, 
                and personality traits to connect you with the most compatible roommates.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  ✓ Personality Analysis
                </span>
                <span className="flex items-center">
                  ✓ Smart Matching
                </span>
              </div>
            </div>
          </div>

      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-gray-300 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">
                Easy Issue Reporting
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Report maintenance issues, complaints, or requests instantly through 
                our intuitive mobile interface. Track resolution progress in real-time.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  ✓ Real-time Tracking
                </span>
                <span className="flex items-center">
                  ✓ Instant Notifications
                </span>
              </div>
            </div>
            <div className="w-full aspect-[592/320] bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-gray-400">
                <div className="rounded-xl hover:scale-105 hover:shadow-2xl transition duration-200 ease-in-out cursor-pointer">
                    <img src="/issuereporting.png" alt="" />
                </div>
               
              </div>
            </div>
          </div>

        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-gray-300 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-full aspect-[592/320] bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-gray-400">
                <div className="rounded-xl hover:scale-105 hover:shadow-2xl transition duration-200 ease-in-out cursor-pointer">  <img src="/simplifiedhostellife.png" alt="" /></div>
              
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">
                Simplified Hostel Life
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Access your personalized dashboard to manage everything from meal 
                planning and study schedules to hostel announcements and community events.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  ✓ Unified Dashboard
                </span>
                <span className="flex items-center">
                  ✓ Community Events
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white" id="hostelezz">
      {heroSection()}
      {featureSection()}
    </div>
  );
}
