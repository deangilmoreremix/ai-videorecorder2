import React, { useState } from 'react';
import { useEditorStore } from '../../store';
import {
  Wand2, Droplets, Sun, Contrast, Palette, Sparkles, CloudFog, Wind,
  Sliders, Layers, Gauge, Fingerprint, Lightbulb, Aperture, Zap, Flame,
  Snowflake, Rainbow, Filter, Maximize
} from 'lucide-react';

export const VideoEffects: React.FC = () => {
  const { videoEffects, updateVideoEffects } = useEditorStore();
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const effects = [
    // Color Adjustments
    { name: 'Color Grade', icon: Palette, color: 'purple', param: 'colorGrade', group: 'color' },
    { name: 'Temperature', icon: Flame, color: 'orange', param: 'temperature', group: 'color' },
    { name: 'Tint', icon: Droplets, color: 'blue', param: 'tint', group: 'color' },
    { name: 'Vibrance', icon: Rainbow, color: 'pink', param: 'vibrance', group: 'color' },
    { name: 'Saturation', icon: Palette, color: 'red', param: 'saturation', group: 'color' },

    // Light & Exposure
    { name: 'Exposure', icon: Sun, color: 'yellow', param: 'exposure', group: 'light' },
    { name: 'Brightness', icon: Lightbulb, color: 'yellow', param: 'brightness', group: 'light' },
    { name: 'Contrast', icon: Contrast, color: 'gray', param: 'contrast', group: 'light' },
    { name: 'Highlights', icon: Zap, color: 'yellow', param: 'highlights', group: 'light' },
    { name: 'Shadows', icon: CloudFog, color: 'gray', param: 'shadows', group: 'light' },

    // Detail Enhancement
    { name: 'Sharpness', icon: Aperture, color: 'blue', param: 'sharpness', group: 'detail' },
    { name: 'Clarity', icon: Maximize, color: 'cyan', param: 'clarity', group: 'detail' },
    { name: 'Dehaze', icon: Wind, color: 'blue', param: 'dehaze', group: 'detail' },
    { name: 'Noise Reduction', icon: Snowflake, color: 'purple', param: 'noiseReduction', group: 'detail' },

    // Creative Effects
    { name: 'Vignette', icon: Filter, color: 'indigo', param: 'vignette', group: 'creative' },
    { name: 'Film Grain', icon: Sparkles, color: 'amber', param: 'grain', group: 'creative' },
    { name: 'Blur', icon: CloudFog, color: 'blue', param: 'blur', group: 'creative' },
    { name: 'Glow', icon: Sparkles, color: 'yellow', param: 'glow', group: 'creative' }
  ];

  const presets = [
    {
      name: 'Cinematic',
      settings: {
        contrast: 1.2,
        saturation: 0.9,
        temperature: 0.95,
        vignette: 0.3,
        grain: 0.2,
        highlights: -0.2,
        shadows: 0.2
      }
    },
    {
      name: 'Vintage',
      settings: {
        saturation: 0.8,
        temperature: 0.85,
        tint: 0.1,
        grain: 0.4,
        vignette: 0.4,
        contrast: 1.1
      }
    },
    {
      name: 'Vibrant',
      settings: {
        saturation: 1.3,
        vibrance: 1.2,
        contrast: 1.1,
        clarity: 0.3,
        highlights: 0.2
      }
    },
    {
      name: 'Moody',
      settings: {
        contrast: 1.3,
        highlights: -0.3,
        shadows: 0.3,
        saturation: 0.9,
        temperature: 0.9,
        vignette: 0.5
      }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Video Effects</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Presets</h4>
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => updateVideoEffects(preset.settings)}
              className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Effect Groups */}
      <div className="space-y-6">
        {['color', 'light', 'detail', 'creative'].map((group) => (
          <div key={group}>
            <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
              {group} Adjustments
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {effects
                .filter((effect) => effect.group === group)
                .map((effect) => {
                  const Icon = effect.icon;
                  return (
                    <button
                      key={effect.param}
                      onClick={() => setActiveEffect(
                        activeEffect === effect.param ? null : effect.param
                      )}
                      className={`flex flex-col items-center p-3 rounded-lg transition-colors
                        ${activeEffect === effect.param 
                          ? `bg-${effect.color}-50 border-${effect.color}-200` 
                          : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      <Icon className={`w-5 h-5 mb-1 text-${effect.color}-500`} />
                      <span className="text-xs">{effect.name}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Active Effect Controls */}
      {activeEffect && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">
              {effects.find(e => e.param === activeEffect)?.name}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateVideoEffects({ [activeEffect]: 1 })}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Reset
              </button>
              <input
                type="number"
                value={videoEffects[activeEffect]}
                onChange={(e) => updateVideoEffects({
                  [activeEffect]: parseFloat(e.target.value)
                })}
                className="w-16 px-2 py-1 text-sm border rounded"
                step="0.1"
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={videoEffects[activeEffect]}
            onChange={(e) => updateVideoEffects({
              [activeEffect]: parseFloat(e.target.value)
            })}
            className="w-full"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => {
            updateVideoEffects({
              brightness: 1,
              contrast: 1,
              saturation: 1,
              temperature: 1,
              tint: 0,
              highlights: 0,
              shadows: 0,
              clarity: 0,
              sharpness: 0,
              dehaze: 0,
              vignette: 0,
              grain: 0,
              blur: 0,
              glow: 0
            });
            setActiveEffect(null);
          }}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Reset All
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Apply Effects
        </button>
      </div>
    </div>
  );
};