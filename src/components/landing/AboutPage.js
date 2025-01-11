import React from "react";
import { Link, useNavigate } from "react-router-dom";
import quotumLogo from "../../assets/quotum-no-bg.png";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#111] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src={quotumLogo} alt="Quotum Logo" className="h-12 w-auto" />
              <span className="text-white text-xl ml-3 font-semibold">
                Quotum.cloud
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Profiles Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Omar's Profile */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <img
                src="https://media.licdn.com/dms/image/v2/C5603AQFbuiqzEyL7VA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1640099576864?e=1741824000&v=beta&t=h4bAp4XXlISJrvNwZZOZtAVrClt9BY9Sj_LE6sKbxn8"
                alt="Omar Nassar"
                className="w-32 h-32 rounded-full mb-4"
              />
              <h1 className="text-3xl font-semibold mb-2">Omar Nassar</h1>
              <p className="text-gray-700 text-lg">
                A dynamic co-founder of Quotum.Cloud, Omar bridges technology
                and finance to deliver cutting-edge solutions. With a proven
                track record of growing a $15,000 crypto fund to $540,000 in a
                single year, he combines data-driven insights, AI innovation,
                and blockchain expertise to empower investors and businesses
                alike. His technical acumen and market strategies are the
                backbone of Quotum.Cloud.
              </p>
            </div>

            {/* Robin's Profile */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <img
                src="https://media.licdn.com/dms/image/v2/C4E03AQEr5woGaAxODg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1654520011909?e=1741824000&v=beta&t=vgp-ya12VnurE1Ilr7XxKdaO-QDXGgYR-Qeto63i6RI"
                alt="Robin Bril"
                className="w-32 h-32 rounded-full mb-4"
              />
              <h1 className="text-3xl font-semibold mb-2">Robin Bril</h1>
              <p className="text-gray-700 text-lg">
                A Cum Laude Business Administration graduate and seasoned
                business analyst, Robin brings a wealth of experience in project
                management, data analysis, and process optimization. At
                Quotum.Cloud, he leads with a data-driven approach, crafting
                financial insights and optimizing user experiences. With a
                history of winning investment competitions and driving
                successful strategies, Robin is a cornerstone of Quotum's
                innovative vision.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#111] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-4 mb-8 md:mb-0">
            {/* Logo and Company Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <img
                  src={quotumLogo}
                  alt="Quotum Logo"
                  className="h-12 w-auto"
                />
                <span className="text-white text-xl ml-3 font-semibold">
                  Quotum.cloud
                </span>
              </div>
              <p className="text-sm max-w-xs">
                Advanced crypto analytics and market insights for serious
                traders.
              </p>
            </div>

            {/* Quick Links - Centered Grid */}
            <div className="grid grid-cols-2 gap-8 md:gap-16 w-full md:w-auto md:max-w-md justify-center mx-auto md:mx-0">
              {/* Products */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-white font-semibold mb-2">Platform</h3>
                <a
                  href="#introduction"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("introduction");
                    if (element) {
                      const offset = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="text-sm hover:text-white transition-colors cursor-pointer"
                >
                  Intro
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("pricing");
                    if (element) {
                      const offset = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="text-sm hover:text-white transition-colors cursor-pointer"
                >
                  VIP Access
                </a>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("features");
                    if (element) {
                      const offset = 80;
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="text-sm hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </a>
              </div>

              {/* Company */}
              <div className="flex flex-col space-y-3">
                <h3 className="text-white font-semibold mb-2">Company</h3>
                <Link
                  to="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  to="/legal"
                  className="text-sm hover:text-white transition-colors"
                >
                  Legal
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-sm order-2 sm:order-1">
                © {new Date().getFullYear()} Quotum. All rights reserved.
              </div>

              {/* Social Links */}
              <div className="flex space-x-6 order-1 sm:order-2">
                <a
                  href="https://x.com/GodelTrabuco69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://t.me/QuotumC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.554.223l.198-2.8 5.106-4.618c.222-.196-.054-.304-.346-.108L7.83 13.775l-2.718-.816c-.59-.182-.608-.59.124-.873l10.614-4.103c.48-.176.905.114.044.238z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/31621573027"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.004 0C5.374 0 0 5.374 0 12c0 2.113.553 4.176 1.604 5.984L.059 23.97a.5.5 0 00.636.623l5.94-1.518A11.978 11.978 0 0012.004 24c6.63 0 12-5.374 12-12 0-6.63-5.37-12-12-12zm7.053 16.964c-.226.625-1.309 1.198-1.805 1.276-.497.08-1.084.11-1.732-.155a16.892 16.892 0 01-1.938-.854c-3.379-1.865-5.59-5.176-5.77-5.43-.18-.255-1.375-1.828-1.375-3.474 0-1.646.869-2.468 1.177-2.793.308-.326.679-.354.905-.354.225 0 .452.002.653.01.201.008.507-.09.792.603.285.695.967 2.402 1.048 2.578.082.176.137.384.025.617-.111.234-.167.382-.333.585-.164.202-.347.45-.49.603-.164.174-.335.363-.145.716.19.352.846 1.399 1.812 2.263.885.787 2.244 1.551 2.627 1.723.383.174.6.146.826-.087.225-.233.968-1.117 1.226-1.503.259-.385.516-.326.87-.196.354.13 2.231 1.053 2.614 1.242.382.19.637.288.733.45.096.163.096.946-.13 1.571z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
