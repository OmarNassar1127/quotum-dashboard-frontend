import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChartBar,
  ArrowUpDown,
  LineChart,
  Users,
  Play,
  ChevronDown,
  RefreshCcw,
  Target,
  Building2,
  Shield,
  PieChart,
  Menu,
  X,
} from "lucide-react";
import quotumLogo from "../../assets/quotum-no-bg.png";
import OneMonth from "../../assets/OneMonth.webp";
import ThreeMonth from "../../assets/ThreeMonth.webp";
import SixMonth from "../../assets/SixMonth.webp";
import test from "../../assets/test.svg";
import test2 from "../../assets/test2.svg";
import quotumVideo from "../../assets/quotum-recording.mp4";
import QuotumPortfolio from "./QuotumPortfolio";
import TestimonialsSection from "./TestimonialsSection";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
};

const staggerChildrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideInLeftVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideInRightVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[#111] z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={quotumLogo}
              alt="Quotum Logo"
              className="h-8 w-auto md:h-12"
            />
            <span className="text-white text-lg md:text-xl ml-2 md:ml-3 font-semibold">
              Quotum.cloud
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors border-2 border-white rounded-md"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-500 transition-colors"
            >
              JOIN VIP
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-4">
              <Link
                to="/login"
                className="w-full max-w-[200px] px-3 py-2 text-base font-medium text-center text-gray-300 hover:text-white transition-colors border-2 border-white rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full max-w-[200px] px-3 py-2 text-base font-medium text-center text-white bg-orange-600 hover:bg-orange-500 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                JOIN VIP
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Enhanced FAQ Component with animations
const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-gray-200"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUpVariants}
    >
      <button
        className="w-full py-6 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </motion.div>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-gray-600">{answer}</p>
      </motion.div>
    </motion.div>
  );
};

