import React, { useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Download, Scissors, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEditorStore } from '../../store';
import { TimelineEditor } from './TimelineEditor';

export const VideoPlayback: React.FC = () => {
  const { currentProject } = useEditorStore();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (videoRef.current?.src) {
      const a = document.createElement('a');
      a.href = videoRef.current.src;
      a.download = `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const videoUrl = currentProject?.timeline?.clips?.[0]?.url;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-video bg-gray-900 relative">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No recording selected
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={!videoUrl}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlayback}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={!videoUrl}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(
                      videoRef.current.duration,
                      videoRef.current.currentTime + 5
                    );
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={!videoUrl}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              {videoUrl && (
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
              )}
            </div>
          </div>

          {/* Timeline Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-blue-600 transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value);
                if (videoRef.current) {
                  videoRef.current.currentTime = time;
                }
                setCurrentTime(time);
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              disabled={!videoUrl}
            />
          </div>
        </div>
      </div>

      {/* Timeline Editor */}
      <TimelineEditor
        currentTime={currentTime}
        duration={duration}
        onTimeUpdate={(time) => {
          if (videoRef.current) {
            videoRef.current.currentTime = time;
          }
        }}
      />
    </div>
  );
};