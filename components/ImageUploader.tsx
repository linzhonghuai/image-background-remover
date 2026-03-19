'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export default function ImageUploader({ onImageSelect, isProcessing, disabled }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
    },
    maxFiles: 1,
    disabled: disabled || isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative group cursor-pointer transition-all duration-300
        ${disabled || isProcessing ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}
      `}
    >
      <input {...getInputProps()} />
      <div
        className={`
          border-3 border-dashed rounded-2xl p-12 text-center
          transition-all duration-300
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : isDragReject
              ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={`
              p-5 rounded-full transition-all duration-300
              ${
                isDragActive
                  ? 'bg-blue-500 scale-110'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110'
              }
            `}
          >
            {isDragActive ? (
              <Upload className="w-10 h-10 text-white" />
            ) : (
              <ImageIcon className="w-10 h-10 text-white" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {isDragActive ? '松开以上传图片' : isProcessing ? '处理中...' : '拖拽图片到这里'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              或点击选择文件
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400 dark:text-gray-500">
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-md">
              PNG
            </span>
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-md">
              JPG
            </span>
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-md">
              JPEG
            </span>
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-md">
              WebP
            </span>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            支持 5MB 以内的图片
          </p>
        </div>
      </div>
    </div>
  );
}
