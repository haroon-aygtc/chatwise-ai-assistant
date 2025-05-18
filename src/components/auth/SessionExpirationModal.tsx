import React from "react";

// Disabled SessionExpirationModal since we're using Laravel Sanctum's session-based authentication
// This component is kept as a placeholder in case token-based expiration is needed in the future
const SessionExpirationModal = () => {
  // No-op component since we're using cookie-based sessions with Sanctum
  return null;
};

export default SessionExpirationModal;
