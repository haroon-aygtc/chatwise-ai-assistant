import { useAuth } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PermissionAwareComponent from "@/components/PermissionAwareComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardContent() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Welcome to ChatSystem</h1>
                <p className="text-muted-foreground">
                    Hello, {user?.name || 'User'}! Here's a quick overview of your system.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Actions Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks you might want to perform</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/chat-sessions">View Chat Sessions</Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/settings">Update Settings</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* User Management Card */}
                <PermissionAwareComponent requiredPermission="manage users">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Users</CardTitle>
                            <CardDescription>Add, edit, and remove users from your organization</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/admin/users">User Management</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </PermissionAwareComponent>

                {/* Admin Access Card */}
                <PermissionAwareComponent requiredRole="admin">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Controls</CardTitle>
                            <CardDescription>Access administrative features and settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/admin/dashboard">Admin Dashboard</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </PermissionAwareComponent>

                {/* Stats Card - For all users */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Stats</CardTitle>
                        <CardDescription>Overview of system activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Active Sessions</span>
                                <span className="text-2xl font-bold">24</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Messages Today</span>
                                <span className="text-2xl font-bold">142</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Configuration Card */}
                <PermissionAwareComponent requiredPermission={["configure_ai", "manage_ai"]}>
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Configuration</CardTitle>
                            <CardDescription>Configure AI settings and behaviors</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/admin/ai-config">Configure AI</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </PermissionAwareComponent>

                {/* Knowledge Base Card */}
                <PermissionAwareComponent requiredPermission={["manage_knowledge"]}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Knowledge Base</CardTitle>
                            <CardDescription>Manage your system's knowledge resources</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/admin/knowledge-base">Manage Knowledge</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </PermissionAwareComponent>
            </div>
        </div>
    );
} 