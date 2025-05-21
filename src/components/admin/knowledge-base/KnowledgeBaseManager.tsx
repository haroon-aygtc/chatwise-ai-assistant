import { useState, useEffect } from "react";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, RefreshCw, PlusIcon } from "lucide-react";
import { KnowledgeResource, PaginatedResponse } from "@/types/knowledge-base";
import { DocumentsSection } from "./DocumentsSection";
import { ArticlesSection } from "./ArticlesSection";
import { FAQsSection } from "./FAQsSection";
import { FileUploadsSection } from "./FileUploadsSection";
import { CollectionsSection } from "./CollectionsSection";
import { ProfilesSection } from "./ProfilesSection";
import { DirectoriesSection } from "./DirectoriesSection";
import { ContextScopesSection } from "./ContextScopesSection";
import { SettingsPanel } from "./SettingsPanel";
import { KnowledgeBaseHeader } from "./KnowledgeBaseHeader";

export interface KnowledgeBaseManagerProps {
  standalone?: boolean;
}

export const KnowledgeBaseManager = ({
  standalone = false,
}: KnowledgeBaseManagerProps) => {
  const [activeTab, setActiveTab] = useState("documents");
  const {
    resources,
    isLoading,
    error,
    refreshResources,
    setSelectedResourceId,
  } = useKnowledgeBase();

  const handleRefresh = () => {
    refreshResources();
  };

  // Handle case when resources data is missing
  if (!resources || !(resources as PaginatedResponse<KnowledgeResource>).data) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4 max-w-md text-center">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <h3 className="text-lg font-semibold">
            Knowledge Base Data Not Found
          </h3>
          <p className="text-muted-foreground">
            No knowledge base resources were found. You can add new resources
            using the buttons below.
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setSelectedResourceId(null)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <KnowledgeBaseHeader standalone={standalone} />

      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="directories">Directories</TabsTrigger>
          <TabsTrigger value="contexts">Contexts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <DocumentsSection />
        </TabsContent>

        <TabsContent value="articles" className="mt-6">
          <ArticlesSection />
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <FAQsSection />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <FileUploadsSection />
        </TabsContent>

        <TabsContent value="collections" className="mt-6">
          <CollectionsSection />
        </TabsContent>

        <TabsContent value="profiles" className="mt-6">
          <ProfilesSection />
        </TabsContent>

        <TabsContent value="directories" className="mt-6">
          <DirectoriesSection />
        </TabsContent>

        <TabsContent value="contexts" className="mt-6">
          <ContextScopesSection />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBaseManager;
