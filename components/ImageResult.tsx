'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { BackgroundType } from './BackgroundSelector';

interface ImageResultProps {
  processedBlob: Blob;
  originalFile: File;
  onReset: () => void;
  backgroundType: BackgroundType;
  backgroundValue?: string;
}

export default function ImageResult({
  processedBlob,
  originalFile,
  onReset,
  backgroundType,
  backgroundValue,
}: ImageResultProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isComposing, setIsComposing] = useState(false);
  const [compositeUrl, setCompositeUrl] = useState<string | null>(null);

  // Create composite image when background changes
  useEffect(() => {
    const createComposite = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background based on type
        if (backgroundType === 'color' && backgroundValue) {
          ctx.fillStyle = backgroundValue;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (backgroundType === 'gradient' && backgroundValue) {
          const [from, to] = backgroundValue.split(',');
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, from);
          gradient.addColorStop(1, to);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw the processed image (with transparency)
        ctx.drawImage(img, 0, 0);

        // Convert to URL
        const url = canvas.toDataURL('image/png');
        setCompositeUrl(url);
      };
      img.src = URL.createObjectURL(processedBlob);
    };

    createComposite();
  }, [processedBlob, backgroundType, backgroundValue]);

  const handleDownload = useCallback((format: 'png' | 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dataUrl: string;
    let filename: string;

    if (format === 'jpg' && backgroundType !== 'transparent') {
      // For JPG, use the composite
      dataUrl = compositeUrl || canvas.toDataURL('image/jpeg', 0.95);
      filename = `removed-background-${originalFile.name.replace(/\.[^.]+$/, '')}.jpg`;
    } else {
      // For PNG or transparent, use the original processed blob
      dataUrl = URL.createObjectURL(processedBlob);
      filename = `removed-background-${originalFile.name.replace(/\.[^.]+$/, '')}.png`;
    }

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();

    if (format === 'png' && backgroundType === 'transparent') {
      URL.revokeObjectURL(dataUrl);
    }
  }, [compositeUrl, processedBlob, originalFile, backgroundType]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <div className="space-y-6">
      {/* Image Preview */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Toolbar */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="缩小"
          >
            <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="放大"
          >
            <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Canvas (hidden, used for compositing) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Image Display */}
        <div className="relative w-full aspect-square flex items-center justify-center p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
          {/* Checkerboard pattern for transparency */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />

          {/* Image */}
          <img
            src={compositeUrl || URL.createObjectURL(processedBlob)}
            alt="Processed"
            className="relative max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => handleDownload('png')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <Download className="w-5 h-5" />
          下载 PNG（透明）
        </button>

        {backgroundType !== 'transparent' && (
          <button
            onClick={() => handleDownload('jpg')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 dark:bg-gray-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            下载 JPG（带背景）
          </button>
        )}

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5" />
          重新开始
        </button>
      </div>
    </div>
  );
}
