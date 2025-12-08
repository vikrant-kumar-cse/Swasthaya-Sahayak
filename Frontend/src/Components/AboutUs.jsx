import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Users, ShieldCheck, MessageCircle } from "lucide-react";

const info = [
  {
    icon: <HeartPulse size={28} />,
    title: "Purpose of the Platform",
    description:
      "An AI chatbot designed to improve preventive healthcare awareness in rural and semi-urban communities.",
  },
  {
    icon: <Users size={28} />,
    title: "Who We Help",
    description:
      "Families, farmers, students, and local health workers who need simple and accurate medical guidance.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Why It Matters",
    description:
      "Lack of medical knowledge increases risk. Our platform ensures timely health education and alerts.",
  },
  {
    icon: <MessageCircle size={28} />,
    title: "How It Works",
    description:
      "Accessible via WhatsApp or SMS, providing answers in local languages with real-time outbreak notifications.",
  },
];

const AboutPlatform = () => {
  return (
    <div className="bg-[#e0f7fa] py-16">
      <div className="max-w-6xl mx-auto px-5">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#00695c] mb-12 font-['Roboto Slab']">
          About This Platform
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {info.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.06 }}
              className="p-6 rounded-xl bg-gradient-to-br from-[#00acc1] to-[#00796b]
              text-white shadow-lg
              hover:from-[#26c6da] hover:to-[#009688]
              hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center
                transition-all duration-300 hover:bg-white/30">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>

              <p className="text-sm opacity-95">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPlatform;
