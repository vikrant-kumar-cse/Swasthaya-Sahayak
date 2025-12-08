// AdminDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../Components/AdminNavbar"; // your admin navbar

const AdminDashboard = () => {
  return (
    <div>
      <AdminNavbar />
      <div style={{ paddingTop: "150px" }}>
        {/* Nested routes will render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
