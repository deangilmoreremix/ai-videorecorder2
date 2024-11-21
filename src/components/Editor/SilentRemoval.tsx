import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, VolumeX, Settings, Play, Pause, Save, 
  RotateCcw, Filter, Sliders, Activity, Music, 
  Waveform, AlertCircle, CheckCircle 
} from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { useEditorStore } from '../../store/editorStore';

export const SilentRemoval: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [threshold, setThreshold] = useState(-40);
  const [minDuration, setMinDuration] = useState(0.5);
  const [padding, setPadding] = useState(0.1);
  const [preserveMusic, setPreserveMusic] = useState(true);
  const [noiseReduction, setNoiseReduction] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [autoNormalize, setAutoNormalize] = useState(true);
  const [crossfadeDuration, setCrossfadeDuration] = useState(0.1);
  const [detectedSegments, setDetectedSegments] = useState<Array<{
    start: number;
    end: number;
    type: 'silence' | 'speech' | 'music';
    confidence: number;
  }>>([]);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4f46e5',
        progressColor: '#818cf8',
        cursorColor: '#312e81',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 60,
        plugins: []
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, []);

  const handleDetectSilence = async () => {
    setIsProcessing(true);
    try {
      // Simulated detection process
      const segments = [
        { start: 0, end: 2, type: 'speech', confidence: 0.95 },
        { start: 2, end: 4, type: 'silence', confidence: 0.88 },
        { start: 4, end: 8, type: 'music', confidence: 0.92 }
      ];
      setDetectedSegments(segments);
    } catch (error) {
      console.error('Error detecting silence:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Silent Removal</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={waveformRef} className="mb-4" />

      {/* Basic Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Silence Threshold</span>
            <span className="text-sm text-gray-500">{threshold} dB</span>
          </div>
          <input
            type="range"
            min="-60"
            max="-20"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Minimum Duration</span>
            <span className="text-sm text-gray-500">{minDuration}s</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={minDuration}
            onChange={(e) => setMinDuration(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Padding</span>
            <span className="text-sm text-gray-500">{padding}s</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={padding}
            onChange={(e) => setPadding(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Preserve Music</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preserveMusic}
                onChange={(e) => setPreserveMusic(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Noise Reduction</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={noiseReduction}
                onChange={(e) => setNoiseReduction(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Crossfade Duration</span>
              <span className="text-sm text-gray-500">{crossfadeDuration}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.05"
              value={crossfadeDuration}
              onChange={(e) => setCrossfadeDuration(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Auto Normalize Audio</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoNormalize}
                onChange={(e) => setAutoNormalize(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>
      )}

      {/* Detected Segments */}
      {detectedSegments.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Detected Segments</h4>
          <div className="space-y-2">
            {detectedSegments.map((segment, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded border"
              >
                <div className="flex items-center space-x-2">
                  {segment.type === 'silence' ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : segment.type === 'speech' ? (
                    <Volume2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Music className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-sm">{segment.type}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {segment.start}s - {segment.end}s
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round(segment.confidence * 100)}% confidence
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleDetectSilence}
          disabled={isProcessing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Filter className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>Detect Silence</span>
            </>
          )}
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setThreshold(-40);
              setMinDuration(0.5);
              setPadding(0.1);
              setCrossfadeDuration(0.1);
              setPreserveMusic(true);
              setNoiseReduction(false);
              setAutoNormalize(true);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Reset
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white 
              rounded-lg hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};