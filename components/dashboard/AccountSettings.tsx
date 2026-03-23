'use client';

import React from 'react';
import { User, Mail, Bell, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/useLanguage';
import { useSession } from '@/lib/useSession';

interface AccountSettingsProps {
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {t.dashboard.profileInfo}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.dashboard.name}
            </label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.dashboard.email}
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {t.dashboard.notifications}
        </h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t.dashboard.emailNotifications}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.dashboard.emailNotificationsDesc}
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t.dashboard.usageAlerts}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.dashboard.usageAlertsDesc}
              </p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {t.dashboard.security}
        </h2>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {t.dashboard.changePassword}
              </span>
            </div>
          </button>

          <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {t.dashboard.manageData}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
          {t.dashboard.saveChanges}
        </button>
      </div>
    </div>
  );
}
