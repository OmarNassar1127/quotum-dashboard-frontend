import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, ArrowLeft, Play, Lock } from "lucide-react";

const Videos = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const containerRef = useRef(null);

  // Dummy data for lessons
  const dummyLessons = [
    {
      id: 1,
      title: "Lesson 1",
      description: "Intro & Welcome (1 min)",
      status: "completed",
    },
    {
      id: 2,
      title: "Lesson 2",
      description: "Basics of Trading (3 mins)",
      status: "completed",
    },
    {
      id: 3,
      title: "Lesson 3",
      description: "Technical Analysis 101 (2 mins)",
      status: "available",
    },
    {
      id: 4,
      title: "Lesson 4",
      description: "Fundamental Analysis (2 mins)",
      status: "locked",
    },
    {
      id: 5,
      title: "Lesson 5",
      description: "Risk Management (3 mins)",
      status: "locked",
    },
    {
      id: 6,
      title: "Lesson 6",
      description: "CEX vs DEX (2 mins)",
      status: "locked",
    },
    {
      id: 7,
      title: "Lesson 7",
      description: "Reading On-chain Data (2 mins)",
      status: "locked",
    },
    {
      id: 8,
      title: "Lesson 8",
      description: "Market Cycles (2 mins)",
      status: "locked",
    },
    {
      id: 9,
      title: "Lesson 9",
      description: "Altcoins vs Bitcoin (3 mins)",
      status: "locked",
    },
    {
      id: 10,
      title: "Lesson 10",
      description: "Common Trading Mistakes (3 mins)",
      status: "locked",
    },
    {
      id: 11,
      title: "Lesson 11",
      description: "Advanced TA Patterns (2 mins)",
      status: "locked",
    },
    {
      id: 12,
      title: "Lesson 12",
      description: "Final Thoughts & Next Steps (2 mins)",
      status: "locked",
    },
  ];

  // Define connections in snake pattern:
  // Row 1: 1->2->3->4 (left to right)
  // Row 2: 4->5->6->7->8 (right to left)
  // Row 3: 8->9->10->11->12 (left to right)
  const connections = [
    // First row (left to right)
    [1, 2],
    [2, 3],
    [3, 4],
    // Connect to second row
    [4, 5],
    // Second row (right to left)
    [5, 6],
    [6, 7],
    [7, 8],
    // Connect to third row
    [8, 9],
    // Third row (left to right)
    [9, 10],
    [10, 11],
    [11, 12],
  ];

  // Utility to compute (x%, y%) for each lesson index in the snake pattern
  const getLessonPosition = (index) => {
    const row = Math.floor(index / 4); // 0-based row
    let col = index % 4;

    // For odd-numbered rows, reverse the column order
    if (row % 2 === 1) {
      col = 3 - col;
    }

    // Calculate horizontal position (20% gaps)
    const horizontalGap = 100 / 5; // 20% segments
    const xPos = `${horizontalGap * (col + 1)}%`;

    // Calculate vertical position
    const basePercent = 16.66;
    const rowHeight = 25; // distance between rows
    const yPos = `${row * rowHeight + basePercent}%`;

    return { xPos, yPos };
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      // Simulate API fetch with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLessons(dummyLessons);
      setLoading(false);
    } catch (err) {
      setError("Failed to load lessons. Please try again.");
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson) => {
    if (lesson.status !== "locked") {
      setSelectedLesson(lesson);
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <div className="w-3 h-3 bg-green-400 rounded-full" />;
      case "available":
        return <Play className="w-4 h-4 text-blue-400" />;
      default:
        return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Build the SVG <line> elements dynamically based on the connections array
  const generateConnectorLines = () => {
    const lines = [];

    connections.forEach(([startId, endId]) => {
      // Convert lesson ID to zero-based index
      const startIndex = startId - 1;
      const endIndex = endId - 1;

      // Get positions and remove the '%' from the strings
      const startPos = getLessonPosition(startIndex);
      const endPos = getLessonPosition(endIndex);

      // Convert percentage strings to numbers
      const x1 = parseFloat(startPos.xPos);
      const y1 = parseFloat(startPos.yPos);
      const x2 = parseFloat(endPos.xPos);
      const y2 = parseFloat(endPos.yPos);

      lines.push(
        <line
          key={`${startId}-${endId}`}
          x1={`${x1}`}
          y1={`${y1}`}
          x2={`${x2}`}
          y2={`${y2}`}
          stroke="#333"
          strokeWidth={2}
          strokeDasharray="4,4"
          vectorEffect="non-scaling-stroke"
        />
      );
    });

    return lines;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111] text-white">
        <Loader className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <div className="bg-[#111] min-h-screen text-white border border-[#222]">
      {/* Header */}
      <div className="p-6 border-b border-[#222]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">Videos Roadmap</h1>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-[#222] border border-[#333] rounded-lg hover:bg-[#333] hover:text-white focus:outline-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative w-full p-6">
        <div
          ref={containerRef}
          className="mx-auto max-w-7xl relative aspect-[2/1]"
        >
          {/* SVG Connectors */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {generateConnectorLines()}
          </svg>

          {/* Lesson Nodes */}
          <div className="relative w-full h-full">
            {dummyLessons.map((lesson, index) => {
              const { xPos, yPos } = getLessonPosition(index);

              return (
                <div
                  key={lesson.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
                  style={{
                    left: xPos,
                    top: yPos,
                  }}
                >
                  <div
                    onClick={() => handleLessonClick(lesson)}
                    className={`
                      w-32 h-32
                      rounded-full
                      flex flex-col items-center justify-center
                      ${
                        lesson.status === "locked"
                          ? "bg-[#1a1a1a]"
                          : "bg-[#222]"
                      }
                      border border-[#333]
                      text-center
                      p-4
                      cursor-pointer
                      hover:bg-[#333]
                      transition-colors
                      group
                      relative
                    `}
                  >
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center">
                      {getStatusIcon(lesson.status)}
                    </div>

                    <h3 className="text-sm font-medium text-gray-200 mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {lesson.description}
                    </p>

                    <div className="absolute top-full mt-2 w-48 bg-[#222] border border-[#333] rounded-lg p-3 hidden group-hover:block shadow-xl z-10">
                      <p className="text-xs text-gray-400">
                        {lesson.status === "locked"
                          ? "Complete previous lessons to unlock"
                          : "Click to start the lesson"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden p-6 space-y-4">
        {dummyLessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => handleLessonClick(lesson)}
            className={`
              p-4 rounded-lg
              ${lesson.status === "locked" ? "bg-[#1a1a1a]" : "bg-[#222]"}
              border border-[#333]
              cursor-pointer
              hover:bg-[#333]
              transition-colors
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-200">
                {lesson.title}
              </h3>
              {getStatusIcon(lesson.status)}
            </div>
            <p className="text-xs text-gray-400">{lesson.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
