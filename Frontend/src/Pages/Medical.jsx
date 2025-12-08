import React from "react";
import { MessageSquare, FileText, Activity, ClipboardList, AlertTriangle, BarChart3, ArrowRight, Stethoscope } from "lucide-react";

const MedicalExpertLanding = () => {
  const features = [
    {
      icon: <Activity size={42} />,
      title: " Outbreak Dashboard ",
      desc: "View comprehensive analytics, patient statistics, and health trends at a glance.",
      link: "/Medical-dashboard/Dashboard",
      btn: "View Dashboard",
    },
    {
      icon: <MessageSquare size={42} />,
      title: "Patient Queries",
      desc: "Respond to patient health concerns and provide expert medical guidance.",
      link: "/Medical-dashboard/patient-queries",
      btn: "Answer Queries",
    },
    {
      icon: <FileText size={42} />,
      title: "Create Medical Blogs",
      desc: "Share your medical expertise by writing informative health articles and blogs.",
      link: "/Medical-dashboard/create-blog",
      btn: "Write Blog",
    },
    {
      icon: <ClipboardList size={42} />,
      title: "Daily Health Check",
      desc: "Monitor and record daily health assessments and patient check-ups systematically.",
      link: "/Medical-dashboard/Dailycheak",
      btn: "Daily Check",
    },
    {
      icon: <AlertTriangle size={42} />,
      title: "Outbreak Management",
      desc: "Track and manage disease outbreaks in your region with real-time updates.",
      link: "/Medical-dashboard/AllOutbreak",
      btn: "Manage Outbreaks",
    },
    {
      icon: <BarChart3 size={42} />,
      title: "Health Analytics",
      desc: "Access detailed reports and data visualization for better decision making.",
      link: "/Medical-dashboard/Dashboard",
      btn: "View Analytics",
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen py-16 px-6 md:px-12">
        {/* Intro Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4 shadow-sm">
            <Stethoscope size={18} />
            Medical Expert Portal
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
             Healthcare Management
          </h2>
          <p className="text-indigo-700 text-lg md:text-xl">
            Empower your medical practice with comprehensive tools for patient care, outbreak monitoring, and health education.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div
              key={i}
              className="relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden p-8 flex flex-col items-start group hover:-translate-y-1"
            >
              {/* Soft circular background */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>

              {/* Icon */}
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="text-indigo-600">
                  {item.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-2xl mb-2 text-indigo-900">{item.title}</h3>

              {/* Description */}
              <p className="text-indigo-700 mb-6 flex-grow">{item.desc}</p>

              {/* Button */}
              <a
                href={item.link}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {item.btn} <ArrowRight size={18} />
              </a>
            </div>
          ))}
        </div>

             </div>
    </>
  );
};

export default MedicalExpertLanding;