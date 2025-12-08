import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import Services from "../Components/Services";
import HowItWorks from "../Components/HowItWorks";
import ProblemStatement from "../Components/ProblemStatement";
import PurposeOfPlatform from "../Components/PurposeOfPlatform";
import ImpactStats from "../Components/ImpactStats";

const LandingPage = () => {
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f2f7ff",
       
      }}
    >
      {/* Navbar */}
      <Navbar />
     

      {/* Hero Section */}
      <HeroSection />
      <ProblemStatement />
   <PurposeOfPlatform />

      {/* Services Section */}
      <Services />
      <HowItWorks />
      <ImpactStats />

      

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
