import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const slidesData = [
  {
    id: 1,
    title: "Multilingual AI Health Chatbot",
    description:
      "Our AI chatbot helps users receive instant healthcare guidance in local languages such as Hindi, Odia, and Bhojpuri. It provides preventive health tips, common disease symptoms, and accurate vaccination schedules.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop",
  },
  {
    id: 2,
    title: "Accessible via WhatsApp and SMS",
    description:
      "Even in areas with low or unstable internet, the chatbot works smoothly through WhatsApp and SMS. Users can get health updates, vaccination reminders, and basic medical advice without any app download.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1600&h=900&fit=crop",
  },
  {
    id: 3,
    title: "Real-Time Alerts & Govt. Data Integration",
    description:
      "The system is connected with government health databases, enabling it to provide verified vaccination dates, disease outbreak alerts, and essential public health information in real time.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=900&fit=crop",
  },
  {
    id: 4,
    title: "Rural-Friendly Features",
    description:
      "Designed for rural communities, the platform works on low data, supports simple language, offers voice input, and provides audio replies for users with low literacy levels.",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1600&h=900&fit=crop",
  },
  {
    id: 5,
    title: "Trusted & Accurate Health Guidance",
    description:
      "With over 80% response accuracy, the chatbot delivers reliable health information, reduces misinformation, and ensures timely access to proper treatment.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1600&h=900&fit=crop",
  },
];

const HeroSection = ({ interval = 5000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slidesData.length;

  const goToNextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const sliderInterval = setInterval(goToNextSlide, interval);
    return () => clearInterval(sliderInterval);
  }, [goToNextSlide, interval]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div
        className="flex h-full transition-transform duration-[1200ms] ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}vw)` }}
      >
        {slidesData.map((slide, index) => (
          <div
            key={slide.id}
            className="relative flex-none w-screen h-full flex items-center justify-center"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Light Overlay with #e0f7fa */}
            <div className="absolute inset-0 bg-[#e0f7fa] bg-opacity-70" />

            {/* Content */}
            <div
              className={`relative z-10 max-w-4xl px-6 text-center text-black transition-all duration-700 ${
                activeIndex === index
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-90 translate-y-6"
              }`}
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                {slide.title}
              </h1>

              <p className="text-lg sm:text-xl leading-relaxed mb-10 opacity-90">
                {slide.description}
              </p>

              {/* Get Started Button */}
              <Link to="/dashboard">
                <button className="px-10 py-4 text-xl bg-gradient-to-r from-[#00acc1] to-[#00796b] font-semibold rounded-full shadow-2xl hover:scale-110 transition-all duration-300">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Controls */}
      <button
        onClick={goToPrevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-lg text-black rounded-full flex items-center justify-center text-3xl hover:bg-white/50 transition"
      >
        ‹
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-lg text-black rounded-full flex items-center justify-center text-3xl hover:bg-white/50 transition"
      >
        ›
      </button>

      {/* Slide Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slidesData.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === activeIndex ? "w-10 h-3 bg-black" : "w-3 h-3 bg-black/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;