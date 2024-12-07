import React, { useState, useEffect } from 'react';
import { Play, Loader, Calendar, Eye } from 'lucide-react';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder video data (in a real app, this would come from YouTube API)
  const demoVideos = [
    {
      id: '1',
      title: 'Introduction to Cryptocurrency Trading',
      thumbnail: 'https://picsum.photos/seed/crypto1/320/180',
      views: '15K views',
      date: '2 days ago',
      duration: '12:45'
    },
    {
      id: '2',
      title: 'Bitcoin Market Analysis 2024',
      thumbnail: 'https://picsum.photos/seed/crypto2/320/180',
      views: '8K views',
      date: '1 week ago',
      duration: '15:20'
    },
    {
      id: '3',
      title: 'Understanding Blockchain Technology',
      thumbnail: 'https://picsum.photos/seed/crypto3/320/180',
      views: '25K views',
      date: '3 days ago',
      duration: '18:30'
    },
    {
      id: '4',
      title: 'Crypto Investment Strategies',
      thumbnail: 'https://picsum.photos/seed/crypto4/320/180',
      views: '12K views',
      date: '5 days ago',
      duration: '10:15'
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const loadVideos = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVideos(demoVideos);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos');
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const handleVideoClick = (videoId) => {
    // In a real app, this would open the video or navigate to a video page
    console.log(`Playing video ${videoId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Featured Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video.id)}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group"
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Play className="h-12 w-12 text-white" fill="white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{video.views}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{video.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
