import React, { useState, useEffect } from "react";
import { Loader, Plus, Pencil, Trash2, X } from "lucide-react";
import axios from "../../lib/axios";

const AdminLessonPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    order: 0,
    is_published: false,
  });

  const [submitting, setSubmitting] = useState(false);

  // ----------------------------------
  // Fetch lessons on mount
  // ----------------------------------
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/lessons");
      setLessons(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load lessons. Please try again.");
      console.error("Error fetching lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // Open modal for CREATE or EDIT
  // ----------------------------------
  const handleOpenModal = (lesson = null) => {
    if (lesson) {
      // We are editing an existing lesson
      setSelectedLesson(lesson);
      setFormData({
        title: lesson.title || "",
        description: lesson.description || "",
        video_url: lesson.video_url || "",
        order: lesson.order || 0,
        is_published: lesson.is_published || false,
      });
    } else {
      // We are creating a new lesson
      setSelectedLesson(null);
      setFormData({
        title: "",
        description: "",
        video_url: "",
        order: lessons.length, // default to next order
        is_published: false,
      });
    }
    setIsModalOpen(true);
  };

  // ----------------------------------
  // Close modal
  // ----------------------------------
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
    setFormData({
      title: "",
      description: "",
      video_url: "",
      order: 0,
      is_published: false,
    });
  };

  // ----------------------------------
  // CREATE lesson (POST /lessons)
  // ----------------------------------
  const createLesson = async () => {
    await axios.post("/lessons", formData, {
      headers: { "Content-Type": "application/json" },
    });
  };

  // ----------------------------------
  // UPDATE lesson (PUT /lessons/:id)
  // ----------------------------------
  const updateLesson = async () => {
    if (!selectedLesson) return;

    await axios.put(`/lessons/${selectedLesson.id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
  };

  // ----------------------------------
  // Handle submit (decide create vs. update)
  // ----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedLesson) {
        await updateLesson();
      } else {
        await createLesson();
      }
      await fetchLessons(); // refresh the table
      handleCloseModal(); // close the modal
    } catch (err) {
      console.error("Error saving lesson:", err);
      setError(err.response?.data?.message || "Failed to save lesson");
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------
  // Handle delete
  // ----------------------------------
  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await axios.delete(`/lessons/${lessonId}`);
      await fetchLessons();
    } catch (err) {
      console.error("Error deleting lesson:", err);
      setError(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  // ----------------------------------
  // Render loading state
  // ----------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#111] text-white">
        <Loader className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  // ----------------------------------
  // Render component
  // ----------------------------------
  return (
    <div className="p-6 space-y-6 bg-[#111] min-h-screen text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">
          Video Lessons Management
        </h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-[#222] border border-[#333] rounded-lg hover:bg-[#333] hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Lesson
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lessons Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#222] border border-[#333] rounded-lg">
          <thead className="bg-[#333]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Video URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            {lessons.map((lesson) => (
              <tr
                key={lesson.id}
                className="bg-[#222] hover:bg-[#333] transition-colors"
              >
                <td className="px-6 py-4 text-gray-300">{lesson.order}</td>
                <td className="px-6 py-4 text-gray-300">{lesson.title}</td>
                <td className="px-6 py-4 text-gray-300">{lesson.video_url}</td>
                <td className="px-6 py-4">
                  {lesson.is_published ? (
                    <span className="bg-green-900/20 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded border border-green-500/50">
                      Published
                    </span>
                  ) : (
                    <span className="bg-gray-900/20 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-500/50">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(lesson)}
                      className="p-1 hover:bg-[#444] rounded transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-1 hover:bg-[#444] rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#222] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#333]">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-100">
                  {selectedLesson ? "Edit Lesson" : "Create New Lesson"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        video_url: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value, 10),
                      }))
                    }
                    required
                    className="w-full px-3 py-2 bg-[#333] border border-[#444] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
                  />
                </div>

                {/* Publish Checkbox */}
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_published: e.target.checked,
                        }))
                      }
                      className="form-checkbox h-4 w-4 text-blue-500 bg-[#333] border-[#444] rounded"
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      Publish immediately
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="px-4 py-2 bg-[#333] text-gray-300 rounded-lg hover:bg-[#444] transition-colors border border-[#444]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : selectedLesson ? (
                      "Update Lesson"
                    ) : (
                      "Create Lesson"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLessonPage;
