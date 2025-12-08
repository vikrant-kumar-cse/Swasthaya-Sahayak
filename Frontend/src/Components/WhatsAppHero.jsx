import React from "react";

const WhatsAppHero = () => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-100 py-20 relative overflow-hidden">
      {/* Simple decorative circles */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-green-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-teal-200/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16 relative z-10">
        
        {/* Left Text Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block mb-4">
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
               Connect Instantly
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-teal-900 mb-6">
            Join via<br />
            <span className="text-green-600">WhatsApp</span>
          </h1>
          
          <p className="text-teal-700 text-xl mb-8 leading-relaxed">
            Scan the QR code below to instantly connect with our healthcare services. Get updates, book appointments, and more.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-teal-800 font-medium">24/7 Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-teal-800 font-medium">Secure & Private</span>
            </div>
          </div>
        </div>

        {/* Right QR Code Section */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-teal-400 rounded-3xl blur-2xl opacity-20"></div>
            
            {/* QR Code Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8">
              {/* QR Code */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 w-80 h-80 flex items-center justify-center">
                <img
                  src="/whatsapp qr .jpg"
                  alt="WhatsApp QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.outerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-white rounded-xl">
                        <div class="text-center">
                          <svg class="w-56 h-56 mx-auto text-gray-300" fill="currentColor" viewBox="0 0 100 100">
                            <rect x="0" y="0" width="25" height="25" />
                            <rect x="30" y="0" width="5" height="5" />
                            <rect x="40" y="0" width="5" height="5" />
                            <rect x="50" y="0" width="5" height="5" />
                            <rect x="75" y="0" width="25" height="25" />
                            <rect x="5" y="5" width="15" height="15" fill="white"/>
                            <rect x="80" y="5" width="15" height="15" fill="white"/>
                            <rect x="10" y="10" width="5" height="5" />
                            <rect x="85" y="10" width="5" height="5" />
                            <rect x="0" y="30" width="5" height="5" />
                            <rect x="30" y="35" width="40" height="5" />
                            <rect x="35" y="45" width="30" height="5" />
                            <rect x="0" y="75" width="25" height="25" />
                            <rect x="5" y="80" width="15" height="15" fill="white"/>
                            <rect x="10" y="85" width="5" height="5" />
                            <rect x="40" y="80" width="5" height="5" />
                            <rect x="50" y="75" width="5" height="5" />
                            <rect x="75" y="85" width="10" height="10" />
                          </svg>
                          <p class="text-gray-400 text-sm mt-2">Scan QR Code</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
              
              {/* Instructions */}
              <div className="text-center">
                <h3 className="text-teal-900 font-bold text-xl mb-2">
                  Scan to Connect
                </h3>
                <p className="text-teal-600 text-sm">
                  Open WhatsApp and scan this code
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Bottom Help Section */}
      <div className="max-w-4xl mx-auto mt-16 px-6">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-teal-100 rounded-full p-3">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-teal-900">Need Help?</h4>
                <p className="text-sm text-teal-700">
                  Scan the QR code and access WhatsApp
                </p>
              </div>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-md">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppHero;