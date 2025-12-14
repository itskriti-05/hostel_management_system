import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Star, UserPlus, Settings, Bell, Search, ChevronRight, X, Check, Clock, UserCheck, Building2, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const WardenDashboard = () => {
  // Local UI state (unchanged)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState({});

  // API base (Option B)
  const API_BASE_URL = 'http://localhost:8080/api';

  const getAuthToken = () => localStorage.getItem('authToken');

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuthToken()}`
  });
useEffect(() => {
  const token = getAuthToken();
  let role = localStorage.getItem("role");

  // normalize role
  try {
    if (role?.startsWith("[")) {
      const parsed = JSON.parse(role);
      role = Array.isArray(parsed) ? parsed[0] : parsed;
      localStorage.setItem("role", role);
    }
  } catch {}

  console.log("🔐 TOKEN FOUND:", token);
  console.log("🔐 ROLE FOUND:", role);

  if (!token) {
    console.error("❌ No token found. Redirecting to login.");
    window.location.href = "/login";
    return;
  }

  if (role !== "ROLE_WARDEN") {
    console.error("❌ Unauthorized role:", role);
    window.location.href = "/login";
    return;
  }
}, []);



  // Data state (kept same variable names)
  const [dashboardData, setDashboardData] = useState({
  totalStudents: 0,
  studentGrowth: '',
  pendingComplaints: 0,
  urgentComplaints: 0,
  inProgressComplaints: 0,
  averageRating: 0,
  maxRating: 5,
  todayRating: 0,
  pendingMatches: 0,
  completedMatches: 0
});

const [wardenProfile, setWardenProfile] = useState({
  id: '',
  name: '',
  email: '',
  contactNo: '',
  hostelType: ''
});


  const [notifications, setNotifications] = useState([]);


  const [students, setStudents] = useState([]);


  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    dept: 'MAINTENANCE',
    shift: 'MORNING',
    hostelType: 'BOYS_HOSTEL'
  });

  const [profileForm, setProfileForm] = useState({ ...wardenProfile });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

 
  useEffect(() => {
    fetchDashboard();
    fetchStudents();
    fetchNotifications();
    fetchWardenProfile();
  }, []);


  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/warden/dashboard`, {
        headers: authHeaders()
      });
      if (res.ok) {
        const data = await res.json();

        setDashboardData(prev => ({ ...prev, ...data }));
      } else {

        console.warn('Failed to fetch dashboard:', res.status);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };


  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/warden/students`, {
        headers: authHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        // expect array of students
        if (Array.isArray(data)) setStudents(data);
      } else {
        console.warn('Failed to fetch students:', res.status);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/warden/notifications`, {
        headers: authHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setNotifications(data);
      } else {
        console.warn('Failed to fetch notifications:', res.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };


  const fetchWardenProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/warden/profile`, {
        headers: authHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setWardenProfile(data);
          setProfileForm({ ...data });
        }
      } else {
        console.warn('Failed to fetch profile:', res.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setEmailSending(true);
    setEmailSent(false);

    const password = generatePassword();
    setGeneratedPassword(password);

    try {
      const res = await fetch(`${API_BASE_URL}/warden/register-staff`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          name: staffForm.name,
          email: staffForm.email,
          dept: staffForm.dept,
          shift: staffForm.shift,
          hostelType: staffForm.hostelType,
          generatedPassword: password
        })
      });

      if (res.ok) {
        const data = await res.json();
        // send email with credentials
        try {
          await sendStaffCredentialsEmail(staffForm.email, staffForm.name, password);
          setEmailSent(true);
        } catch (emailErr) {
          console.error('Email sending failed:', emailErr);
          alert('Staff created but failed to send credentials email.');
        }


        setTimeout(() => {
          alert(`✅ Staff member added successfully!\n\n📧 Credentials have been sent to: ${staffForm.email}\n\nGenerated Password: ${password}\n\nPlease inform the staff member to check their email.`);
          
          // Reset form & close
          setStaffForm({ name: '', email: '', dept: 'MAINTENANCE', shift: 'MORNING', hostelType: 'BOYS_HOSTEL' });
          setGeneratedPassword('');
          setShowAddStaffModal(false);
          setEmailSent(false);
        }, 1000);

        // refresh notifications & staff list if needed
        fetchNotifications();
      } else {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(errText || 'Failed to add staff');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('❌ Error adding staff member. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  const sendStaffCredentialsEmail = async (email, name, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/email/send-staff-credentials`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          to: email,
          subject: 'HostelEzz - Your Staff Account Credentials',
          body: `
            Dear ${name},

            Welcome to HostelEzz! Your staff account has been created.

            Login Credentials:
            Email: ${email}
            Password: ${password}

            Please log in and change your password immediately.

            Best regards,
            HostelEzz Management Team
          `
        })
      });

      if (res.ok) {
        return true;
      } else {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(errText || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/warden/update-profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(profileForm)
      });

      if (res.ok) {
        const updated = await res.json();
        setWardenProfile(updated || profileForm);
        setShowProfileModal(false);
        alert('Profile updated successfully!');
      } else {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(errText || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };


  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/warden/update-profile/update-password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (res.ok) {
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordModal(false);
        alert('Password updated successfully!');
      } else {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(errText || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HostelEzz <span className="text-blue-500">Warden</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students, rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{wardenProfile.name}</p>
                <p className="text-sm text-gray-500">Head Warden</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {wardenProfile.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>


      {showNotifications && (
        <div className="absolute right-6 top-20 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button onClick={() => setShowNotifications(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notif => (
              <div key={notif.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-blue-50' : ''}`}>
                <p className="text-sm text-gray-900">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'students' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">All Students</span>
            </button>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Add Staff</span>
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Profile Settings</span>
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Lock className="w-5 h-5" />
              <span className="font-medium">Change Password</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Master Dashboard</h2>
                <p className="text-gray-600 mt-1">Here's an overview of hostel activities and actionable items for today.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded">
                      {dashboardData.studentGrowth}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.totalStudents}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">See All Complaints</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingComplaints} <span className="text-base text-gray-500 font-normal">Pending</span></p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm mb-1">See All Ratings</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.averageRating} <span className="text-base text-gray-500 font-normal">/ {dashboardData.maxRating}</span></p>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Roommate Matching</h3>
                      <p className="text-sm text-gray-600">Monitor pending requests and oversee automated pairing.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.pendingMatches}</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{dashboardData.completedMatches}</p>
                      <p className="text-sm text-gray-600">Matched</p>
                    </div>
                  </div>

                  <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    Process Matches
                  </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Hostel Complaints</h3>
                      <p className="text-sm text-gray-600">Resolve student grievances and track maintenance status.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-2xl font-bold text-red-600">{dashboardData.urgentComplaints}</p>
                      <p className="text-sm text-gray-600">New Urgent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{dashboardData.inProgressComplaints}</p>
                      <p className="text-sm text-gray-600">In Progress</p>
                    </div>
                  </div>

                  <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Manage Complaints
                  </button>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Mess Feedback</h3>
                      <p className="text-sm text-gray-600">Review student ratings for recent meals.</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Today's Avg</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      <p className="text-2xl font-bold text-gray-900">{dashboardData.todayRating}</p>
                    </div>
                  </div>

                  <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    View Ratings
                  </button>
                </div>
              </div>

              {/* New Registrations */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">New Registrations</h3>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">View All Students</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room No.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.slice(0, 3).map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{student.avatar}</div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.room}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              student.status === 'Active' ? 'bg-green-100 text-green-800' :
                              student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-gray-400 hover:text-gray-600">•••</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'students' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Students</h2>
                <p className="text-gray-600 mt-1">Manage and view all registered students.</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room No.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{student.avatar}</div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.room}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              student.status === 'Active' ? 'bg-green-100 text-green-800' :
                              student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-blue-600 hover:text-blue-700 font-medium">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add Staff Member</h3>
                <button onClick={() => setShowAddStaffModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({...staffForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({...staffForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department/Role</label>
                <select
                  value={staffForm.dept}
                  onChange={(e) => setStaffForm({...staffForm, dept: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="SECURITY">Security</option>
                  <option value="HOUSEKEEPING">Housekeeping</option>
                  <option value="MESS">Mess Staff</option>
                  <option value="CLEANING">Cleaning</option>
                  <option value="LAUNDRY">Laundry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
                <select
                  value={staffForm.shift}
                  onChange={(e) => setStaffForm({...staffForm, shift: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MORNING">Morning (6 AM - 2 PM)</option>
                  <option value="AFTERNOON">Afternoon (2 PM - 10 PM)</option>
                  <option value="NIGHT">Night (10 PM - 6 AM)</option>
                  <option value="FULL_DAY">Full Day (9 AM - 6 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Type</label>
                <select
                  value={staffForm.hostelType}
                  onChange={(e) => setStaffForm({...staffForm, hostelType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BOYS_HOSTEL">Boys Hostel</option>
                  <option value="GIRLS_HOSTEL">Girls Hostel</option>
                </select>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      📧 Email Notification
                    </p>
                    <p className="text-xs text-blue-800">
                      A secure password will be automatically generated and sent to the staff member's email address. They can change it after their first login.
                    </p>
                  </div>
                </div>
              </div>

              {emailSent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Email sent successfully!
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSending}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {emailSending ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add Staff Member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Profile Settings</h3>
                <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={profileForm.contactNo}
                  onChange={(e) => setProfileForm({...profileForm, contactNo: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Type</label>
                <select
                  value={profileForm.hostelType}
                  onChange={(e) => setProfileForm({...profileForm, hostelType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BOYS_HOSTEL">Boys Hostel</option>
                  <option value="GIRLS_HOSTEL">Girls Hostel</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.old ? "text" : "password"}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({...showPassword, old: !showPassword.old})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardenDashboard;
