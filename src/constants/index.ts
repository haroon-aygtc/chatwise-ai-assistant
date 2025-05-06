/**
 * Application Constants
 */

// User Management
export const SEARCH_DEBOUNCE_TIME = 300; // milliseconds

export const USER_STATUSES_ARRAY = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// API
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY = 1000; // 1 second