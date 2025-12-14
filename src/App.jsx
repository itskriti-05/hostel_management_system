import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import SignUp from "./pages/StudentSignUp/SignUp";
import Login from "./pages/StudentLogin/Login";
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard/WardenDashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Landing />
            </DefaultLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <DefaultLayout>
              <SignUp />
            </DefaultLayout>
          }
        />

        <Route
          path="/login"
          element={
            <DefaultLayout>
              <Login />
            </DefaultLayout>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <AuthLayout>
             
                <StudentDashboard/>
             
            </AuthLayout>
          }
        />
        <Route
          path="/warden-dashboard"
          element={
            <AuthLayout>
              <WardenDashboard/>
            </AuthLayout>
          }
          />
      </Routes>
    </BrowserRouter>
  );
}
