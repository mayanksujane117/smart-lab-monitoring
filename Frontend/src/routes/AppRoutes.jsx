import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import AssistantDashboard from "../pages/AssistantDashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Users from "../pages/Users";
import LabDetails from "../pages/LabDetails";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {

  return (

    <Routes>

      {/* PUBLIC ROUTES */}

      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* ADMIN ONLY */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            roles={["admin"]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN + ASSISTANT */}

      <Route
        path="/assistant"
        element={
          <ProtectedRoute
            roles={[
              "admin",
              "assistant"
            ]}
          >
            <AssistantDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lab/:labName"
        element={
          <ProtectedRoute
            roles={[
              "admin",
              "assistant"
            ]}
          >
            <LabDetails />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ONLY */}

      <Route
        path="/users"
        element={
          <ProtectedRoute
            roles={["admin"]}
          >
            <Users />
          </ProtectedRoute>
        }
      />

      {/* INVALID URL */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
          />
        }
      />

    </Routes>

  );

}

export default AppRoutes;