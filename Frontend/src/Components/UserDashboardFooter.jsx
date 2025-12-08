import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const UserDashboardFooter = () => {
  return (
    <footer className="bg-[#004d40] text-white px-6 py-12 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* About */}
          <div>
            <h3 className="font-bold mb-3 text-lg">About MedPulse</h3>
            <p className="text-sm text-[#b2dfdb] leading-relaxed">
              AI-Driven Public Health Chatbot to educate rural and semi-urban 
              populations about preventive healthcare, disease symptoms, 
              and vaccination schedules.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-3 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-[#b2dfdb] text-sm">
              <li><a href="/dashboard/health-awareness" className="hover:text-white">Health Awareness</a></li>
              <li><a href="/dashboard/common-diseases" className="hover:text-white">Common Diseases</a></li>
              <li><a href="/dashboard/whatsapp-bot" className="hover:text-white">AI Chatbot</a></li>
              <li><a href="/dashboard/govt-programs" className="hover:text-white">Govt Programs</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-3 text-lg">Support</h3>
            <ul className="space-y-2 text-[#b2dfdb] text-sm">
              <li><a href="/dashboard/profile" className="hover:text-white">Profile</a></li>
              <li><a href="/dashboard/settings" className="hover:text-white">Settings</a></li>
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
            </ul>
          </div>

          {/* Social Icons */}
          <div>
            <h3 className="font-bold mb-3 text-lg">Follow Us</h3>
            <div className="flex space-x-4 text-[#b2dfdb]">
              <Facebook className="hover:text-[#00acc1] hover:scale-110 transition" size={20} />
              <Twitter className="hover:text-[#00acc1] hover:scale-110 transition" size={20} />
              <Instagram className="hover:text-[#00acc1] hover:scale-110 transition" size={20} />
              <Linkedin className="hover:text-[#00acc1] hover:scale-110 transition" size={20} />
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="text-center text-[#b2dfdb] mt-8 text-sm">
          &copy; {new Date().getFullYear()} MedPulse. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default UserDashboardFooter;
