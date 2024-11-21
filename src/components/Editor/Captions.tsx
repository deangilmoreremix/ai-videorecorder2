import React, { useState } from 'react';
import { 
  Type, Languages, Settings, Wand2, Globe2, 
  MessageSquare, Palette, Layout, Save, Upload,
  VolumeX, Volume2, Edit3, Trash2, Clock
} from 'lucide-react';

interface Caption {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  style: CaptionStyle;
  language: string;
  speaker?: string;
  emotion?: string;
}

interface CaptionStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  position: 'top' | 'bottom' | 'middle';
  textEffect: string;
  opacity: number;
}

export const Captions: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [settings, setSettings] = useState({
    autoGenerate: true,
    autoTranslate: false,
    speakerDetection: true,
    emotionDetection: false,
    highContrast: false,
    screenReaderOptimized: false,
    language: 'en',
    style: {
      fontFamily: 'Arial',
      fontSize: 16,
      color: '#ffffff',
      backgroundColor: '#000000',
      position: 'bottom' as const,
      textEffect: 'none',
      opacity: 0.8
    }
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'style' | 'accessibility'>('edit');
  const [selectedCaptionId, setSelectedCaptionId] = useState<string | null>(null);

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Roboto', 'Open Sans'
  ];

  const positions = [
    { value: 'top', label: 'Top' },
    { value: 'middle', label: 'Middle' },
    { value: 'bottom', label: 'Bottom' }
  ];

  const textEffects = [
    { value: 'none', label: 'None' },
    { value: 'shadow', label: 'Shadow' },
    { value: 'outline', label: 'Outline' },
    { value: 'glow', label: 'Glow' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Advanced Captions</h3>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg" title="Auto-Translate">
            <Globe2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg" title="Import/Export">
            <Upload className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {[
          { id: 'edit', icon: Edit3, label: 'Edit' },
          { id: 'style', icon: Palette, label: 'Style' },
          { id: 'accessibility', icon: Type, label: 'Accessibility' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              activeTab === tab.id 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Edit Tab */}
      {activeTab === 'edit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Auto-Generate</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.autoGenerate}
                onChange={(e) => setSettings({
                  ...settings,
                  autoGenerate: e.target.checked
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({
                ...settings,
                language: e.target.value
              })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Speaker Detection</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.speakerDetection}
                onChange={(e) => setSettings({
                  ...settings,
                  speakerDetection: e.target.checked
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Emotion Detection</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.emotionDetection}
                onChange={(e) => setSettings({
                  ...settings,
                  emotionDetection: e.target.checked
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={settings.style.fontFamily}
              onChange={(e) => setSettings({
                ...settings,
                style: { ...settings.style, fontFamily: e.target.value }
              })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <input
              type="range"
              min="12"
              max="32"
              value={settings.style.fontSize}
              onChange={(e) => setSettings({
                ...settings,
                style: { ...settings.style, fontSize: parseInt(e.target.value) }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Small</span>
              <span>{settings.style.fontSize}px</span>
              <span>Large</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              value={settings.style.position}
              onChange={(e) => setSettings({
                ...settings,
                style: { 
                  ...settings.style, 
                  position: e.target.value as CaptionStyle['position']
                }
              })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
            >
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Effect
            </label>
            <select
              value={settings.style.textEffect}
              onChange={(e) => setSettings({
                ...settings,
                style: { ...settings.style, textEffect: e.target.value }
              })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
            >
              {textEffects.map((effect) => (
                <option key={effect.value} value={effect.value}>
                  {effect.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <input
                type="color"
                value={settings.style.color}
                onChange={(e) => setSettings({
                  ...settings,
                  style: { ...settings.style, color: e.target.value }
                })}
                className="w-full h-10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background
              </label>
              <input
                type="color"
                value={settings.style.backgroundColor}
                onChange={(e) => setSettings({
                  ...settings,
                  style: { ...settings.style, backgroundColor: e.target.value }
                })}
                className="w-full h-10 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Tab */}
      {activeTab === 'accessibility' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">High Contrast Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.highContrast}
                onChange={(e) => setSettings({
                  ...settings,
                  highContrast: e.target.checked
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Screen Reader Optimized</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.screenReaderOptimized}
                onChange={(e) => setSettings({
                  ...settings,
                  screenReaderOptimized: e.target.checked
                })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reading Speed
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value="1"
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Slower</span>
              <span>Normal</span>
              <span>Faster</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-2">
        <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
          Reset
        </button>
        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          Apply Changes
        </button>
      </div>
    </div>
  );
};