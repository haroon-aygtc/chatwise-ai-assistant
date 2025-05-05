
import { useState, useEffect } from "react";
import { PermissionCategory } from "@/types/ai-configuration";
import { PermissionGroup } from "./PermissionGroup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

interface PermissionManagementProps {
  permissionCategories: PermissionCategory[];
  selectedPermissions: string[];
  onChange: (selectedPermissions: string[]) => void;
  tabs?: boolean;
}

export function PermissionManagement({
  permissionCategories,
  selectedPermissions,
  onChange,
  tabs = true,
}: PermissionManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<PermissionCategory[]>(permissionCategories);
  const [activeTab, setActiveTab] = useState("all");

  // Filter permissions based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(permissionCategories);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = permissionCategories.map((category) => {
      const matchingPermissions = category.permissions.filter(
        (permission) =>
          permission.displayName.toLowerCase().includes(lowercaseQuery) ||
          permission.description?.toLowerCase().includes(lowercaseQuery) ||
          permission.name.toLowerCase().includes(lowercaseQuery)
      );

      return {
        ...category,
        permissions: matchingPermissions,
      };
    }).filter((category) => category.permissions.length > 0);

    setFilteredCategories(filtered);
  }, [searchQuery, permissionCategories]);

  // Filter categories by active tab
  useEffect(() => {
    if (activeTab === "all") {
      if (searchQuery.trim() === "") {
        setFilteredCategories(permissionCategories);
      }
      return;
    }

    const categoryId = activeTab;
    const filtered = permissionCategories.filter(
      (category) => category.id === categoryId
    );

    setFilteredCategories(filtered);
  }, [activeTab, permissionCategories, searchQuery]);

  // Toggle all permissions
  const toggleAllPermissions = () => {
    // If all permissions are already selected, deselect all
    const allPermissions = permissionCategories.flatMap(
      (category) => category.permissions.map((permission) => permission.name)
    );

    const allSelected = allPermissions.every((permission) =>
      selectedPermissions.includes(permission)
    );

    if (allSelected) {
      onChange([]);
    } else {
      onChange(allPermissions);
    }
  };

  // Check if all permissions are selected for indeterminate state
  const allPermissionsCount = permissionCategories.flatMap(
    (category) => category.permissions
  ).length;
  const allSelected = selectedPermissions.length === allPermissionsCount;
  const someSelected =
    selectedPermissions.length > 0 &&
    selectedPermissions.length < allPermissionsCount;

  return (
    <div className="space-y-4">
      {/* Search and select all */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search permissions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <CustomCheckbox
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={toggleAllPermissions}
          />
          <span className="text-sm">Select All</span>
        </div>
      </div>

      {/* Tabs or simple list */}
      {tabs ? (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex overflow-auto">
            <TabsTrigger value="all" className="flex-shrink-0">
              All Permissions
            </TabsTrigger>
            {permissionCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-shrink-0"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {filteredCategories.map((category) => (
              <PermissionGroup
                key={category.id}
                category={category}
                selectedPermissions={selectedPermissions}
                onChange={onChange}
              />
            ))}
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-6">
            {filteredCategories.map((category, index) => (
              <React.Fragment key={category.id}>
                <PermissionGroup
                  category={category}
                  selectedPermissions={selectedPermissions}
                  onChange={onChange}
                />
                {index < filteredCategories.length - 1 && (
                  <Separator className="my-4" />
                )}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
