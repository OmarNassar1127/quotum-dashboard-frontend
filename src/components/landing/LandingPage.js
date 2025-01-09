import React, { useState, useEffect } from "react";
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
import test from "../../assets/test.svg";
import test2 from "../../assets/test2.svg";
import quotumVideo from "../../assets/quotum-recording.mp4";
import QuotumPortfolio from "./QuotumPortfolio";

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
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in and tries to access "/", redirect them to /dashboard
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]); // to be removed imo

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

      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <div className="absolute inset-0 bg-black/70 z-10" />{" "}
          {/* Dark overlay */}
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={quotumVideo} type="video/mp4" />
          </video>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/50 to-transparent z-20"></div>

        {/* Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col justify-center items-center h-full text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 animate-fade-in">
              Ready to change your life?
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl animate-fade-in-delay">
              Take control of your crypto investments with advanced analytics,
              whale tracking, and precise market indicators.
            </p>
            <div className="mt-10 flex justify-center gap-6 animate-fade-in-delay-2">
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-1 h-3 bg-black rounded-full animate-scroll" />
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

      {/* Market Analysis Sections */}
      {/* First Analysis Section - Light */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <ChartBar className="h-8 w-8 text-[#FF6B00]" />
                  <h2 className="text-3xl font-bold">
                    Deeper analysis, clearer market perspectives
                  </h2>
                </div>
                <p className="text-gray-600 text-lg">
                  Quotum's expertise in on-chain data gives you a multi-layered
                  view of core digital assets.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="p-1 mt-1 bg-[#FF6B00]/10 rounded">
                      <ChartBar className="h-4 w-4 text-[#FF6B00]" />
                    </div>
                    <span className="text-gray-600">
                      Understand novel asset fundamentals
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 mt-1 bg-[#FF6B00]/10 rounded">
                      <LineChart className="h-4 w-4 text-[#FF6B00]" />
                    </div>
                    <span className="text-gray-600">
                      Follow capital flows with precision
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 mt-1 bg-[#FF6B00]/10 rounded">
                      <ArrowUpDown className="h-4 w-4 text-[#FF6B00]" />
                    </div>
                    <span className="text-gray-600">
                      Gauge true market sentiment
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Image */}
            <div className="lg:pl-12">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src={test2}
                  alt="Market Analysis Dashboard"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Analysis Section - Dark */}
      <section className="py-20 bg-[#111] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image First on Desktop */}
            <div className="lg:pr-12 order-2 lg:order-1">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src={test}
                  alt="Market Movement Analysis"
                  className="w-full"
                />
              </div>
            </div>
            {/* Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <LineChart className="h-8 w-8 text-[#FF6B00]" />
                  <h2 className="text-3xl font-bold text-white">
                    Expert guidance, tailored to your needs
                  </h2>
                </div>
                <p className="text-gray-400 text-lg">
                  Quotum's team of experts delivers bespoke insights for your
                  research or trading purposes.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="p-1 mt-1 bg-[#FF6B00]/10 rounded">
                      <ChartBar className="h-4 w-4 text-[#FF6B00]" />
                    </div>
                    <span className="text-gray-400">
                      Curated analytics for streamlined market analysis
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 mt-1 bg-[#FF6B00]/10 rounded">
                      <LineChart className="h-4 w-4 text-[#FF6B00]" />
                    </div>
                    <span className="text-gray-400">
                      Regular research diving deep into key market dynamics
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="p-1 mt-1 bg-[#FF6B00]/10 rounded">
                      <ArrowUpDown className="h-4 w-4 text-[#FF6B00]" />
                    </div>
                    <span className="text-gray-400">
                      Strategic, on-demand advice and solutions
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <QuotumPortfolio />

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
                <h3 className="text-white font-semibold mb-2">Products</h3>
                <Link
                  to="/vip"
                  className="text-sm hover:text-white transition-colors"
                >
                  VIP Access
                </Link>
                <Link
                  to="/features"
                  className="text-sm hover:text-white transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="text-sm hover:text-white transition-colors"
                >
                  Pricing
                </Link>
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
                  to="/contact"
                  className="text-sm hover:text-white transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  Terms
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
                  href="https://twitter.com/quotum"
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
                  href="https://telegram.com/quotum"
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
                  href="https://discord.gg/quotum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.118.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
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

export default LandingPage;
