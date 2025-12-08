import React from "react";
import { MessageCircle, Newspaper, Bell, Syringe, Send, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LandingFeatures = () => {
  const features = [
    {
      icon: <MessageCircle size={42} />,
      title: "AI Healthcare Chatbot",
      desc: "Ask medical questions, symptoms, and prevention guidelines in real time.",
      link: "/dashboard/chatbot",
      btn: "Use Chatbot"
    },
    {
      icon: <Newspaper size={42} />,
      title: "Expert Medical Blogs",
      desc: "Read real healthcare articles written by doctors & medical professionals.",
      link: "/dashboard/blog",
      btn: "Read Blogs"
    },
    {
      icon: <Syringe size={42} />,
      title: "Vaccination Updates",
      desc: "Track vaccination schedules, reminders & nearest healthcare centers.",
      link: "/dashboard/vaccinations",
      btn: "Check Vaccines"
    },
    {
      icon: <Send size={42} />,
      title: "Ask Health Queries",
      desc: "Submit your personal health concerns securely to medical experts.",
      link: "/dashboard/health-queires",   // fixed route
      btn: "Ask Query"
    },
    {
      icon: <Bell size={42} />,
      title: "Health Alerts",
      desc: "Know which disease is spreading in your city & protect yourself.",
      link: "/dashboard/outbreak",
      btn: "View Alerts"
    },
    {
      icon: <UserCheck size={42} />,
      title: "Profile & Reports",
      desc: "Manage account, health history & reports inside your dashboard.",
      link: "/dashboard/profile",
      btn: "Go to Profile"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      
      <section className="text-center px-6 py-10">
        <motion.h1
          className="text-4xl font-bold text-teal-700"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome to MedPulse Healthcare Dashboard
        </motion.h1>

        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          Click any feature below and start exploring modern digital public healthcare assistance.
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-12">
        {features.map((item, i) => (
          <motion.div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-xl hover:-translate-y-1 transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="text-teal-600 mb-3">{item.icon}</div>
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.desc}</p>

            <Link
              to={item.link}
              className="inline-block px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
            >
              {item.btn} →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LandingFeatures;