// Enhanced SubscriptionCard Component with animations
const SubscriptionCard = ({
  months,
  price,
  isPopular = false,
  isBestDeal = false,
  features = [],
  image,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      className="bg-black rounded-2xl p-6 flex flex-col relative cursor-pointer"
      onClick={() =>
        navigate(`/payment/${months}month${months > 1 ? "s" : ""}`)
      }
    >
      {isPopular && (
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-3 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium"
        >
          Most Popular
        </motion.span>
      )}
      {isBestDeal && (
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-3 left-4 bg-[#FF6B00] px-3 py-1 rounded-full text-white text-sm font-medium"
        >
          Best Deal
        </motion.span>
      )}
      <div className="flex flex-col h-full">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src={image}
          alt={`${months}-month subscription`}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
        <motion.div variants={fadeInUpVariants}>
          <h3 className="text-2xl font-bold text-white mb-4">
            {months} MONTHS
          </h3>
          <p className="text-gray-400 mb-6">
            {months === 1
              ? "Get access to the basic features and see if QUOTUM VIP is the right fit for you!"
              : `Go beyond the basics with advanced features, deeper insights, and extended support for your ${months}-month journey!`}
          </p>
          <ul className="text-gray-400 space-y-2 list-disc list-inside">
            {features.map((feature, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div className="mt-auto" variants={fadeInUpVariants}>
          <p className="text-3xl font-bold text-white mb-4 mt-4">€{price}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#ff8533] transition-colors"
          >
            JOIN NOW
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="relative h-screen overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full bg-black">
          <div className="absolute inset-0 bg-black/70 z-10" />
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

        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/50 to-transparent z-20"></div>

        <motion.div
          variants={staggerChildrenVariants}
          className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full"
        >
          <div className="flex flex-col justify-center items-center h-full text-center px-4">
            <motion.h1
              variants={fadeInUpVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            >
              Ready to change your life?
            </motion.h1>
            <motion.p
              variants={fadeInUpVariants}
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mb-8 md:mb-12"
            >
              Take control of your crypto investments with advanced analytics,
              whale tracking, and precise market indicators.
            </motion.p>
            <motion.div
              variants={fadeInUpVariants}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full max-w-xl"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-md bg-[#FF6B00] text-white font-medium hover:bg-[#ff8533] transition-colors inline-flex items-center justify-center text-base sm:text-lg"
                >
                  JOIN QUOTUM VIP
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("pricing");
                    if (element) {
                      const offset = 80; // Adjust this value based on your header height
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
                  className="w-full sm:w-auto px-8 py-4 rounded-md border-2 border-white text-white font-medium hover:bg-white hover:text-black transition-colors inline-flex items-center justify-center text-base sm:text-lg"
                >
                  DISCOVER VIP
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-1 h-3 bg-black rounded-full animate-scroll" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerChildrenVariants}
        className="py-20 bg-white"
        id="introduction"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div variants={slideInLeftVariants} className="space-y-6">
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
              </div>
            </motion.div>

            <motion.div
              variants={staggerChildrenVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                {
                  icon: <ChartBar className="h-6 w-6 text-white" />,
                  title: "IN DEPTH ANALYSIS",
                  description:
                    "I am working day and night to give you the most accurate and insightful market analyses.",
                },
                {
                  icon: <ArrowUpDown className="h-6 w-6 text-white" />,
                  title: "FOLLOW MY TRADES",
                  description:
                    "Follow all my trades in real time and stay updated with every market move I make.",
                },
                {
                  icon: <LineChart className="h-6 w-6 text-white" />,
                  title: "STRATEGY & INSIGHTS",
                  description:
                    "The complete gameplan, from learning the basics to advanced trades.",
                },
                {
                  icon: <Users className="h-6 w-6 text-white" />,
                  title: "QUOTUM COMMUNITY",
                  description:
                    "Join the Quotum community, a network of ambitious investors driven to grow and succeed together.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#FF6B00] rounded-lg flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Market Analysis Sections */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerChildrenVariants}
        className="py-20 bg-white overflow-hidden"
        id="features"
      >
        <motion.div variants={fadeInUpVariants} className="text-center mb-16">
          <h1 className="font-bold text-gray-900 mb-4">
            <span className="text-4xl md:text-5xl lg:inline-block lg:text-6xl">
              Clear insights,{" "}
            </span>
            <span className="block lg:inline text-4xl md:text-5xl lg:text-6xl ml-2">
              Big results
            </span>
          </h1>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={slideInLeftVariants} className="space-y-8">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <ChartBar className="h-8 w-8 text-[#FF6B00]" />
                    <h2 className="text-3xl font-bold">
                      Deeper analysis, clearer market perspectives
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg">
                    Quotum's expertise in on-chain data gives you a
                    multi-layered view of core digital assets.
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
            </motion.div>
            <motion.div variants={slideInRightVariants} className="lg:pl-12">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src={test2}
                  alt="Market Analysis Dashboard"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Dark Analysis Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerChildrenVariants}
        className="py-20 bg-[#111] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={slideInLeftVariants}
              className="lg:pr-12 order-2 lg:order-1"
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src={test}
                  alt="Market Movement Analysis"
                  className="w-full"
                />
              </div>
            </motion.div>
            <motion.div
              variants={slideInRightVariants}
              className="space-y-8 order-1 lg:order-2"
            >
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
                <motion.ul
                  variants={staggerChildrenVariants}
                  className="space-y-4"
                >
                  {[
                    {
                      icon: <ChartBar />,
                      text: "Curated analytics for streamlined market analysis",
                    },
                    {
                      icon: <LineChart />,
                      text: "Regular research diving deep into key market dynamics",
                    },
                    {
                      icon: <ArrowUpDown />,
                      text: "Strategic, on-demand advice and solutions",
                    },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      variants={fadeInUpVariants}
                      className="flex items-start gap-3"
                    >
                      <div className="p-1 mt-1 bg-[#FF6B00]/10 rounded">
                        {React.cloneElement(item.icon, {
                          className: "h-4 w-4 text-[#FF6B00]",
                        })}
                      </div>
                      <span className="text-gray-400">{item.text}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Portfolio Section */}
      <QuotumPortfolio />

      {/* Subscription Cards Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerChildrenVariants}
        className="py-20 bg-white"
        id="pricing"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeInUpVariants}
            className="text-4xl font-bold text-center mb-12"
          >
            Our Products
          </motion.h2>
          <motion.div
            variants={staggerChildrenVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <SubscriptionCard
              months={1}
              price={75}
              image={OneMonth}
              features={basicFeatures}
            />
            <SubscriptionCard
              months={3}
              price={180}
              isPopular={true}
              image={ThreeMonth}
              features={advancedFeatures}
            />
            <SubscriptionCard
              months={6}
              price={330}
              isBestDeal={true}
              image={SixMonth}
              features={advancedFeatures}
            />
          </motion.div>
        </div>
        <TestimonialsSection />
      </motion.section>

      {/* Lock In Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUpVariants}
        className="py-20 bg-[#111] text-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={fadeInUpVariants}
            className="text-4xl font-bold mb-6"
          >
            Lock in.
          </motion.h2>
          <motion.p
            variants={fadeInUpVariants}
            className="text-xl text-gray-300 mb-10"
          >
            Time and time again the bull-run has come and my VIP has MAXIMIZED
            every opportunity. So ACTIVATE before it's too late.
          </motion.p>
          <motion.div
            variants={fadeInUpVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/register"
              className="inline-block px-8 py-4 rounded-md bg-[#FF6B00] text-white font-medium hover:bg-[#ff8533] transition-colors text-lg"
            >
              JOIN QUOTUM VIP
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerChildrenVariants}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUpVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Quotum leads the way in market analytics
            </h2>
            <p className="text-xl text-gray-600">
              Here's how we help you stay ahead of the market
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildrenVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
          >
            {[
              {
                icon: <RefreshCcw />,
                title: "Innovation",
                description:
                  "Advanced algorithms and metrics reveal unique market patterns.",
              },
              {
                icon: <Target />,
                title: "Specialist Focus",
                description:
                  "Laser-focused on key crypto assets and market trends.",
              },
              {
                icon: <Building2 />,
                title: "Professional Standards",
                description:
                  "Built on expertise from traditional finance and crypto markets.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6B00]/10 mb-6">
                  {React.cloneElement(feature.icon, {
                    className: "h-8 w-8 text-[#FF6B00]",
                  })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={staggerChildrenVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                icon: <Shield />,
                title: "Trusted Expertise",
                description: "Relied upon by professional traders worldwide.",
              },
              {
                icon: <LineChart />,
                title: "Market Leadership",
                description:
                  "Leading-edge research developed with top analysts.",
              },
              {
                icon: <PieChart />,
                title: "Data Transparency",
                description: "Clear, reliable, and verifiable data insights.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6B00]/10 mb-6">
                  {React.cloneElement(feature.icon, {
                    className: "h-8 w-8 text-[#FF6B00]",
                  })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <div className="w-80 h-0.5 bg-black mx-auto my-2"></div>

      {/* FAQ Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerChildrenVariants}
        className="py-20 bg-white"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeInUpVariants}
            className="text-3xl font-bold text-center mb-12"
          >
            FAQs
          </motion.h2>
          <motion.div variants={staggerChildrenVariants} className="space-y-4">
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
          </motion.div>
        </div>
      </motion.section>

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

export default LandingPage;
