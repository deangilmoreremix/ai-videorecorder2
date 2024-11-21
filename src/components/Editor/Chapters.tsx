import React, { useState } from 'react';
import { 
  BookOpen, Plus, Clock, Edit2, Wand2, Loader, Download, Upload,
  Move, ChevronDown, ChevronRight, Image, MoreVertical, Copy, Trash2,
  FileText, List, LayoutGrid
} from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  type: 'manual' | 'auto';
  confidence?: number;
  description?: string;
  thumbnail?: string;
  parentId?: string;
  children?: Chapter[];
  notes?: string[];
  tags?: string[];
}

interface ChapterTemplate {
  id: string;
  name: string;
  chapters: Omit<Chapter, 'id' | 'startTime' | 'endTime'>[];
}

export const Chapters: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const [autoDetectSettings, setAutoDetectSettings] = useState({
    sceneDetection: true,
    audioAnalysis: true,
    contentAnalysis: true,
    minDuration: 30,
    confidence: 0.5
  });

  const templates: ChapterTemplate[] = [
    {
      id: 'tutorial',
      name: 'Tutorial Video',
      chapters: [
        { title: 'Introduction', type: 'manual' },
        { title: 'Overview', type: 'manual' },
        { title: 'Step 1', type: 'manual' },
        { title: 'Step 2', type: 'manual' },
        { title: 'Conclusion', type: 'manual' }
      ]
    },
    {
      id: 'product',
      name: 'Product Review',
      chapters: [
        { title: 'Intro', type: 'manual' },
        { title: 'Product Overview', type: 'manual' },
        { title: 'Features', type: 'manual' },
        { title: 'Pros & Cons', type: 'manual' },
        { title: 'Final Thoughts', type: 'manual' }
      ]
    }
  ];

  const addChapter = (template?: ChapterTemplate) => {
    if (template) {
      const newChapters = template.chapters.map((chapter, index) => ({
        ...chapter,
        id: Math.random().toString(36).substr(2, 9),
        startTime: index * 30,
        endTime: (index + 1) * 30
      }));
      setChapters([...chapters, ...newChapters]);
    } else {
      const newChapter: Chapter = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Chapter ${chapters.length + 1}`,
        startTime: 0,
        endTime: 0,
        type: 'manual'
      };
      setChapters([...chapters, newChapter]);
    }
  };

  const detectChapters = async () => {
    setIsProcessing(true);
    try {
      // Simulated detection result
      const detectedChapters: Chapter[] = [
        {
          id: '1',
          title: 'Introduction',
          startTime: 0,
          endTime: 30,
          type: 'auto',
          confidence: 0.95
        }
      ];

      setChapters(prev => [
        ...prev,
        ...detectedChapters
      ].sort((a, b) => a.startTime - b.startTime));
    } catch (error) {
      console.error('Chapter detection failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(chapters, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chapters.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedChapters = JSON.parse(event.target?.result as string);
          setChapters(importedChapters);
        } catch (error) {
          console.error('Failed to import chapters:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleChapterExpansion = (id: string) => {
    setExpandedChapters(prev =>
      prev.includes(id)
        ? prev.filter(chId => chId !== id)
        : [...prev, id]
    );
  };

  const addChildChapter = (parentId: string) => {
    const newChapter: Chapter = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Subchapter',
      startTime: 0,
      endTime: 0,
      type: 'manual',
      parentId
    };
    setChapters([...chapters, newChapter]);
  };

  const renderChapter = (chapter: Chapter, level = 0) => {
    const hasChildren = chapters.some(ch => ch.parentId === chapter.id);
    const isExpanded = expandedChapters.includes(chapter.id);

    return (
      <div key={chapter.id} className="space-y-2">
        <div
          className={`flex items-center justify-between p-2 bg-gray-50 rounded-lg
            ${selectedChapters.includes(chapter.id) ? 'ring-2 ring-blue-500' : ''}`}
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={() => toggleChapterExpansion(chapter.id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <BookOpen className="w-4 h-4 text-gray-600" />
            {editingChapter === chapter.id ? (
              <input
                type="text"
                value={chapter.title}
                onChange={(e) => setChapters(chapters.map(ch => 
                  ch.id === chapter.id ? { ...ch, title: e.target.value } : ch
                ))}
                onBlur={() => setEditingChapter(null)}
                className="px-2 py-1 text-sm border rounded"
                autoFocus
              />
            ) : (
              <span className="text-sm font-medium">{chapter.title}</span>
            )}
            {chapter.type === 'auto' && chapter.confidence && (
              <span className="text-xs text-gray-500">
                ({Math.round(chapter.confidence * 100)}% confidence)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {new Date(chapter.startTime * 1000).toISOString().substr(11, 8)}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => addChildChapter(chapter.id)}
                className="p-1 hover:bg-gray-200 rounded"
                title="Add Subchapter"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingChapter(chapter.id)}
                className="p-1 hover:bg-gray-200 rounded"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {/* Handle thumbnail upload */}}
                className="p-1 hover:bg-gray-200 rounded"
                title="Add Thumbnail"
              >
                <Image className="w-4 h-4" />
              </button>
              <button
                onClick={() => {/* Show chapter menu */}}
                className="p-1 hover:bg-gray-200 rounded"
                title="More Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Render child chapters */}
        {isExpanded && chapters
          .filter(ch => ch.parentId === chapter.id)
          .map(childChapter => renderChapter(childChapter, level + 1))
        }
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Chapters</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Toggle View"
          >
            {viewMode === 'list' ? (
              <LayoutGrid className="w-5 h-5" />
            ) : (
              <List className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={detectChapters}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg 
              hover:bg-purple-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Auto Detect</span>
              </>
            )}
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
                    addChapter();
                    setShowTemplates(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Add Single Chapter
                </button>
                <div className="h-px bg-gray-200 my-1" />
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => {
                      addChapter(template);
                      setShowTemplates(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {template.name} Template
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Export Chapters"
            >
              <Download className="w-5 h-5" />
            </button>
            <label className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Auto-detect Settings */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Detection Settings</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoDetectSettings.sceneDetection}
              onChange={(e) => setAutoDetectSettings(prev => ({
                ...prev,
                sceneDetection: e.target.checked
              }))}
              className="rounded border-gray-300 text-blue-600 mr-2"
            />
            <span className="text-sm">Scene Detection</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoDetectSettings.audioAnalysis}
              onChange={(e) => setAutoDetectSettings(prev => ({
                ...prev,
                audioAnalysis: e.target.checked
              }))}
              className="rounded border-gray-300 text-blue-600 mr-2"
            />
            <span className="text-sm">Audio Analysis</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoDetectSettings.contentAnalysis}
              onChange={(e) => setAutoDetectSettings(prev => ({
                ...prev,
                contentAnalysis: e.target.checked
              }))}
              className="rounded border-gray-300 text-blue-600 mr-2"
            />
            <span className="text-sm">Content Analysis</span>
          </label>
        </div>
      </div>

      {/* Chapters List/Grid */}
      <div className="space-y-2">
        {viewMode === 'list' ? (
          chapters
            .filter(chapter => !chapter.parentId)
            .map(chapter => renderChapter(chapter))
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="p-4 bg-gray-50 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{chapter.title}</h4>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingChapter(chapter.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(chapter.startTime * 1000).toISOString().substr(11, 8)}
                </div>
                {chapter.description && (
                  <p className="text-sm text-gray-600">{chapter.description}</p>
                )}
                {chapter.thumbnail && (
                  <img
                    src={chapter.thumbnail}
                    alt={chapter.title}
                    className="w-full h-24 object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {chapters.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No chapters yet. Click auto-detect or add manually.</p>
        </div>
      )}

      {/* Chapter Statistics */}
      {chapters.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Chapter Statistics</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total Chapters:</span>
              <span className="ml-2 font-medium">{chapters.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Auto-detected:</span>
              <span className="ml-2 font-medium">
                {chapters.filter(ch => ch.type === 'auto').length}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Manual:</span>
              <span className="ml-2 font-medium">
                {chapters.filter(ch => ch.type === 'manual').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};