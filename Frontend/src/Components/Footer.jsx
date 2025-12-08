import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [coords, setCoords] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const mapUrl =
    coords.lat && coords.lng
      ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=es;z=14&output=embed`
      : "";

  return (
    <footer className="bg-[#00796b] text-white py-12 font-[Poppins]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* About Section */}
          <div>
            <img
              src="/MedPulse logo.jpg"
              alt="MedPulse Logo"
              className="h-14 mb-4"
            />
            <p className="text-sm leading-6 text-[#e0f2f1]">
              MedPulse is a multilingual AI healthcare assistant supporting rural
              and semi-urban communities with preventive health education,
              symptom guidance & vaccination alerts linked with Govt datasets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/dashboard/chatbot" className="hover:underline">Health Awareness</Link></li>
              <li><Link to="/dashboard/chatbot" className="hover:underline">Symptom Checker</Link></li>
              <li><Link to="/dashboard/chatbot" className="hover:underline">Vaccinations</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Contact</h5>
            <p className="text-sm text-[#e0f2f1]">Government of Odisha</p>
            <p className="text-sm text-[#e0f2f1]">Electronics & IT Department</p>
            <p className="text-sm text-[#e0f2f1]">Email: info@medpulse.gov.in</p>
            <p className="text-sm text-[#e0f2f1]">Phone: +91 12345 67890</p>
          </div>

          {/* Google Map Small Widget */}
          <div className="flex flex-col items-center md:items-end">
            <h5 className="text-lg font-semibold mb-3"> Your Location</h5>
            {coords.lat ? (
              <iframe
                title="current-location-map"
                src={mapUrl}
                width="200"
                height="150"
                style={{ border: 0, borderRadius: "10px" }}
                allowFullScreen
                loading="lazy"
                className="shadow-md"
              />
            ) : (
              <p className="text-xs text-[#cce7e6]">Fetching location...</p>
            )}
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-[#00594d] mt-10 pt-5 text-center text-xs text-[#cce7e6]">
          © 2025–26 Smart India Hackathon | All Rights Reserved | Project ID: SIH25049
        </div>
      </div>
    </footer>
  );
};

export default Footer;