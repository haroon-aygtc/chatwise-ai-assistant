
import React, { useEffect, useState } from 'react';
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
import { useAuth } from '@/modules/auth/hooks/useAuth';
import tokenService from '@/modules/auth/services/tokenService';

// How many seconds before expiration to show the warning
const WARNING_THRESHOLD = 5 * 60; // 5 minutes

const SessionExpirationModal = () => {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const { refreshAuth, logout } = useAuth();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkTokenExpiration = () => {
      // Get token and check if it exists
      const token = tokenService.getToken();
      if (!token) return;

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
  }, [logout, open]);

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
