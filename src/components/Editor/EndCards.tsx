import React, { useState } from 'react';
import { 
  Layout, Plus, Link, Image, Grid, Move, Palette, Play,
  Youtube, Facebook, Instagram, Twitter, Trash2, Copy,
  Edit2, Eye, Settings, ChevronDown, ArrowRight, Clock,
  BarChart2, MousePointer, Layers
} from 'lucide-react';

interface EndCard {
  id: string;
  type: 'video' | 'playlist' | 'subscribe' | 'link' | 'social';
  title: string;
  url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    background: string;
    border: string;
    shadow: string;
    opacity: number;
    animation: string;
  };
  timing: {
    start: number;
    duration: number;
    delay: number;
  };
  analytics: {
    clicks: number;
    impressions: number;
    ctr: number;
  };
  platform?: 'youtube' | 'facebook' | 'instagram' | 'twitter';
  layout?: 'grid' | 'overlay' | 'sidebar';
}

interface EndCardTemplate {
  id: string;
  name: string;
  layout: string;
  cards: Partial<EndCard>[];
}

export const EndCards: React.FC = () => {
  const [endCards, setEndCards] = useState<EndCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'timing' | 'analytics'>('layout');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const templates: EndCardTemplate[] = [
    {
      id: 'youtube-standard',
      name: 'YouTube Standard',
      layout: 'grid',
      cards: [
        { type: 'video', position: { x: 70, y: 20 }, size: { width: 25, height: 25 } },
        { type: 'playlist', position: { x: 70, y: 50 }, size: { width: 25, height: 25 } },
        { type: 'subscribe', position: { x: 20, y: 80 }, size: { width: 30, height: 10 } }
      ]
    },
    {
      id: 'social-bundle',
      name: 'Social Bundle',
      layout: 'overlay',
      cards: [
        { type: 'social', platform: 'youtube', position: { x: 10, y: 10 } },
        { type: 'social', platform: 'instagram', position: { x: 10, y: 30 } },
        { type: 'social', platform: 'twitter', position: { x: 10, y: 50 } }
      ]
    }
  ];

  const animations = [
    'fade', 'slide', 'zoom', 'bounce', 'rotate'
  ];

  const layouts = [
    { id: 'grid', name: 'Grid Layout', icon: Grid },
    { id: 'overlay', name: 'Overlay', icon: Layers },
    { id: 'sidebar', name: 'Sidebar', icon: Layout }
  ];

  const addEndCard = (type: EndCard['type'], template?: Partial<EndCard>) => {
    const newCard: EndCard = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: `New ${type} card`,
      url: '',
      position: template?.position || { x: 50, y: 50 },
      size: template?.size || { width: 20, height: 20 },
      style: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        shadow: 'lg',
        opacity: 1,
        animation: 'fade'
      },
      timing: {
        start: 0,
        duration: 20,
        delay: 0
      },
      analytics: {
        clicks: 0,
        impressions: 0,
        ctr: 0
      },
      ...template
    };
    setEndCards([...endCards, newCard]);
    setSelectedCard(newCard.id);
  };

  const applyTemplate = (template: EndCardTemplate) => {
    const newCards = template.cards.map(cardTemplate => {
      return addEndCard(cardTemplate.type || 'video', cardTemplate);
    });
    setEndCards(newCards);
  };

  const duplicateCard = (id: string) => {
    const card = endCards.find(c => c.id === id);
    if (card) {
      const newCard = {
        ...card,
        id: Math.random().toString(36).substr(2, 9),
        position: {
          x: card.position.x + 5,
          y: card.position.y + 5
        }
      };
      setEndCards([...endCards, newCard]);
    }
  };

  const deleteCard = (id: string) => {
    setEndCards(endCards.filter(card => card.id !== id));
    if (selectedCard === id) {
      setSelectedCard(null);
    }
  };

  const updateCard = (id: string, updates: Partial<EndCard>) => {
    setEndCards(endCards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    ));
  };

  const renderAnalytics = (card: EndCard) => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Clicks</div>
          <div className="text-lg font-semibold">{card.analytics.clicks}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Impressions</div>
          <div className="text-lg font-semibold">{card.analytics.impressions}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">CTR</div>
          <div className="text-lg font-semibold">{card.analytics.ctr}%</div>
        </div>
      </div>
      <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
        Analytics Graph Placeholder
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">End Cards</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`p-2 rounded-lg ${
              previewMode ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Preview Mode"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-lg ${
              showAdvanced ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Advanced Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Plus className="w-5 h-5" />
            </button>
            {showTemplates && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    addEndCard('video');
                    setShowTemplates(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Add Video Card
                </button>
                <button
                  onClick={() => {
                    addEndCard('playlist');
                    setShowTemplates(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Add Playlist
                </button>
                <button
                  onClick={() => {
                    addEndCard('subscribe');
                    setShowTemplates(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Add Subscribe Button
                </button>
                <div className="h-px bg-gray-200 my-1" />
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      applyTemplate(template);
                      setShowTemplates(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
        {endCards.map((card) => (
          <div
            key={card.id}
            style={{
              left: `${card.position.x}%`,
              top: `${card.position.y}%`,
              width: `${card.size.width}%`,
              height: `${card.size.height}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className={`absolute bg-white rounded shadow-lg cursor-move
              ${selectedCard === card.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedCard(card.id)}
          >
            <div className="p-2">
              <div className="text-xs font-medium truncate">{card.title}</div>
              <div className="text-xs text-gray-500">{card.timing.duration}s</div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Tabs */}
      {selectedCard && (
        <div className="space-y-4">
          <div className="flex space-x-2 border-b">
            {(['layout', 'style', 'timing', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position X (%)
                  </label>
                  <input
                    type="number"
                    value={endCards.find(c => c.id === selectedCard)?.position.x}
                    onChange={(e) => updateCard(selectedCard, {
                      position: {
                        ...endCards.find(c => c.id === selectedCard)!.position,
                        x: Number(e.target.value)
                      }
                    })}
                    className="w-full rounded-lg border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position Y (%)
                  </label>
                  <input
                    type="number"
                    value={endCards.find(c => c.id === selectedCard)?.position.y}
                    onChange={(e) => updateCard(selectedCard, {
                      position: {
                        ...endCards.find(c => c.id === selectedCard)!.position,
                        y: Number(e.target.value)
                      }
                    })}
                    className="w-full rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (%)
                  </label>
                  <input
                    type="number"
                    value={endCards.find(c => c.id === selectedCard)?.size.width}
                    onChange={(e) => updateCard(selectedCard, {
                      size: {
                        ...endCards.find(c => c.id === selectedCard)!.size,
                        width: Number(e.target.value)
                      }
                    })}
                    className="w-full rounded-lg border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (%)
                  </label>
                  <input
                    type="number"
                    value={endCards.find(c => c.id === selectedCard)?.size.height}
                    onChange={(e) => updateCard(selectedCard, {
                      size: {
                        ...endCards.find(c => c.id === selectedCard)!.size,
                        height: Number(e.target.value)
                      }
                    })}
                    className="w-full rounded-lg border-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={endCards.find(c => c.id === selectedCard)?.style.background}
                  onChange={(e) => updateCard(selectedCard, {
                    style: {
                      ...endCards.find(c => c.id === selectedCard)!.style,
                      background: e.target.value
                    }
                  })}
                  className="w-full h-10 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Animation
                </label>
                <select
                  value={endCards.find(c => c.id === selectedCard)?.style.animation}
                  onChange={(e) => updateCard(selectedCard, {
                    style: {
                      ...endCards.find(c => c.id === selectedCard)!.style,
                      animation: e.target.value
                    }
                  })}
                  className="w-full rounded-lg border-gray-300"
                >
                  {animations.map((animation) => (
                    <option key={animation} value={animation}>
                      {animation.charAt(0).toUpperCase() + animation.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={endCards.find(c => c.id === selectedCard)?.style.opacity}
                  onChange={(e) => updateCard(selectedCard, {
                    style: {
                      ...endCards.find(c => c.id === selectedCard)!.style,
                      opacity: Number(e.target.value)
                    }
                  })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {activeTab === 'timing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time (s)
                </label>
                <input
                  type="number"
                  value={endCards.find(c => c.id === selectedCard)?.timing.start}
                  onChange={(e) => updateCard(selectedCard, {
                    timing: {
                      ...endCards.find(c => c.id === selectedCard)!.timing,
                      start: Number(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (s)
                </label>
                <input
                  type="number"
                  value={endCards.find(c => c.id === selectedCard)?.timing.duration}
                  onChange={(e) => updateCard(selectedCard, {
                    timing: {
                      ...endCards.find(c => c.id === selectedCard)!.timing,
                      duration: Number(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay (s)
                </label>
                <input
                  type="number"
                  value={endCards.find(c => c.id === selectedCard)?.timing.delay}
                  onChange={(e) => updateCard(selectedCard, {
                    timing: {
                      ...endCards.find(c => c.id === selectedCard)!.timing,
                      delay: Number(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border-gray-300"
                />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              {renderAnalytics(endCards.find(c => c.id === selectedCard)!)}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => duplicateCard(selectedCard)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Duplicate
            </button>
            <button
              onClick={() => deleteCard(selectedCard)}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {endCards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Layout className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No end cards yet. Click the plus button to add one.</p>
        </div>
      )}
    </div>
  );
};