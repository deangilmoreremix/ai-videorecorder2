import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Download, Loader } from 'lucide-react';

interface ExportOptions {
  width: number;
  height: number;
  fps: number;
  quality: number;
}

export const VideoExport: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<ExportOptions>({
    width: 1920,
    height: 1080,
    fps: 30,
    quality: 1,
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const ffmpeg = createFFmpeg({ 
        log: true,
        progress: ({ ratio }) => setProgress(ratio * 100)
      });
      
      await ffmpeg.load();

      // Example export command - this would be customized based on your needs
      await ffmpeg.run(
        '-i', 'input.mp4',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        'output.mp4'
      );

      const data = ffmpeg.FS('readFile', 'output.mp4');
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      );

      const a = document.createElement('a');
      a.href = url;
      a.download = 'exported-video.mp4';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Export Video</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Resolution</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={`${options.width}x${options.height}`}
            onChange={(e) => {
              const [width, height] = e.target.value.split('x').map(Number);
              setOptions({ ...options, width, height });
            }}
          >
            <option value="1920x1080">1080p (1920x1080)</option>
            <option value="1280x720">720p (1280x720)</option>
            <option value="854x480">480p (854x480)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">FPS</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={options.fps}
            onChange={(e) => setOptions({ ...options, fps: Number(e.target.value) })}
          >
            <option value="24">24 FPS</option>
            <option value="30">30 FPS</option>
            <option value="60">60 FPS</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {exporting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Exporting... {Math.round(progress)}%</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export Video</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};