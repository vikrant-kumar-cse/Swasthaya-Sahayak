import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, HeartHandshake, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const problems = [
  { icon: <AlertTriangle size={26} />, text: "Lack of correct medical information" },
  { icon: <Clock size={26} />, text: "Late awareness about diseases & outbreaks" },
  { icon: <HeartHandshake size={26} />, text: "Limited access to doctors in rural areas" },
  { icon: <ShieldCheck size={26} />, text: "Confusion due to unreliable sources" },
];

const ProblemStatement = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/"; // hide on landing page

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <div className="bg-[#e0f7fa] py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-1 md:order-none"
          >
            <img
              src="/ruler.jpg"
              alt="Rural Health Issues"
              className="rounded-2xl shadow-2xl hover:scale-[1.02] w-full transition-all duration-300"
            />
          </motion.div>

          {/* Right Text Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-[#004d40] text-center md:text-left"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 font-['Roboto Slab']">
              Problem & Our Solution
            </h2>

            <p className="text-base md:text-lg mb-6 leading-relaxed">
              Many rural and semi-urban communities struggle to access accurate healthcare information,
              which increases risk and delays treatment. Our platform bridges this gap.
            </p>

            <ul className="space-y-4">
              {problems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-base md:text-lg font-medium bg-[#00acc1]/15 p-3 rounded-lg hover:bg-[#00acc1]/25 transition-all"
                >
                  <span className="text-[#00796b]">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.35 }}
              className="mt-6 bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white py-3 px-5 inline-block rounded-lg shadow-lg font-semibold text-sm md:text-base"
            >
               Real-time verified health guidance
            </motion.div>
          </motion.div>
        </div>
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default ProblemStatement;