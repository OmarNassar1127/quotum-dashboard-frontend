import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChartBar,
  ArrowUpDown,
  LineChart,
  Users,
  Play,
  ChevronDown,
} from "lucide-react";
import quotumLogo from "../../assets/quotum-no-bg.png";
import OneMonth from "../../assets/OneMonth.webp";
import ThreeMonth from "../../assets/ThreeMonth.webp";
import SixMonth from "../../assets/SixMonth.webp";

// Basic Features (used for 1-month subscriptions)
const basicFeatures = [
  "Step-by-Step Video Tutorials",
  "Weekly Market Updates",
  "VIP Telegram Channel",
  "Quotum Dashboard",
  "Market Risk Levels",
];

// Advanced Features (used for 3 and 6-month subscriptions)
const advancedFeatures = [
  "Full Basic Package",
  "Market Exit Signals",
  "Whale Sell Signals",
  "1-on-1 direct support",
  "Month 2 Upgrade",
];

// FAQ Component
const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-6 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-6">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

// Subscription Card Component
const SubscriptionCard = ({
  months,
  price,
  isPopular = false,
  isBestDeal = false,
  features = [],
  image,
}) => {
  const navigate = useNavigate();

  const handleSubscriptionClick = () => {
    const planKey = `${months}month${months > 1 ? "s" : ""}`;
    navigate(`/payment/${planKey}`);
  };

  return (
    <div
      className="bg-black rounded-2xl p-6 flex flex-col relative transform transition-all hover:scale-105 cursor-pointer"
      onClick={handleSubscriptionClick}
    >
      {isPopular && (
        <span className="absolute -top-3 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
          Most Popular
        </span>
      )}
      {isBestDeal && (
        <span className="absolute -top-3 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
          Best Deal
        </span>
      )}
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <img
            src={image}
            alt={`${months}-month subscription`}
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h3 className="text-2xl font-bold text-white mb-4">
            {months} MONTHS
          </h3>
          <p className="text-gray-400 mb-6">
            {months === 1
              ? "Get access to the basic features and see if QUOTUM VIP is the right fit for you!"
              : `Go beyond the basics with advanced features, deeper insights, and extended support for your ${months}-month journey!`}
          </p>
          {/* Render Feature List */}
          <ul className="text-gray-400 space-y-2 list-disc list-inside">
            {features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <p className="text-3xl font-bold text-white mb-4 mt-4">€{price}</p>
          <button className="w-full py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors">
            JOIN NOW
          </button>
        </div>
      </div>
    </div>
  );
};

const Testimonial = ({ text, author, date, rating = 5 }) => (
  <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 text-[#FF6B00]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-gray-800 mb-6">{text}</p>
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
        {author[0]}
      </div>
      <div className="ml-4">
        <h4 className="font-semibold text-gray-900">{author}</h4>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#111] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img src={quotumLogo} alt="Quotum Logo" className="h-12 w-auto" />
              <span className="text-white text-xl ml-3 font-semibold">
                Quotum.cloud
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-[#FF6B00] text-white hover:bg-[#ff8533] transition-colors"
              >
                JOIN VIP
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 bg-gradient-to-b from-[#111] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
              Ready to change your life?
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Take control of your crypto investments with advanced analytics,
              whale tracking, and precise market indicators.
            </p>
            <div className="mt-10 flex justify-center gap-6">
              <Link
                to="/register"
                className="px-8 py-4 rounded-md bg-[#FF6B00] text-white font-medium hover:bg-[#ff8533] transition-colors inline-flex items-center text-lg"
              >
                JOIN QUOTUM VIP
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/discover"
                className="px-8 py-4 rounded-md border-2 border-white text-white font-medium hover:bg-white hover:text-black transition-colors"
              >
                DISCOVER VIP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Video & Buttons */}
            <div className="space-y-6">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </button>
                <img
                  src="/api/placeholder/800/600"
                  alt="Quotum Introduction"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/register"
                  className="px-8 py-3 rounded-md bg-[#FF6B00] text-white hover:bg-[#ff8533] transition-colors inline-flex items-center"
                >
                  JOIN QUOTUM VIP
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/reviews"
                  className="px-8 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reviews
                </Link>
              </div>
            </div>

            {/* Right Column - Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#FF6B00] rounded-lg flex-shrink-0">
                    <ChartBar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      IN DEPTH ANALYSIS
                    </h3>
                    <p className="text-gray-600">
                      I am working day and night to give you the most accurate
                      and insightful market analyses. Gain deep knowledge to
                      make your next move.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#FF6B00] rounded-lg flex-shrink-0">
                    <ArrowUpDown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">FOLLOW MY TRADES</h3>
                    <p className="text-gray-600">
                      Follow all my trades in real time and stay updated with
                      every market move I make. See my own portfolio in real
                      time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#FF6B00] rounded-lg flex-shrink-0">
                    <LineChart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      STRATEGY & INSIGHTS
                    </h3>
                    <p className="text-gray-600">
                      The complete gameplan, from learning the basics to
                      advanced trades I take you deep into the Quotum philosophy
                      of playing the markets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#FF6B00] rounded-lg flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">QUOTUM COMMUNITY</h3>
                    <p className="text-gray-600">
                      Join the Quotum community, a network of ambitious
                      investors driven to grow and succeed together, with
                      exclusive live meetups.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-12 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Quotum Portfolio
          </h2>
          <div className="overflow-hidden whitespace-nowrap">
            <div className="animate-slider inline-flex space-x-16 px-8">
              <span className="text-gray-600">Bitcoin</span>
              <span className="text-gray-600">Ethereum</span>
              <span className="text-gray-600">Solana</span>
              <span className="text-gray-600">Realio Network</span>
              <span className="text-gray-600">GamerCoin</span>
              <span className="text-gray-600">Bitcoin</span>
              <span className="text-gray-600">Ethereum</span>
              <span className="text-gray-600">Solana</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1-Month Plan */}
            <SubscriptionCard
              months={1}
              price={75}
              image={OneMonth}
              features={basicFeatures}
            />
            {/* 3-Month Plan */}
            <SubscriptionCard
              months={3}
              price={180}
              isPopular={true}
              image={ThreeMonth}
              features={advancedFeatures}
            />
            {/* 6-Month Plan */}
            <SubscriptionCard
              months={6}
              price={330}
              isBestDeal={true}
              image={SixMonth}
              features={advancedFeatures}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            What members write about the VIP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Testimonial
              text="Insane value. I have been a member of the Stasher VIP since 2021. After all this time I can genuinely say that this isn't just a signal group... It goes way beyond that. You just feel it in the energy we get from Amir. He truly wants the best for his community and delivers so much value. Even outside of crypto. If you want to level up your life, keep yourself sharp and align yourself with those who have the same fire inside of them ; you would be crazy not to join. 10/10 Recommend."
              author="TJ"
              date="June 03, 2024"
            />
            <Testimonial
              text="Real review of the VIP. I have been in VIP for over a year. Stasher is not normal! So committed to the community. Knows what he is talking about. A true visionary."
              author="Pre Rich"
              date="November 11, 2024"
            />
          </div>
          <div className="flex justify-center mt-8 gap-4">
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Lock In Section */}
      <section className="py-20 bg-[#111] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Lock in.</h2>
          <p className="text-xl text-gray-300 mb-10">
            Time and time again the bull-run has come and my VIP has MAXIMIZED
            every opportunity. So ACTIVATE before it's too late.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 rounded-md bg-[#FF6B00] text-white font-medium hover:bg-[#ff8533] transition-colors text-lg"
          >
            JOIN QUOTUM VIP
            <ArrowRight className="ml-2 h-5 w-5 inline" />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
          <div className="space-y-4">
            <FAQ
              question="What exclusive benefits do I receive as a member of the QUOTUM VIP Group?"
              answer="As a VIP member, you get access to real-time trade alerts, in-depth market analysis, exclusive educational content, and direct access to our community of successful traders."
            />
            <FAQ
              question="How often do I get market updates in the QUOTUM VIP Group?"
              answer="We provide daily market updates and real-time alerts for significant market movements and trading opportunities."
            />
            <FAQ
              question="What makes the QUOTUM VIP Group different from other trading communities?"
              answer="Our focus on data-driven analysis, real-time whale tracking, and proven market cycle indicators sets us apart from traditional trading groups."
            />
            <FAQ
              question="Is the QUOTUM VIP Group suitable for beginners in crypto trading?"
              answer="Yes, we provide comprehensive educational resources and step-by-step guidance suitable for both beginners and experienced traders."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={quotumLogo} alt="Quotum Logo" className="h-12 w-auto" />
              <span className="text-white text-xl ml-3 font-semibold">
                Quotum.cloud
              </span>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} Quotum. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Add to your CSS file or Tailwind config */}
      <style jsx>{`
        @keyframes slide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-slider {
          animation: slide 20s linear infinite;
        }

        /* 3D card effect */
        .subscription-card {
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }

        .subscription-card:hover {
          transform: translateY(-10px) rotateX(5deg);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
