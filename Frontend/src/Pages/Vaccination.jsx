import React, { useState } from "react";

const Vaccination = () => {
  const [selected, setSelected] = useState("child");

  const renderContent = () => {
    switch (selected) {
      case "child":
        return (
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-semibold text-[#00695c]">Child Vaccination</h2>
            <p>
              Vaccination protects children from serious and life-threatening diseases. 
              Timely vaccination is crucial for building immunity.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Recommended Schedule:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>BCG:</strong> At birth – protects against tuberculosis</li>
                <li><strong>Hepatitis B:</strong> Birth, 6 weeks, 10 weeks, 14 weeks – protects liver infections</li>
                <li><strong>Polio:</strong> Birth, 6, 10, 14 weeks – prevents polio</li>
                <li><strong>DTP:</strong> 6, 10, 14 weeks – protects against Diphtheria, Tetanus, Pertussis</li>
                <li><strong>MMR:</strong> 9 months & 15 months – prevents Measles, Mumps, Rubella</li>
              </ul>
            </div>
          </div>
        );
      case "adult":
        return (
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-semibold text-[#00695c]">Adult Vaccination</h2>
            <p>
              Adults also need vaccines to stay protected against seasonal and emerging diseases.
              Vaccination is especially important for seniors, healthcare workers, and chronic patients.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Key Vaccines for Adults:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Influenza:</strong> Every year – seasonal flu protection</li>
                <li><strong>Tetanus:</strong> Booster every 10 years – wound and tetanus protection</li>
                <li><strong>Hepatitis B:</strong> For unvaccinated adults – liver protection</li>
                <li><strong>COVID-19:</strong> As per latest government guidelines</li>
                <li><strong>MMR booster:</strong> If not received in childhood</li>
              </ul>
            </div>
          </div>
        );
      case "govt":
        return (
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-semibold text-[#00695c]">Government Vaccination Programs</h2>
            <p>
              The government provides free vaccination programs to ensure public health and 
              prevent outbreaks. These programs cover children, adults, and high-risk groups.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Major Programs:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>National Immunization Program (NIP):</strong> Ensures vaccination for all children</li>
                <li><strong>Mission Indradhanush:</strong> Aims to cover children who missed routine vaccines</li>
                <li><strong>Polio Eradication:</strong> Nationwide campaigns to prevent polio</li>
                <li><strong>Adult Immunization:</strong> Seasonal campaigns like Influenza & COVID-19 vaccination</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#00796b] mb-6">Vaccinations</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelected("child")}
          className={`px-4 py-2 rounded-lg font-medium ${
            selected === "child"
              ? "bg-[#00acc1] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-[#b2ebf2]"
          }`}
        >
          Child Vaccination
        </button>
        <button
          onClick={() => setSelected("adult")}
          className={`px-4 py-2 rounded-lg font-medium ${
            selected === "adult"
              ? "bg-[#00acc1] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-[#b2ebf2]"
          }`}
        >
          Adult Vaccination
        </button>
        <button
          onClick={() => setSelected("govt")}
          className={`px-4 py-2 rounded-lg font-medium ${
            selected === "govt"
              ? "bg-[#00acc1] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-[#b2ebf2]"
          }`}
        >
          Govt Programs
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">{renderContent()}</div>

      {/* Schedule / Reminder Section */}
      <div className="mt-8 bg-[#e0f7fa] p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-[#00796b] mb-4">Set a Vaccination Reminder</h2>
        <form className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1] flex-1"
          />
          <input
            type="date"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00acc1]"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#00796b] text-white rounded-lg hover:bg-[#004d40]"
          >
            Set Reminder
          </button>
        </form>
        <p className="text-gray-600 mt-2 text-sm">
          We'll remind you on the selected date so you never miss your vaccination.
        </p>
      </div>
    </div>
  );
};

export default Vaccination;
