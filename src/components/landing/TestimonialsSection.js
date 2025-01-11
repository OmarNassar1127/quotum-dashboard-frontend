import React, { useEffect, useState } from "react";

const testimonials = [
  {
    text: "Quotum.cloud has completely transformed how I approach crypto investments. The research is top-notch, and the indicators are game-changers.",
    author: "Alice W.",
    date: "January 1, 2024",
  },
  {
    text: "I've saved countless hours thanks to Quotum's comprehensive analytics. It's like having a personal research assistant!",
    author: "John D.",
    date: "February 15, 2024",
  },
  {
    text: "The insights provided by the team are unparalleled. I trust their analysis more than any other source.",
    author: "Michael T.",
    date: "March 3, 2024",
  },
  {
    text: "I'm consistently impressed by the depth of research. Quotum makes investing smarter and easier.",
    author: "Sophia L.",
    date: "April 10, 2024",
  },
  {
    text: "The historical data and indicators have given me confidence in my decisions. Highly recommend!",
    author: "Chris P.",
    date: "May 8, 2024",
  },
  {
    text: "This platform is a must-have for serious investors. The VIP access is worth every penny.",
    author: "Emma R.",
    date: "June 6, 2024",
  },
  {
    text: "Quotum has become my go-to for crypto research. The level of detail is astounding.",
    author: "Liam K.",
    date: "July 4, 2024",
  },
  {
    text: "I've tried other platforms, but Quotum stands out for its quality and reliability.",
    author: "Olivia M.",
    date: "August 14, 2024",
  },
  {
    text: "The indicators are incredibly accurate. I've seen real improvements in my portfolio.",
    author: "Noah B.",
    date: "September 20, 2024",
  },
  {
    text: "The community and insights from the founders are invaluable. I wouldn't invest without it.",
    author: "Mia C.",
    date: "October 30, 2024",
  },
  {
    text: "Quotum's combination of data and analysis is unmatched. It's a key part of my strategy now.",
    author: "Ethan H.",
    date: "November 18, 2024",
  },
  {
    text: "I can't imagine investing without the insights from Quotum.cloud. Game-changing!",
    author: "Ava G.",
    date: "December 5, 2024",
  },
  {
    text: "The team behind Quotum is incredible. Their expertise and dedication show in every report.",
    author: "William F.",
    date: "January 20, 2024",
  },
  {
    text: "Quotum's VIP access is the best investment I've made this year. Don't hesitate!",
    author: "Isabella N.",
    date: "February 10, 2024",
  },
  {
    text: "From research to indicators, everything Quotum offers is top-notch. Highly recommended!",
    author: "James L.",
    date: "March 25, 2024",
  },
  {
    text: "Omar's one-on-one sessions gave me clarity on my investment strategy. Truly invaluable!",
    author: "David R.",
    date: "April 5, 2024",
  },
  {
    text: "Robin's insights during our 1-on-1 session were spot on. It's rare to find such expertise.",
    author: "Emily K.",
    date: "May 15, 2024",
  },
  {
    text: "Thanks to Omar's guidance, I've significantly improved my portfolio. Highly recommend!",
    author: "Henry T.",
    date: "June 22, 2024",
  },
  {
    text: "Robin's analysis helped me avoid a major loss. His attention to detail is incredible.",
    author: "Sophia V.",
    date: "July 10, 2024",
  },
  {
    text: "The support from Omar and Robin has been phenomenal. They genuinely care about their members.",
    author: "Daniel F.",
    date: "August 8, 2024",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % Math.ceil(testimonials.length / 4)
      );
      setIsAnimating(false);
    }, 500);
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + Math.ceil(testimonials.length / 4)) %
          Math.ceil(testimonials.length / 4)
      );
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <h2 className="text-4xl font-bold text-center mb-12">
        What members write about Quotum
      </h2>
      <div className="relative overflow-hidden">
        <div
          className="relative flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(testimonials.length / 4) }).map(
            (_, i) => (
              <div key={i} className="min-w-full grid grid-cols-2 gap-6">
                {testimonials.slice(i * 2, i * 2 + 2).map((item, index) => (
                  <div
                    key={index}
                    className="p-6 border rounded-lg shadow-lg flex flex-col justify-between bg-white h-full"
                  >
                    <p className="text-lg italic mb-4">{item.text}</p>
                    <div className="mt-4">
                      <p className="text-right font-semibold">
                        - {item.author}, {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex justify-center mt-8 gap-4">
        <button
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
          onClick={handlePrevious}
          disabled={isAnimating}
        >
          <svg
            className="w-6 h-6 rotate-180"
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
        <button
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
          onClick={handleNext}
          disabled={isAnimating}
        >
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
  );
};

export default TestimonialsSection;
