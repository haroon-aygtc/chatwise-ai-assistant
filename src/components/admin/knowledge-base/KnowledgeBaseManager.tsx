
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeBaseHeader } from "./KnowledgeBaseHeader";
import { DocumentsSection } from "./DocumentsSection";
import { CategoryList } from "./CategoryList";
import { SettingsPanel } from "./SettingsPanel";
import { UploadDocumentDialog } from "./UploadDocumentDialog";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { DocumentCategory } from "@/types/knowledge-base";
import { DocumentCategory as AIDocumentCategory } from "@/types/ai-configuration";

export const KnowledgeBaseManager = () => {
  const {
    filteredDocuments,
    categories,
    searchQuery,
    setSearchQuery,
    selectedDocumentId,
    setSelectedDocumentId,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isLoadingDocuments,
    isLoadingCategories,
    isDocumentsError,
    addDocumentMutation,
    handleRefresh,
    handleUploadDocument,
    handleDeleteDocument
  } = useKnowledgeBase();

  return (
    <div className="space-y-6">
      <KnowledgeBaseHeader
        onRefresh={handleRefresh}
        onOpenUploadDialog={() => setIsUploadDialogOpen(true)}
        isLoading={isLoadingDocuments}
      />

      <Tabs defaultValue="documents">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 pt-4">
          <DocumentsSection
            documents={filteredDocuments}
            categories={categories as DocumentCategory[]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDocumentId={selectedDocumentId}
            onSelectDocument={setSelectedDocumentId}
            onDeleteDocument={handleDeleteDocument}
            isLoading={isLoadingDocuments}
            isError={isDocumentsError}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 pt-4">
          <CategoryList categories={categories} isLoading={isLoadingCategories} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <SettingsPanel />
        </TabsContent>
      </Tabs>

      <UploadDocumentDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen}
        onUpload={handleUploadDocument}
        categories={categories as DocumentCategory[]}
        isUploading={addDocumentMutation.isPending}
      />
    </div>
  );
};

export default KnowledgeBaseManager;
