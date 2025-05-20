import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, Plus, Trash2, FolderIcon, BookOpen, AlertCircle, Settings, Save, X } from "lucide-react";
import { ResourceCollection, KnowledgeProfile, ContextScope } from "@/types/knowledge-base";
import { format } from "date-fns";
import { useKnowledgeBase } from "@/hooks/knowledge-base/useKnowledgeBase";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";

interface ProfilesSectionProps {
    profiles: KnowledgeProfile[];
    collections: ResourceCollection[];
    contextScopes: ContextScope[];
    isLoading: boolean;
}

export function ProfilesSection({
    profiles,
    collections,
    contextScopes,
    isLoading,
}: ProfilesSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { handleCreateProfile, handleUpdateProfile, handleDeleteProfile } = useKnowledgeBase() as any; // Type assertion to resolve linter errors

    // Filter profiles based on search query
    const filteredProfiles = searchQuery
        ? profiles.filter((profile) =>
            profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : profiles;

    const selectedProfile = profiles.find(
        (profile) => profile.id === selectedProfileId
    );

    // Find collections in the selected profile
    const profileCollections = selectedProfileId && selectedProfile?.collectionIds
        ? collections.filter((collection) =>
            selectedProfile.collectionIds.includes(collection.id)
        )
        : [];

    // Find context scopes in the selected profile
    const profileScopes = selectedProfileId && selectedProfile?.contextScopeIds
        ? contextScopes.filter((scope) =>
            selectedProfile.contextScopeIds.includes(scope.id)
        )
        : [];

    const handleOpenDialogForEdit = () => {
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleOpenDialogForAdd = () => {
        setIsEditing(false);
        setSelectedProfileId(null);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsEditing(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this knowledge profile?")) {
            handleDeleteProfile(id);
            if (selectedProfileId === id) {
                setSelectedProfileId(null);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground font-medium">Loading profiles...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search profiles..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={handleOpenDialogForAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        {filteredProfiles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <p className="text-muted-foreground">No knowledge profiles found</p>
                                <p className="text-sm text-muted-foreground">
                                    Create your first profile to control what knowledge the AI can access
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredProfiles.map((profile) => (
                                    <Card
                                        key={profile.id}
                                        className={`cursor-pointer hover:border-primary/50 transition-colors ${selectedProfileId === profile.id ? "border-primary" : ""
                                            }`}
                                        onClick={() => setSelectedProfileId(profile.id)}
                                    >
                                        <CardHeader className="p-4 pb-2">
                                            <CardTitle className="text-base truncate flex items-center">
                                                <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                                {profile.name}
                                                {!profile.isActive && (
                                                    <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                                                        Inactive
                                                    </Badge>
                                                )}
                                                {profile.isDefault && (
                                                    <Badge className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                                                        Default
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="text-xs truncate">
                                                {profile.description || "No description"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 pb-2">
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {profile.collectionIds?.length || 0} collections
                                                </Badge>
                                                {profile.contextScopeIds && profile.contextScopeIds.length > 0 && (
                                                    <Badge variant="outline" className="text-xs bg-slate-50">
                                                        {profile.contextScopeIds.length} scopes
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(profile.updatedAt), "MMM d, yyyy")}
                                            </span>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="lg:col-span-2">
                    {selectedProfileId && selectedProfile ? (
                        <div className="space-y-4 border rounded-lg p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">{selectedProfile.name}</h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleOpenDialogForEdit}
                                    >
                                        <PenLine className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(selectedProfile.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                                    <p className="text-sm">
                                        {selectedProfile.description || "No description provided"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                                        <p className="text-sm">
                                            {format(new Date(selectedProfile.createdAt), "MMM d, yyyy HH:mm")}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Updated</h3>
                                        <p className="text-sm">
                                            {format(new Date(selectedProfile.updatedAt), "MMM d, yyyy HH:mm")}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                                        <div className="flex items-center">
                                            <div
                                                className={`h-2.5 w-2.5 rounded-full mr-2 ${selectedProfile.isActive ? "bg-green-500" : "bg-yellow-500"
                                                    }`}
                                            />
                                            <span className="text-sm">
                                                {selectedProfile.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Default</h3>
                                        <div className="flex items-center">
                                            <div
                                                className={`h-2.5 w-2.5 rounded-full mr-2 ${selectedProfile.isDefault ? "bg-blue-500" : "bg-gray-300"
                                                    }`}
                                            />
                                            <span className="text-sm">
                                                {selectedProfile.isDefault ? "Default Profile" : "Not Default"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Collections in this profile</h3>
                                    {profileCollections.length > 0 ? (
                                        <ScrollArea className="h-[200px] border rounded-md p-2">
                                            <div className="space-y-2">
                                                {profileCollections.map((collection) => (
                                                    <div
                                                        key={collection.id}
                                                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FolderIcon className="h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="text-sm font-medium">{collection.name}</p>
                                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                                    {collection.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant={collection.isActive ? "outline" : "secondary"}
                                                                className="text-xs"
                                                            >
                                                                {collection.isActive ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <div className="border rounded-md p-4 text-center">
                                            <p className="text-sm text-muted-foreground">No collections in this profile</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Add collections to define what knowledge this profile can access
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Context scopes</h3>
                                    {profileScopes.length > 0 ? (
                                        <ScrollArea className="h-[150px] border rounded-md p-2">
                                            <div className="space-y-2">
                                                {profileScopes.map((scope) => (
                                                    <div
                                                        key={scope.id}
                                                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Settings className="h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="text-sm font-medium">{scope.name}</p>
                                                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                                    {scope.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant={scope.isActive ? "outline" : "secondary"}
                                                                className="text-xs"
                                                            >
                                                                {scope.isActive ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <div className="border rounded-md p-4 text-center">
                                            <p className="text-sm text-muted-foreground">No context scopes in this profile</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Add context scopes to apply conditional knowledge access
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {!selectedProfile.isActive && (
                                    <Alert className="mt-4 bg-yellow-50 text-yellow-800 border-yellow-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Inactive Profile</AlertTitle>
                                        <AlertDescription>
                                            This knowledge profile is currently inactive. It won't be used for AI responses.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {selectedProfile.isDefault && (
                                    <Alert className="mt-4 bg-blue-50 text-blue-800 border-blue-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Default Profile</AlertTitle>
                                        <AlertDescription>
                                            This is the default knowledge profile that will be used when no specific profile is requested.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center border rounded-lg p-8">
                            <h3 className="text-lg font-medium mb-2">No profile selected</h3>
                            <p className="text-muted-foreground mb-4">
                                Select a knowledge profile from the list or create a new one
                            </p>
                            <Button onClick={handleOpenDialogForAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Profile
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <ProfileDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                isEditing={isEditing}
                profile={isEditing ? selectedProfile : undefined}
                collections={collections}
                contextScopes={contextScopes}
                onSave={(data) => {
                    if (isEditing && selectedProfile) {
                        handleUpdateProfile(selectedProfile.id, data);
                    } else {
                        handleCreateProfile(data);
                    }
                    handleCloseDialog();
                }}
            />
        </div>
    );
}