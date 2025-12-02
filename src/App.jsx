// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import SignUp from "./pages/StudentSignUp/SignUp";
import Login from "./pages/StudentLogin/Login";
import Dashboard from "./pages/StudentDashboard/StudentDashboard";

import DefaultLayout from "./layouts/DefaultLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages use DefaultLayout */}
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Landing />
            </DefaultLayout>
          }
        />

        {/* Auth pages without header/footer */}
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          }
        />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        {/* Protected dashboard (no header/footer) */}
        <Route
          path="/dashboard"
          element={
            <AuthLayout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </AuthLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
