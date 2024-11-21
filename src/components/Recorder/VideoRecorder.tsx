import React, { useState, useRef, useCallback } from 'react';
import { Camera, StopCircle, Video, Mic, Settings, Wand2, Layout, Maximize2, Minimize2 } from 'lucide-react';
import { FaceDetection } from '../AI/FaceDetection';
import { useEditorStore } from '../../store';
import { VideoDownloader } from '../Export/VideoDownloader';

interface RecordingMode {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('webcam');
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showDownloader, setShowDownloader] = useState(false);
  const [aiFeatures, setAiFeatures] = useState({
    faceDetection: false,
    backgroundBlur: false,
    autoFraming: false,
    beautification: false,
    gestureControl: false,
    emotionDetection: false,
    greenScreen: false,
    objectTracking: false
  });

  const recordingModes: RecordingMode[] = [
    { 
      id: 'webcam',
      name: 'Webcam',
      icon: Camera,
      description: 'Record using your camera'
    },
    { 
      id: 'screen',
      name: 'Screen',
      icon: Maximize2,
      description: 'Record your screen'
    },
    { 
      id: 'picture-in-picture',
      name: 'PiP',
      icon: Layout,
      description: 'Camera overlay on screen'
    },
    { 
      id: 'window',
      name: 'Window',
      icon: Minimize2,
      description: 'Record specific window'
    }
  ];

  const [settings, setSettings] = useState({
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 60 },
      facingMode: 'user'
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000,
      channelCount: 2
    }
  });

  const startRecording = async () => {
    try {
      let mediaStream: MediaStream;

      switch (selectedMode) {
        case 'screen':
          mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
          });
          break;
        case 'picture-in-picture':
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
          });
          const cameraStream = await navigator.mediaDevices.getUserMedia(settings);
          // Combine streams (implementation needed)
          mediaStream = screenStream;
          break;
        case 'window':
          mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: 'window'
            },
            audio: true
          });
          break;
        default:
          mediaStream = await navigator.mediaDevices.getUserMedia(settings);
      }

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && stream) {
      mediaRecorderRef.current.stop();
      stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);

      // Create blob from recorded chunks
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      setRecordedBlob(blob);
      setShowDownloader(true);
      setRecordedChunks([]);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Video Recorder</h2>
        <div className="flex items-center space-x-2">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
          >
            {recordingModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.name}
              </option>
            ))}
          </select>
          <button className="p-2 rounded-lg bg-gray-100">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {aiFeatures.faceDetection && (
          <FaceDetection
            videoRef={videoRef}
            enabled={aiFeatures.faceDetection}
            onFacesDetected={console.log}
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Object.entries(aiFeatures).map(([feature, enabled]) => (
          <button
            key={feature}
            onClick={() => setAiFeatures(prev => ({
              ...prev,
              [feature]: !prev[feature]
            }))}
            className={`p-2 rounded-lg text-sm flex items-center justify-center space-x-1
              ${enabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          >
            <Wand2 className="w-4 h-4" />
            <span>{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Video className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <StopCircle className="w-5 h-5" />
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {/* Video Downloader */}
      {showDownloader && recordedBlob && (
        <VideoDownloader 
          videoBlob={recordedBlob}
          isOpen={showDownloader}
          onClose={() => setShowDownloader(false)}
        />
      )}
    </div>
  );
};