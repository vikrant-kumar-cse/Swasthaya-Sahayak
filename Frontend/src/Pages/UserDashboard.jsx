import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserDashboardNavbar from "../Components/UserDashboardNavbar";
import UserDashboardFooter from "../Components/UserDashboardFooter";


const UserDashboard = () => {
  const location = useLocation();

  // Hide navbar only on chatbot route
  const hideNavbar = location.pathname === "/dashboard/chatbot";

  return (
    <>
      {/* Show navbar only when NOT on chatbot */}
      {!hideNavbar && <UserDashboardNavbar />}

      <div>
        <Outlet />
      </div>

      {/* You can show/hide footer similarly if needed */}
      {/* {!hideNavbar && <UserDashboardFooter />} */}
      <UserDashboardFooter />
    </>
  );
};

export default UserDashboard;
