import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import JobsManager from "./pages/JobsManager";
import Pipeline from "./pages/Pipeline";
import Careers from "./pages/Careers"; // 👈 add this
import JobApply from "./pages/JobApply";
import PipelineJob from "./pages/PipelineJob";
import CandidateDetail from "./pages/CandidateDetail";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
// Guard wrapper
function ProtectedRoute() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function DashboardLayout() {
  return <Outlet />;
}

export default function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      <ScrollToTop />
      <Navbar onLogout={handleLogout} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Careers />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobs/:jobId" element={<JobApply />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/pipeline" replace />
            ) : (
              <Login onAuthSuccess={() => setIsAuthenticated(true)} />
            )
          }
        />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="pipeline" replace />} />
            <Route path="/dashboard/pipeline" element={<Pipeline />} />
            <Route
              path="/dashboard/pipeline/:jobId"
              element={<PipelineJob />}
            />
            <Route
              path="/dashboard/pipeline/:jobId/candidate/:appId"
              element={<CandidateDetail />}
            />
            <Route path="jobs" element={<JobsManager />} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
