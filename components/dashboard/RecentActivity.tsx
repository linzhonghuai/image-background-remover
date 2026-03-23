'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Download, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/useLanguage';

interface Activity {
  id: string;
  type: 'background_removal';
  timestamp: Date;
  fileName: string;
  status: 'completed' | 'failed';
}

interface RecentActivityProps {
  full?: boolean;
}

export default function RecentActivity({ full = false }: RecentActivityProps) {
  const { t } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'background_removal',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        fileName: 'product-photo.jpg',
        status: 'completed',
      },
      {
        id: '2',
        type: 'background_removal',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        fileName: 'portrait.png',
        status: 'completed',
      },
      {
        id: '3',
        type: 'background_removal',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        fileName: 'team-photo.jpg',
        status: 'completed',
      },
    ];

    if (full) {
      setActivities([...mockActivities, ...mockActivities, ...mockActivities]); // More items for full view
    } else {
      setActivities(mockActivities);
    }
  }, [full]);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return t.dashboard.justNow;
    if (seconds < 3600) return t.dashboard.minutesAgo.replace('{n}', Math.floor(seconds / 60).toString());
    if (seconds < 86400) return t.dashboard.hoursAgo.replace('{n}', Math.floor(seconds / 3600).toString());
    return t.dashboard.daysAgo.replace('{n}', Math.floor(seconds / 86400).toString());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-bold text-gray-900 dark:text-white ${full ? 'text-xl' : 'text-lg'}`}>
          {t.dashboard.recentlyActivity}
        </h2>
        {full && (
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            {t.dashboard.viewAll}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {t.dashboard.noActivity}
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div className={`p-2 rounded-lg ${
                activity.status === 'completed'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {activity.status === 'completed' ? (
                  <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {activity.fileName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  activity.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}
              >
                {activity.status === 'completed' ? t.dashboard.completed : t.dashboard.failed}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
