/**
 * Helper utility functions for the application
 */

import { toast } from "sonner";
import { AxiosError } from 'axios';

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Format currency with $ sign and 2 decimal places
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Convert camelCase to Title Case
 */
export const camelCaseToTitleCase = (text: string): string => {
  if (!text) return '';
  
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Delay execution (sleep)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Display error toast based on error object
 */
export const handleApiError = (error: unknown): void => {
  console.error("API Error:", error);
  
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
    toast.error(errorMessage);
    return;
  }
  
  // For other types of errors
  const errorObj = error as Error;
  toast.error(errorObj.message || "An unknown error occurred");
};

/**
 * Generate random string ID
 */
export const generateId = (length = 8): string => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Get cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}
