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

function AppRoutes() {

  return (

    <Routes>

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

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/assistant"
        element={<AssistantDashboard />}
      />

      <Route
        path="/users"
        element={<Users />}
      />

    </Routes>

  );

}

export default AppRoutes;