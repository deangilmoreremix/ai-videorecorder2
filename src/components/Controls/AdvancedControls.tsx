import React from 'react';
import { useEditorStore } from '../../store';
import {
  Settings, Sliders, Wand2, Layout, Film,
  Volume2, Type, BookOpen, Clock, Gauge
} from 'lucide-react';

export const AdvancedControls: React.FC = () => {
  const { videoEffects, updateVideoEffects } = useEditorStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Advanced Controls</h3>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2">
        <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
          <Film className="w-5 h-5 mb-1" />
          <span className="text-xs">Split</span>
        </button>
        <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
          <Wand2 className="w-5 h-5 mb-1" />
          <span className="text-xs">Effects</span>
        </button>
        <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
          <Volume2 className="w-5 h-5 mb-1" />
          <span className="text-xs">Audio</span>
        </button>
        <button className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
          <Type className="w-5 h-5 mb-1" />
          <span className="text-xs">Text</span>
        </button>
      </div>

      {/* Timeline Controls */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Timeline Zoom</span>
          <span className="text-sm text-gray-500">100%</span>
        </div>
        <input
          type="range"
          min="50"
          max="200"
          className="w-full"
          onChange={(e) => {
            // Handle zoom level change
          }}
        />
      </div>

      {/* Playback Speed */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Playback Speed</span>
          <span className="text-sm text-gray-500">1x</span>
        </div>
        <select className="w-full rounded-lg border-gray-300">
          <option value="0.5">0.5x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Snap to Grid</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
              peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
              after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
              after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Auto-Save</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
              peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
              after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
              after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Show Waveform</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
              peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
              after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
              after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="text-sm">
        <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 gap-2 text-gray-600">
          <div>Split Clip: <kbd className="px-2 py-1 bg-gray-100 rounded">S</kbd></div>
          <div>Delete: <kbd className="px-2 py-1 bg-gray-100 rounded">Del</kbd></div>
          <div>Undo: <kbd className="px-2 py-1 bg-gray-100 rounded">⌘Z</kbd></div>
          <div>Redo: <kbd className="px-2 py-1 bg-gray-100 rounded">⌘⇧Z</kbd></div>
        </div>
      </div>
    </div>
  );
};