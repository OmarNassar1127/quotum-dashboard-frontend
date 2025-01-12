import { useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const handlePlay = () => {
    setPlaying(true);
    setShowThumbnail(false);
  };

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
      {showThumbnail && (
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={handlePlay}
        ></div>
      )}
      <ReactPlayer
        url="https://www.youtube.com/watch?v=QGbKUy6UBMg"
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
        playing={playing}
        controls={true}
      />
    </div>
  );
};

export default VideoPlayer;
