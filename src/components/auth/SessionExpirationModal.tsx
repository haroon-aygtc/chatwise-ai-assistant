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

// Debug flag
const DEBUG = process.env.NODE_ENV === "development";

const SessionExpirationModal = () => {
  const [open, setOpen] = useState(false);

  // Add error handling for useAuth hook
  let auth;
  try {
    if (DEBUG)
      console.log("SessionExpirationModal: Attempting to use useAuth hook");
    auth = useAuth();
    if (DEBUG)
      console.log("SessionExpirationModal: Successfully accessed useAuth");
  } catch (error) {
    console.error("SessionExpirationModal: Failed to access useAuth", error);
    // Create dummy functions
    auth = {
      refreshAuth: async () => {
        console.error("SessionExpirationModal: Mock refreshAuth called");
      },
      logout: async () => {
        console.error("SessionExpirationModal: Mock logout called");
      },
    };
  }

  const { refreshAuth, logout } = auth;

  const handleExtend = async () => {
    // Ping the server to extend the session
    try {
      // Just make a simple request to the server to extend the session
      // With Sanctum, this will automatically refresh the session
      await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
    } catch (error) {
      console.error("Failed to extend session:", error);
    }
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Your session is about to expire</AlertDialogTitle>
          <AlertDialogDescription>
            For security reasons, your session will expire soon. Do you want to
            extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>Logout</AlertDialogCancel>
          <AlertDialogAction onClick={handleExtend}>
            Stay logged in
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionExpirationModal;
