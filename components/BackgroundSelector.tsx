'use client';

import React, { useState } from 'react';
import { Check, Palette, ImageIcon, Download, X } from 'lucide-react';

export type BackgroundType = 'transparent' | 'color' | 'gradient' | 'image';

interface BackgroundOption {
  type: BackgroundType;
  label: string;
  preview: string;
  value?: string;
}

interface BackgroundSelectorProps {
  onBackgroundChange: (type: BackgroundType, value?: string) => void;
  selectedType: BackgroundType;
  selectedValue?: string;
  disabled?: boolean;
}

const PRESET_COLORS = [
  { hex: '#ffffff', name: '白色' },
  { hex: '#f3f4f6', name: '浅灰' },
  { hex: '#1f2937', name: '深灰' },
  { hex: '#000000', name: '黑色' },
  { hex: '#ef4444', name: '红色' },
  { hex: '#f59e0b', name: '橙色' },
  { hex: '#10b981', name: '绿色' },
  { hex: '#3b82f6', name: '蓝色' },
  { hex: '#8b5cf6', name: '紫色' },
  { hex: '#ec4899', name: '粉色' },
];

const GRADIENTS = [
  { from: '#667eea', to: '#764ba2', name: '紫蓝渐变' },
  { from: '#f093fb', to: '#f5576c', name: '粉红渐变' },
  { from: '#4facfe', to: '#00f2fe', name: '青蓝渐变' },
  { from: '#43e97b', to: '#38f9d7', name: '绿色渐变' },
  { from: '#fa709a', to: '#fee140', name: '暖色渐变' },
  { from: '#a8edea', to: '#fed6e3', name: '柔和渐变' },
];

export default function BackgroundSelector({
  onBackgroundChange,
  selectedType,
  selectedValue,
  disabled = false,
}: BackgroundSelectorProps) {
  const [customColor, setCustomColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'preset' | 'gradient' | 'transparent'>('preset');

  const handleColorSelect = (hex: string) => {
    setCustomColor(hex);
    onBackgroundChange('color', hex);
  };

  return (
    <div className={`space-y-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          背景选项
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('preset')}
          className={`
            px-4 py-2 text-sm font-medium transition-colors relative
            ${
              activeTab === 'preset'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }
          `}
        >
          纯色
          {activeTab === 'preset' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('gradient')}
          className={`
            px-4 py-2 text-sm font-medium transition-colors relative
            ${
              activeTab === 'gradient'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }
          `}
        >
          渐变
          {activeTab === 'gradient' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('transparent');
            onBackgroundChange('transparent');
          }}
          className={`
            px-4 py-2 text-sm font-medium transition-colors relative
            ${
              selectedType === 'transparent'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }
          `}
        >
          透明
          {selectedType === 'transparent' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'preset' && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.hex}
                onClick={() => handleColorSelect(color.hex)}
                title={color.name}
                className={`
                  relative w-12 h-12 rounded-lg transition-all duration-200
                  hover:scale-110 hover:shadow-lg
                  ${
                    selectedType === 'color' && selectedValue === color.hex
                      ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 shadow-lg'
                      : 'ring-1 ring-gray-200 dark:ring-gray-700'
                  }
                `}
                style={{ backgroundColor: color.hex }}
              >
                {selectedType === 'color' && selectedValue === color.hex && (
                  <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Picker */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="custom-color"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              自定义颜色:
            </label>
            <input
              id="custom-color"
              type="color"
              value={customColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-2 border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm text-gray-500 dark:text-gray-500 font-mono">
              {customColor}
            </span>
          </div>
        </div>
      )}

      {activeTab === 'gradient' && (
        <div className="grid grid-cols-3 gap-2">
          {GRADIENTS.map((gradient, index) => (
            <button
              key={index}
              onClick={() => onBackgroundChange('gradient', `${gradient.from},${gradient.to}`)}
              className={`
                relative h-20 rounded-lg transition-all duration-200
                hover:scale-105 hover:shadow-lg
                ${
                  selectedType === 'gradient' && selectedValue === `${gradient.from},${gradient.to}`
                    ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-lg'
                    : 'ring-1 ring-gray-200 dark:ring-gray-700'
                }
              `}
              style={{
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
              }}
              title={gradient.name}
            >
              {selectedType === 'gradient' && selectedValue === `${gradient.from},${gradient.to}` && (
                <Check className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
