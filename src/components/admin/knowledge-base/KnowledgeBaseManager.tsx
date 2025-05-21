import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KnowledgeBaseHeader } from "./KnowledgeBaseHeader";
import { DocumentsSection } from "./DocumentsSection";
import { CategoryList } from "./CategoryList";
import { SettingsPanel } from "./SettingsPanel";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import {
  DocumentCategory,
  ResourceType,
  KnowledgeResource,
} from "@/types/knowledge-base";
import { PaginatedResponse } from "@/services/api/types";
import { DocumentCategory as AIDocumentCategory } from "@/types/ai-configuration";
import { CollectionsSection } from "./CollectionsSection";
import { ProfilesSection } from "./ProfilesSection";
import { DirectoriesSection } from "./DirectoriesSection";
import { ArticlesSection } from "./ArticlesSection";
import { FAQsSection } from "./FAQsSection";
import { FileUploadsSection } from "./FileUploadsSection";
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResourceDialog } from "./dialogs/ResourceDialog";
import { ContextScopesSection } from "./ContextScopesSection";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

// Type that represents the possible tabs
type TabValue =
  | "articles"
  | "directories"
  | "faqs"
  | "files"
  | "collections"
  | "profiles"
  | "scopes";

export function KnowledgeBaseManager() {
  const [activeTab, setActiveTab] = useState<TabValue>("articles");
  const { toast } = useToast();

  // Get data from the hook with proper typing - only extract what we need
  const {
    resources,
    collections,
    profiles,
    contextScopes,
    isLoadingResources,
    isLoadingCollections,
    isLoadingProfiles,
    isLoadingContextScopes,
    searchQuery,
    setSearchQuery,
    handleRefresh,
    resourcesQueryParams,
    handlePageChange,
    selectedResourceId,
    setSelectedResourceId,
    handleAddResource,
    handleUpdateResource,
    handleDeleteResource,
  } = useKnowledgeBase();

  // Filter resources by type with proper typing and safety checks
  const resourcesData =
    resources &&
    (resources as PaginatedResponse<KnowledgeResource>)?.data &&
    Array.isArray((resources as PaginatedResponse<KnowledgeResource>)?.data)
      ? (resources as PaginatedResponse<KnowledgeResource>).data
      : [];

  // Apply additional type safety to each filter operation
  const articles = resourcesData.filter(
    (r: KnowledgeResource) => r && r.resourceType === "ARTICLE",
  );

  const directories = resourcesData.filter(
    (r: KnowledgeResource) => r && r.resourceType === "DIRECTORY",
  );

  const faqs = resourcesData.filter(
    (r: KnowledgeResource) => r && r.resourceType === "FAQ",
  );

  const files = resourcesData.filter(
    (r: KnowledgeResource) => r && r.resourceType === "FILE_UPLOAD",
  );

  const isLoading =
    isLoadingResources ||
    isLoadingCollections ||
    isLoadingProfiles ||
    isLoadingContextScopes;

  // Initial data fetching with error handling
  useEffect(() => {
    // Call handleRefresh directly since it's not an async function
    if (handleRefresh) {
      try {
        handleRefresh();
      } catch (error) {
        console.error("Error fetching knowledge base data:", error);
        toast({
          title: "Error",
          description: "Failed to load knowledge base data. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [handleRefresh, toast]);

  // Handle errors for missing API endpoints
  useEffect(() => {
    if (isLoadingProfiles || isLoadingContextScopes) return;

    // Check if we have errors but the API returned empty arrays
    if (
      isLoadingProfiles === false &&
      isLoadingContextScopes === false &&
      ((Array.isArray(profiles) && profiles.length === 0) ||
        (Array.isArray(contextScopes) && contextScopes.length === 0))
    ) {
      console.log(
        "Knowledge base API endpoints may be missing or returning errors",
      );
      // Don't show error toast to avoid overwhelming the user
    }
  }, [isLoadingProfiles, isLoadingContextScopes, profiles, contextScopes]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Loading knowledge base data...
          </p>
        </div>
      </div>
    );
  }

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Knowledge Base Management
        </h2>
        <p className="text-muted-foreground">
          Manage all the knowledge resources that the AI assistant can access
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
      >
        <TabsList className="grid grid-cols-7 w-full max-w-4xl">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="directories">Directories</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="scopes">Context Scopes</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="articles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Articles</CardTitle>
                <CardDescription>
                  Manage articles, blog posts, and other knowledge content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArticlesSection
                  resources={articles || []}
                  isLoading={isLoadingResources}
                  searchQuery={searchQuery || ""}
                  onSearchChange={setSearchQuery || (() => {})}
                  selectedResourceId={selectedResourceId}
                  onSelectResource={setSelectedResourceId}
                  onDeleteResource={handleDeleteResource}
                  isError={false}
                  currentPage={resourcesQueryParams.page || 1}
                  onPageChange={handlePageChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Directories</CardTitle>
                <CardDescription>
                  Manage context directories and filesystem sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DirectoriesSection
                  resources={directories || []}
                  isLoading={isLoadingResources}
                  searchQuery={searchQuery || ""}
                  onSearchChange={setSearchQuery || (() => {})}
                  selectedResourceId={selectedResourceId}
                  onSelectResource={setSelectedResourceId}
                  onDeleteResource={handleDeleteResource}
                  isError={false}
                  currentPage={resourcesQueryParams.page || 1}
                  onPageChange={handlePageChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faqs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>FAQs</CardTitle>
                <CardDescription>
                  Manage frequently asked questions and their answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FAQsSection
                  resources={faqs || []}
                  isLoading={isLoadingResources}
                  searchQuery={searchQuery || ""}
                  onSearchChange={setSearchQuery || (() => {})}
                  selectedResourceId={null}
                  onSelectResource={() => {}}
                  onDeleteResource={() => {}}
                  isError={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  Manage file uploads and document libraries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploadsSection
                  resources={files || []}
                  isLoading={isLoadingResources}
                  searchQuery={searchQuery || ""}
                  onSearchChange={setSearchQuery || (() => {})}
                  selectedResourceId={null}
                  onSelectResource={() => {}}
                  onDeleteResource={() => {}}
                  isError={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Collections</CardTitle>
                <CardDescription>
                  Organize resources into collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CollectionsSection
                  collections={Array.isArray(collections) ? collections : []}
                  resources={[...articles, ...directories, ...faqs, ...files]}
                  isLoading={isLoadingCollections}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profiles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Profiles</CardTitle>
                <CardDescription>
                  Configure which collections are available to the AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfilesSection
                  profiles={Array.isArray(profiles) ? profiles : []}
                  collections={Array.isArray(collections) ? collections : []}
                  contextScopes={
                    Array.isArray(contextScopes) ? contextScopes : []
                  }
                  isLoading={isLoadingProfiles}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scopes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Context Scopes</CardTitle>
                <CardDescription>
                  Define context-based rules for knowledge access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContextScopesSection
                  contextScopes={
                    Array.isArray(contextScopes) ? contextScopes : []
                  }
                  isLoading={isLoadingContextScopes}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default KnowledgeBaseManager;
