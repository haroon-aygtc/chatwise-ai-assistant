
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "./tabs/UsersList";
import RolesTab from "./tabs/RolesTab";
import ActivityLog from "./tabs/ActivityLog";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const initialRender = useRef(true);
  const tabChangeInProgress = useRef(false);

  // Handle tab changes with debounce to prevent double-switching
  const handleTabChange = (value: string) => {
    if (tabChangeInProgress.current) return;

    tabChangeInProgress.current = true;
    setActiveTab(value);

    // Reset the flag after a short delay
    setTimeout(() => {
      tabChangeInProgress.current = false;
    }, 300);
  };

  // Use effect to handle initial render
  useEffect(() => {
    // Skip the first render to prevent unwanted tab changes
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage your users, roles, and permissions
        </p>
      </div>

      <Tabs
        defaultValue="users"
        className="space-y-4"
        onValueChange={handleTabChange}
        value={activeTab}
      >
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <UsersList />
        </TabsContent>
        <TabsContent value="roles" className="space-y-4">
          <RolesTab key={`roles-tab-${activeTab === "roles" ? "active" : "inactive"}`} />
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
