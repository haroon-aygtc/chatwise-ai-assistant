
import ApiService from '../api/api';

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    digest: 'daily' | 'weekly' | 'never';
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    contrast: 'normal' | 'high';
    reducedMotion: boolean;
  };
  chatPreferences: {
    autoSave: boolean;
    showTypingIndicator: boolean;
    soundEffects: boolean;
    showTimestamps: boolean;
  };
  display: {
    compactView: boolean;
    sidebarCollapsed: boolean;
    tableRows: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Get user settings
export const getUserSettings = async (): Promise<UserSettings> => {
  return ApiService.get<UserSettings>('/settings/user');
};

// Update user settings
export const updateUserSettings = async (data: Partial<UserSettings>): Promise<UserSettings> => {
  return ApiService.put<UserSettings>('/settings/user', data);
};

// Reset user settings to defaults
export const resetUserSettings = async (): Promise<UserSettings> => {
  return ApiService.post<UserSettings>('/settings/user/reset');
};

export interface AppSettings {
  id: string;
  appName: string;
  logo: string;
  favicon: string;
  defaultTheme: 'light' | 'dark' | 'system';
  availableLanguages: string[];
  defaultLanguage: string;
  supportEmail: string;
  termsUrl: string;
  privacyUrl: string;
  maxUploadSize: number;
  allowedFileTypes: string[];
  createdAt: string;
  updatedAt: string;
}

// Get app settings
export const getAppSettings = async (): Promise<AppSettings> => {
  return ApiService.get<AppSettings>('/settings/app');
};

// Update app settings (admin only)
export const updateAppSettings = async (data: Partial<AppSettings>): Promise<AppSettings> => {
  return ApiService.put<AppSettings>('/settings/app', data);
};
