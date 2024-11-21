import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { MediaPipeFaceDetectorMediaPipe } from '@tensorflow-models/face-landmarks-detection/dist/types';

interface FaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled: boolean;
  onFacesDetected?: (faces: any[]) => void;
}

export const FaceDetection: React.FC<FaceDetectionProps> = ({ 
  videoRef, 
  enabled, 
  onFacesDetected 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<MediaPipeFaceDetectorMediaPipe | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const initializeDetector = async () => {
      if (!enabled) return;

      try {
        await tf.ready();
        await tf.setBackend('webgl');
        
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceDetector;
        const detector = await faceLandmarksDetection.createDetector(model, {
          runtime: 'mediapipe',
          maxFaces: 4,
          refineLandmarks: true
        });
        
        setDetector(detector);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize face detector:', err);
        setError('Failed to initialize face detection. Please check your browser compatibility.');
        setIsLoading(false);
      }
    };

    initializeDetector();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      setDetector(null);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !detector || !videoRef.current || !canvasRef.current || isProcessing) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current || isProcessing) return;
      setIsProcessing(true);

      try {
        const faces = await detector.estimateFaces(videoRef.current, {
          flipHorizontal: false
        });
        
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Draw the video frame
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        // Draw face detections
        faces.forEach((face: any) => {
          const { box, keypoints } = face;
          
          // Draw bounding box
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.strokeRect(box.xMin, box.yMin, box.width, box.height);

          // Draw keypoints
          ctx.fillStyle = '#00ff00';
          keypoints.forEach((point: { x: number; y: number }) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        });

        if (onFacesDetected) {
          onFacesDetected(faces);
        }
      } catch (err) {
        console.error('Face detection error:', err);
      }

      setIsProcessing(false);
      requestRef.current = requestAnimationFrame(detectFaces);
    };

    detectFaces();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [detector, enabled, videoRef, onFacesDetected, isProcessing]);

  if (!enabled) return null;

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-white text-sm">
          Initializing face detection...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-red-500 text-sm max-w-md text-center px-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      width={videoRef.current?.videoWidth || 640}
      height={videoRef.current?.videoHeight || 480}
    />
  );
};