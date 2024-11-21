import React, { useState } from 'react';
import { 
  Type, Image, Music, Settings, Palette, Clock,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic
} from 'lucide-react';

interface IntroEditorProps {
  templateId: string;
  onSave: (data: any) => void;
}

export const IntroEditor: React.FC<IntroEditorProps> = ({ templateId, onSave }) => {
  const [text, setText] = useState({
    title: '',
    subtitle: '',
    tagline: ''
  });

  const [style, setStyle] = useState({
    fontFamily: 'Inter',
    titleSize: 48,
    subtitleSize: 24,
    taglineSize: 18,
    titleColor: '#ffffff',
    subtitleColor: '#e2e8f0',
    taglineColor: '#cbd5e1',
    alignment: 'center',
    titleWeight: 'bold',
    animation: 'fade',
    duration: 5
  });

  const [media, setMedia] = useState({
    background: null as File | null,
    logo: null as File | null,
    music: null as File | null,
    volume: 1
  });

  const fonts = [
    'Inter', 'Roboto', 'Montserrat', 'Playfair Display', 'Open Sans'
  ];

  const animations = [
    'fade', 'slide', 'zoom', 'bounce', 'rotate'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Customize Intro</h3>
        <button 
          onClick={() => onSave({ text, style, media })}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

      {/* Text Content */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center">
          <Type className="w-4 h-4 mr-2" />
          Text Content
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={text.title}
              onChange={(e) => setText({ ...text, title: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={text.subtitle}
              onChange={(e) => setText({ ...text, subtitle: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
              placeholder="Enter subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={text.tagline}
              onChange={(e) => setText({ ...text, tagline: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
              placeholder="Enter tagline"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Typography
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={style.fontFamily}
              onChange={(e) => setStyle({ ...style, fontFamily: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
            >
              {fonts.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animation
            </label>
            <select
              value={style.animation}
              onChange={(e) => setStyle({ ...style, animation: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
            >
              {animations.map((animation) => (
                <option key={animation} value={animation}>
                  {animation.charAt(0).toUpperCase() + animation.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setStyle({ ...style, alignment: 'left' })}
            className={`p-2 rounded ${
              style.alignment === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setStyle({ ...style, alignment: 'center' })}
            className={`p-2 rounded ${
              style.alignment === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setStyle({ ...style, alignment: 'right' })}
            className={`p-2 rounded ${
              style.alignment === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center">
          <Image className="w-4 h-4 mr-2" />
          Media
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMedia({
                ...media,
                background: e.target.files?.[0] || null
              })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMedia({
                ...media,
                logo: e.target.files?.[0] || null
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Audio */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center">
          <Music className="w-4 h-4 mr-2" />
          Audio
        </h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Music
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setMedia({
              ...media,
              music: e.target.files?.[0] || null
            })}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={media.volume}
            onChange={(e) => setMedia({
              ...media,
              volume: parseFloat(e.target.value)
            })}
            className="w-full"
          />
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Duration
        </h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Length (seconds)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={style.duration}
            onChange={(e) => setStyle({
              ...style,
              duration: parseInt(e.target.value)
            })}
            className="w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};