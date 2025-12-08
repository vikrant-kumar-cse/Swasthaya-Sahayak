import React from "react";
import { Outlet } from "react-router-dom";
import MedicalExpertNavbar from "../Components/MedicalExpertNavbar"; // your navbar
import Footer from "../Components/Footer";
const MedicalDashboard = () => {
  return (
    <div>
      <MedicalExpertNavbar />
      <div >
        {/* Nested routes like patient queries, records, alerts will render here */}
        <Outlet />
        <Footer />
      </div>
      
      
      
    </div>
  );
};

export default MedicalDashboard;
