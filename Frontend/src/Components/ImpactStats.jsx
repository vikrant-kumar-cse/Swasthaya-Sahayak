import React from "react";
import { useLocation, Link } from "react-router-dom";
import { PhoneCall, Siren, Baby, Hospital, Mic, MapPin } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const scenarios = [
  {
    icon: <PhoneCall size={30} />,
    title: "Emergency Fever Case at Night",
    description:
      "Immediate first-aid steps and nearest hospital guidance when medical help is unavailable.",
    img: "/images/fever.jpg",
    link: "/dashboard/chatbot"
  },
  {
    icon: <Siren size={30} />,
    title: "Sudden Outbreak in Village",
    description:
      "AI detects cases and sends preventive alerts via SMS and WhatsApp.",
    img: "/images/outbreak.jpg",
    link: "/dashboard/chatbot"
  },
  {
    icon: <Baby size={30} />,
    title: "Pregnancy & Mother Care",
    description:
      "Vaccination reminders, nutrition tips and checkup alerts in local language.",
    img: "/images/mother.jpg",
    link: "/dashboard/chatbot"
  },
  {
    icon: <Hospital size={30} />,
    title: "Health Camp & Blood Donation",
    description:
      "Automatic notifications for free medical camps and blood donation drives.",
    img: "/images/healthcamp.jpg",
    link: "/dashboard/chatbot"
  },
  {
    icon: <Mic size={30} />,
    title: "Voice-Based Support",
    description:
      "Speak queries in local language and get verified responses without typing.",
    img: "/images/voice.jpg",
    link: "/dashboard/chatbot"
  },
  {
    icon: <MapPin size={30} />,
    title: "Nearest Healthcare Help",
    description:
      "Guidance to hospitals, PHC/CHC, ASHA workers and emergency helplines.",
    img: "/images/nearest.jpg",
    link: "/dashboard/doctor-near-me"
  },
];

const ImpactScenarios = () => {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/";

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <div className="bg-[#e0f7fa] py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-[#004d40] mb-12">
            Real-Life Scenarios We Solve
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {scenarios.map((scenario, index) => (
              <Link to={scenario.link} key={index}>
                <div
                  className="relative p-6 rounded-xl min-h-[250px] flex flex-col justify-center text-center cursor-pointer
                             shadow-lg bg-[#00acc1]/15 hover:bg-[#00acc1]/25 transition-all
                             hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm hover:opacity-30 transition-all"
                    style={{ backgroundImage: `url(${scenario.img})` }}
                  ></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#00796b]/10 hover:bg-[#00796b]/20 transition-all">
                      <span className="text-[#00796b]">{scenario.icon}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#004d40] mb-2">{scenario.title}</h3>
                    <p className="text-[#004d40] text-sm leading-5">{scenario.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default ImpactScenarios;