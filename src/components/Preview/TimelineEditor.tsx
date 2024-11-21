import React, { useState, useRef, useEffect } from 'react';
import { 
  Scissors, Plus, ChevronRight, ChevronLeft, Clock, Layers,
  Maximize2, Minimize2, BookOpen, FastForward, Rewind, Music,
  ArrowLeftRight, Eye, Settings
} from 'lucide-react';

interface TimelineEditorProps {
  currentTime: number;
  duration: number;
  onTimeUpdate: (time: number) => void;
}

interface Marker {
  id: string;
  time: number;
  label?: string;
  type: 'cut' | 'bookmark' | 'transition';
}

interface Track {
  id: string;
  type: 'video' | 'audio' | 'overlay';
  clips: Array<{
    id: string;
    startTime: number;
    endTime: number;
    type: string;
  }>;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  currentTime,
  duration,
  onTimeUpdate
}) => {
  const [zoom, setZoom] = useState(1);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isSnapping, setIsSnapping] = useState(true);
  const [showWaveform, setShowWaveform] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<{start: number; end: number} | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Zoom presets
  const zoomPresets = [
    { label: 'Fit', value: 1 },
    { label: '1s', value: 2 },
    { label: '5s', value: 3 },
    { label: '10s', value: 4 }
  ];

  const addMarker = (type: Marker['type'] = 'cut') => {
    const newMarker: Marker = {
      id: Math.random().toString(36).substr(2, 9),
      time: currentTime,
      type,
      label: `Marker ${markers.length + 1}`
    };
    setMarkers([...markers, newMarker].sort((a, b) => a.time - b.time));
  };

  const removeMarker = (id: string) => {
    setMarkers(markers.filter(m => m.id !== id));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;
    onTimeUpdate(Math.max(0, Math.min(duration, newTime)));
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case ' ':
        // Play/Pause toggle
        break;
      case 'j':
        onTimeUpdate(Math.max(0, currentTime - 1/30)); // Back 1 frame
        break;
      case 'k':
        // Play/Pause toggle
        break;
      case 'l':
        onTimeUpdate(Math.min(duration, currentTime + 1/30)); // Forward 1 frame
        break;
      case 'm':
        addMarker();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTime, duration]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Timeline Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addMarker('cut')}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Split at Playhead (S)"
          >
            <Scissors className="w-5 h-5" />
          </button>
          <button
            onClick={() => addMarker('bookmark')}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Add Bookmark (M)"
          >
            <BookOpen className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button
            onClick={() => setIsSnapping(!isSnapping)}
            className={`p-2 rounded-lg ${isSnapping ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Toggle Snapping"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowWaveform(!showWaveform)}
            className={`p-2 rounded-lg ${showWaveform ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Toggle Waveform"
          >
            <Music className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <select 
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="select-custom"
          >
            {zoomPresets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={zoom <= 0.5}
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoom(Math.min(4, zoom + 0.5))}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={zoom >= 4}
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Timeline View */}
      <div 
        ref={timelineRef}
        className="relative h-32 bg-gray-900 rounded-lg overflow-hidden"
        onClick={handleTimelineClick}
      >
        {/* Time Markers */}
        <div className="absolute top-0 left-0 w-full h-6 bg-gray-800 flex">
          {Array.from({ length: Math.ceil(duration * zoom) }).map((_, i) => (
            <div 
              key={i}
              className="flex-1 border-r border-gray-700 text-xs p-1 text-gray-400"
            >
              {formatTime(i / zoom)}
            </div>
          ))}
        </div>

        {/* Tracks */}
        <div className="absolute top-6 left-0 w-full h-20 bg-gray-800">
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
            style={{ 
              left: `${(currentTime / duration) * 100}%`,
              transform: `scaleX(${1/zoom})`
            }}
          />

          {/* Markers */}
          {markers.map((marker) => (
            <div
              key={marker.id}
              className={`absolute top-0 bottom-0 w-0.5 cursor-pointer z-20
                ${marker.type === 'cut' ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ 
                left: `${(marker.time / duration) * 100}%`,
                transform: `scaleX(${1/zoom})`
              }}
              onClick={() => removeMarker(marker.id)}
              title={`${marker.label} (${formatTime(marker.time)})`}
            >
              <div className="absolute top-0 -translate-x-1/2 px-1 py-0.5 text-xs text-white bg-gray-800 rounded">
                {marker.type === 'cut' ? 'Cut' : 'Mark'}
              </div>
            </div>
          ))}

          {/* Waveform (if enabled) */}
          {showWaveform && (
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              {/* Waveform visualization would be rendered here */}
            </div>
          )}

          {/* Selected Region */}
          {selectedRegion && (
            <div
              className="absolute top-0 bottom-0 bg-blue-500 opacity-20"
              style={{
                left: `${(selectedRegion.start / duration) * 100}%`,
                width: `${((selectedRegion.end - selectedRegion.start) / duration) * 100}%`
              }}
            />
          )}
        </div>

        {/* Zoom Region */}
        <div 
          className="absolute bottom-0 left-0 w-full h-6 bg-gray-800 flex items-center px-2"
          style={{ transform: `scaleX(${zoom})`, transformOrigin: 'left' }}
        >
          <div className="w-full h-2 bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Timeline Info */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4 text-gray-600">
          <span>Current: {formatTime(currentTime)}</span>
          <span>Duration: {formatTime(duration)}</span>
          {selectedRegion && (
            <span>
              Selected: {formatTime(selectedRegion.end - selectedRegion.start)}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg" 
            title="Frame Back (J)"
          >
            <Rewind className="w-4 h-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg" 
            title="Frame Forward (L)"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};