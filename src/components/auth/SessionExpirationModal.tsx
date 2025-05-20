import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/auth/useAuth";
import { tokenService } from "@/services/auth";

// Debug flag
const DEBUG = process.env.NODE_ENV === 'development';

// How many seconds before expiration to show the warning
const WARNING_THRESHOLD = 5 * 60; // 5 minutes

const SessionExpirationModal = () => {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Add error handling for useAuth hook
  let auth;
  try {
    if (DEBUG) console.log("SessionExpirationModal: Attempting to use useAuth hook");
    auth = useAuth();
    if (DEBUG) console.log("SessionExpirationModal: Successfully accessed useAuth");
  } catch (error) {
    console.error("SessionExpirationModal: Failed to access useAuth", error);
    // Create dummy functions
    auth = {
      refreshAuth: async () => {
        console.error("SessionExpirationModal: Mock refreshAuth called");
      },
      logout: async () => {
        console.error("SessionExpirationModal: Mock logout called");
      }
    };
  }

  const { refreshAuth, logout } = auth;

  useEffect(() => {
    // Skip token checks if auth isn't properly initialized
    if (!auth || !refreshAuth || !logout) {
      if (DEBUG) console.log("SessionExpirationModal: Skipping token check - auth not initialized");
      return;
    }

    let intervalId: NodeJS.Timeout;

    const checkTokenExpiration = () => {
      // Get token and check if it exists
      const token = tokenService.getToken();
      if (!token) return;

      // Skip non-JWT tokens (they could be Laravel Sanctum tokens)
      if (!token.includes('.')) {
        if (DEBUG) console.log("SessionExpirationModal: Non-JWT token detected, skipping expiration check");
        return;
      }

      try {
        // Decode the token to get expiration
        const decoded = tokenService.decodeToken(token);
        if (!decoded || !decoded.exp) return;

        // Calculate time until expiration in seconds
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - currentTime;

        // If within warning threshold, show dialog
        if (timeUntilExpiry > 0 && timeUntilExpiry <= WARNING_THRESHOLD) {
          setSecondsLeft(timeUntilExpiry);
          setOpen(true);
        } else if (timeUntilExpiry <= 0) {
          // Token already expired
          logout();
        }
      } catch (error) {
        if (DEBUG) console.log("SessionExpirationModal: Error checking token expiration", error);
        // Don't do anything on error - the token may be valid but not JWT format
      }
    };

    // Initial check
    checkTokenExpiration();

    // Set up interval to check token expiration
    intervalId = setInterval(() => {
      checkTokenExpiration();

      // Update countdown if modal is open
      if (open) {
        setSecondsLeft(prev => Math.max(0, prev - 10));
      }
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [logout, refreshAuth, open, auth]);

  const handleExtend = async () => {
    // Refresh authentication
    await refreshAuth();
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  // Format seconds into mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Your session is about to expire</AlertDialogTitle>
          <AlertDialogDescription>
            For security reasons, your session will expire in {formatTime(secondsLeft)}.
            Do you want to extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>Logout</AlertDialogCancel>
          <AlertDialogAction onClick={handleExtend}>Stay logged in</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionExpirationModal;
