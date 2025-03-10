import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, ArrowLeft, Play, Lock, X } from "lucide-react";
import ReactPlayer from "react-player"; // <-- Added ReactPlayer
import axios from "../../lib/axios";

/**
 * Suppose you want to rely on `lesson.video_url`.
 * We'll embed that in an iframe or via ReactPlayer (for YouTube).
 */

function generateConnections(numLessons, rowSize = 4) {
  if (numLessons < 2) return [];
  const connections = [];
  for (let i = 0; i < numLessons - 1; i++) {
    connections.push([i, i + 1]);
  }
  return connections;
}

function getLessonPosition(index, rowSize = 4) {
  const row = Math.floor(index / rowSize);
  let col = index % rowSize;
  if (row % 2 === 1) {
    col = rowSize - 1 - col;
  }
  const horizontalGap = 20;
  const xPos = `${(col + 1) * horizontalGap}%`;
  const rowHeight = 25;
  const baseY = 15;
  const yPos = `${baseY + row * rowHeight}%`;
  return { xPos, yPos };
}

const Videos = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [lessons, setLessons] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [finalLessons, setFinalLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For the video modal
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If you still want to keep a reference, though not strictly required with ReactPlayer
  const videoRef = useRef(null);

  const [progressPercentage, setProgressPercentage] = useState(0);
  const [hasReportedCompletion, setHasReportedCompletion] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedLesson) {
      setProgressPercentage(0);
      setHasReportedCompletion(false);
    }
  }, [selectedLesson]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lessonsRes, progressRes] = await Promise.all([
        axios.get("/roadmap"),
        axios.get("/lessons/progress"),
      ]);

      const sortedLessons = lessonsRes.data.sort((a, b) => a.order - b.order);
      setLessons(sortedLessons);
      setProgressData(progressRes.data);

      const merged = computeLessonsStatus(sortedLessons, progressRes.data);
      setFinalLessons(merged);

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load lessons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const computeLessonsStatus = (sortedLessons, progressList) => {
    let allPreviousCompleted = true;
    const result = [];

    for (let i = 0; i < sortedLessons.length; i++) {
      const lesson = sortedLessons[i];
      const record = progressList.find((p) => p.lesson_id === lesson.id);

      let isCompleted = false;
      if (record && (record.is_completed || record.progress_percentage >= 80)) {
        isCompleted = true;
      }

      let status;
      if (!lesson.is_published) {
        status = "locked";
      } else if (isCompleted) {
        status = "completed";
      } else if (allPreviousCompleted) {
        status = "available";
      } else {
        status = "locked";
      }

      result.push({
        ...lesson,
        status,
      });

      if (!isCompleted) {
        allPreviousCompleted = false;
      }
    }

    return result;
  };

  const handleUpdateProgress = async (lessonId, newPercentage) => {
    try {
      await axios.post(`/lessons/${lessonId}/progress`, {
        progress_percentage: newPercentage,
      });

      // Create a copy of your current progressData outside the setState callback
      const updatedProgressData = [...progressData];
      const idx = updatedProgressData.findIndex(
        (p) => p.lesson_id === lessonId
      );

      if (idx !== -1) {
        updatedProgressData[idx] = {
          ...updatedProgressData[idx],
          progress_percentage: newPercentage,
          is_completed: newPercentage >= 80,
        };
      } else {
        updatedProgressData.push({
          lesson_id: lessonId,
          progress_percentage: newPercentage,
          is_completed: newPercentage >= 80,
          lesson: {},
        });
      }

      // Update the progressData state
      setProgressData(updatedProgressData);

      // Now recompute finalLessons using the updatedProgressData
      setFinalLessons((prevLessons) =>
        computeLessonsStatus(prevLessons, updatedProgressData)
      );
    } catch (err) {
      console.error("Error updating progress:", err);
      setError(err.response?.data?.message || "Failed to update progress");
    }
  };

  const handleLessonClick = (lesson) => {
    if (lesson.status === "locked") return;
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
    setIsModalOpen(false);
  };

  const fetchAndUpdateProgress = async () => {
    try {
      const progressRes = await axios.get("/lessons/progress");
      setProgressData(progressRes.data);
      setFinalLessons(computeLessonsStatus(lessons, progressRes.data));
    } catch (err) {
      console.error("Error fetching updated progress:", err);
      setError(
        err.response?.data?.message || "Failed to fetch updated progress"
      );
    }
  };

  /**
   * Handler to track progress from ReactPlayer
   * 'state' param includes { played, playedSeconds, loaded, loadedSeconds }
   * We focus on 'played' which is a fraction from 0 to 1
   */
  const handleVideoProgress = (state) => {
    if (!selectedLesson) return;

    const percent = state.played * 100;
    setProgressPercentage(percent);

    // If the user hasn’t triggered “completion” yet and we have reached 80%
    if (!hasReportedCompletion && percent >= 80) {
      setHasReportedCompletion(true);
      // Mark user’s progress as 100 in the backend
      handleUpdateProgress(selectedLesson.id, 100)
        .then(() => fetchAndUpdateProgress())
        .catch((err) => {
          console.error("Error updating or refreshing progress:", err);
        });
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

  const generateConnectorLines = () => {
    const lines = [];
    const pairs = generateConnections(finalLessons.length, 4);
    pairs.forEach(([startIndex, endIndex]) => {
      const startPos = getLessonPosition(startIndex, 4);
      const endPos = getLessonPosition(endIndex, 4);
      const x1 = parseFloat(startPos.xPos);
      const y1 = parseFloat(startPos.yPos);
      const x2 = parseFloat(endPos.xPos);
      const y2 = parseFloat(endPos.yPos);

      lines.push(
        <line
          key={`${startIndex}-${endIndex}`}
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
    <div className="bg-[#111] min-h-screen text-white border border-[#222] relative">
      {/* Header */}
      <div className="p-6 border-b border-[#222]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-100">Videos Roadmap</h1>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-[#222] border border-[#333] rounded-lg hover:bg-[#333] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 text-red-400 border border-red-600 bg-red-900/20">
          {error}
        </div>
      )}

      {/* Roadmap - Desktop */}
      <div className="hidden md:block relative w-full p-6">
        <div
          ref={containerRef}
          className="mx-auto max-w-7xl relative aspect-[2/1]"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {generateConnectorLines()}
          </svg>
          <div className="relative w-full h-full">
            {finalLessons.map((lesson, index) => {
              const { xPos, yPos } = getLessonPosition(index, 4);
              return (
                <div
                  key={lesson.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
                  style={{ left: xPos, top: yPos }}
                >
                  <div
                    onClick={() => handleLessonClick(lesson)}
                    className={`
                      w-[150px] h-[150px] /* Slightly larger than 32 */
                      rounded-full
                      flex flex-col items-center justify-center
                      ${lesson.status === "locked" ? "bg-[#1a1a1a]" : "bg-[#222]"}
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
                    <div className="absolute top-full mt-2 w-48 bg-[#222] border border-[#333] rounded-lg p-3 hidden group-hover:block shadow-xl z-10">
                      {lesson.status === "locked" ? (
                        <p className="text-xs text-gray-400">
                          Complete previous lessons to unlock
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">
                          Click to view this lesson
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Roadmap - Mobile */}
      <div className="md:hidden p-6 space-y-4">
        {finalLessons.map((lesson) => (
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
              <div>{getStatusIcon(lesson.status)}</div>
            </div>
            <p className="text-xs text-gray-400">{lesson.description}</p>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#222] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#333] relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {selectedLesson.title}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                {selectedLesson.description}
              </p>
              <div className="aspect-video bg-black mb-4">
                {/* 
                  Use ReactPlayer to embed YouTube (or any other supported URL).
                  We use the 'onProgress' callback to track how much has been played.
                */}
                <ReactPlayer
                  ref={videoRef}
                  url={selectedLesson.video_url}
                  controls
                  width="100%"
                  height="100%"
                  onProgress={handleVideoProgress}
                />
              </div>
              <div className="w-full bg-[#333] rounded h-3">
                <div
                  className="bg-blue-500 h-3 rounded-l"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="mt-2 text-gray-300 text-sm">
                Watched: {progressPercentage.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
