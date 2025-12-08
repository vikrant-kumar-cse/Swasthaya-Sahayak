import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Users, MessageCircle, ShieldCheck } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const purposes = [
  {
    icon: <HeartPulse size={26} />,
    title: "Promote Preventive Healthcare",
    text: "Helping people understand symptoms early and avoid serious diseases through awareness.",
  },
  {
    icon: <Users size={26} />,
    title: "Serve Rural & Semi-Urban Communities",
    text: "Delivering essential health knowledge in local languages without requiring internet access.",
  },
  {
    icon: <MessageCircle size={26} />,
    title: "AI 24/7 Chatbot Support",
    text: "Providing instant responses for common health questions, precautions, and vaccination schedules.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Trusted & Verified Health Data",
    text: "Connected with government health databases for real-time outbreak alerts & reliable guidance.",
  },
];

const PurposeOfPlatform = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/"; // hide on landing page

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <div className="bg-[#e0f7fa] py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-[#004d40] order-2 md:order-none text-center md:text-left"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-['Roboto Slab']">
              Purpose of the Platform
            </h2>

            <p className="text-base md:text-lg mb-6 leading-relaxed">
              Our platform is designed to build a healthier future by making preventive healthcare
              knowledge easily accessible for every citizen—no matter where they live.
            </p>

            <ul className="space-y-4">
              {purposes.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 bg-[#00acc1]/15 p-3 rounded-lg hover:bg-[#00acc1]/25 transition-all"
                >
                  <span className="text-[#00796b] mt-1">{item.icon}</span>
                  <span>
                    <strong className="block text-sm md:text-lg">{item.title}</strong>
                    <span className="text-[13px] md:text-[15px]">{item.text}</span>
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="mt-6 text-center md:text-left">
              <Link to="/login">
                <motion.div
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white py-3 px-5 inline-block rounded-lg shadow-lg font-semibold text-sm md:text-base cursor-pointer hover:scale-105 transform transition-all duration-300"
                >
                   Try a Demo — Experience Real-time Health Guidance
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-1 md:order-none"
          >
            <img
              src="/Solution.png"
              alt="Healthcare Awareness Image"
              className="rounded-2xl shadow-2xl hover:scale-[1.02] w-full transition-all duration-300"
            />
          </motion.div>
        </div>
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default PurposeOfPlatform;