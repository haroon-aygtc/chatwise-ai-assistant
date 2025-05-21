/**
 * API Config
 *
 * Re-export from core API for backward compatibility
 */

import { getConfig } from "@/core/api";
import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  PERMISSION_ENDPOINTS,
  AI_ENDPOINTS,
  KB_ENDPOINTS,
  WIDGET_ENDPOINTS,
} from "@/core/api";

// For backward compatibility
const API_CONFIG = getConfig();

export default API_CONFIG;

export {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  PERMISSION_ENDPOINTS,
  AI_ENDPOINTS,
  KB_ENDPOINTS,
  WIDGET_ENDPOINTS,
};
