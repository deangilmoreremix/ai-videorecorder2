import React from 'react';
import { Play, Star, Download, Edit2, Clock } from 'lucide-react';

interface IntroTemplate {
  id: string;
  name: string;
  thumbnail: string;
  duration: number;
  category: 'corporate' | 'creative' | 'minimal' | 'dynamic' | 'custom';
  tags: string[];
  isPremium: boolean;
  preview: string;
}

interface IntroTemplatesProps {
  onSelect: (templateId: string) => void;
  selectedId: string | null;
}

export const IntroTemplates: React.FC<IntroTemplatesProps> = ({ onSelect, selectedId }) => {
  const templates: IntroTemplate[] = [
    {
      id: '1',
      name: 'Corporate Clean',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      duration: 15,
      category: 'corporate',
      tags: ['professional', 'business', 'clean'],
      isPremium: false,
      preview: '/previews/corporate-clean.mp4'
    },
    {
      id: '2',
      name: 'Creative Flow',
      thumbnail: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27',
      duration: 20,
      category: 'creative',
      tags: ['artistic', 'colorful', 'dynamic'],
      isPremium: true,
      preview: '/previews/creative-flow.mp4'
    },
    {
      id: '3',
      name: 'Minimal Style',
      thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
      duration: 10,
      category: 'minimal',
      tags: ['clean', 'simple', 'elegant'],
      isPremium: false,
      preview: '/previews/minimal-style.mp4'
    },
    {
      id: '4',
      name: 'Dynamic Opener',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
      duration: 25,
      category: 'dynamic',
      tags: ['energetic', 'modern', 'bold'],
      isPremium: true,
      preview: '/previews/dynamic-opener.mp4'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Intro Templates</h3>
        <div className="flex space-x-2">
          <select className="text-sm border rounded-lg px-2 py-1">
            <option value="all">All Categories</option>
            <option value="corporate">Corporate</option>
            <option value="creative">Creative</option>
            <option value="minimal">Minimal</option>
            <option value="dynamic">Dynamic</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`relative group rounded-lg overflow-hidden bg-gray-100 cursor-pointer
              ${selectedId === template.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="aspect-video">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 
                transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle preview
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(template.id);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{template.duration}s</span>
                  </div>
                </div>
                {template.isPremium && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};