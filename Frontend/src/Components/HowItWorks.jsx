import React from "react";
import { MessageCircle, Send, BrainCircuit, BellRing } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const steps = [
  {
    icon: <Send size={30} />,
    title: "Start Chat",
    desc: "Send a message on WhatsApp or SMS to begin the conversation.",
    link: "/dashboard/chatbot",
  },
  {
    icon: <MessageCircle size={30} />,
    title: "Ask Health Query",
    desc: "Ask symptoms, disease awareness, first aid, or vaccination schedule.",
    link: "/dashboard/chatbot",
  },
  {
    icon: <BrainCircuit size={30} />,
    title: "Get AI Response",
    desc: "Our multilingual AI chatbot provides accurate health answers.",
    link: "/dashboard/chatbot",
  },
  {
    icon: <BellRing size={30} />,
    title: "Alerts & Reminders",
    desc: "Receive outbreak alerts and vaccination reminders on time.",
    link: "/dashboard/outbreak-alert",
  },
];

const HowItWorks = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/";

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <div className="bg-[#e0f7fa] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#004d40] mb-10">
            How It Works
          </h2>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Link to={step.link} key={i}>
                <div
                  className="bg-[#00acc1]/15 hover:bg-[#00acc1]/25 transition-all
                             p-6 rounded-2xl shadow-md cursor-pointer
                             hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex justify-center mb-4 text-[#00796b]">{step.icon}</div>
                  <h3 className="text-xl font-semibold text-[#004d40] mb-2">{step.title}</h3>
                  <p className="text-[#004d40] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <Link to="/login">
              <div
                className="bg-gradient-to-r from-[#00acc1] to-[#00796b] text-white
                           py-3 px-6 inline-block rounded-lg shadow-lg text-lg font-semibold
                           cursor-pointer transition hover:opacity-90"
              >
                Try Demo — Experience Real-time AI Health Support
              </div>
            </Link>
          </div>

        </div>
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default HowItWorks;