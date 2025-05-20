
import React, { useEffect, useRef } from "react";
import RolesPermissions from "../tabs/RolesPermissions";

interface RolesTabProps {
  // No props needed, but we'll use the key from the parent component
}

const RolesTab: React.FC<RolesTabProps> = () => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Mark as initialized on mount
    isInitialized.current = true;

    // Cleanup function
    return () => {
      // This will run when the component unmounts
      // We keep isInitialized.current = true so that when it remounts,
      // it knows it was previously initialized
    };
  }, []);

  return <RolesPermissions key="roles-permissions-component" />;
};

export default RolesTab;
