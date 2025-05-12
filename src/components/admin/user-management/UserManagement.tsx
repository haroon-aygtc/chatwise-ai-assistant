
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "./tabs/UsersList";
import RolesTab from "./tabs/RolesTab";
import ActivityLog from "./tabs/ActivityLog";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage your users, roles, and permissions
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <UsersList />
        </TabsContent>
        <TabsContent value="roles" className="space-y-4">
          <RolesTab />
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
