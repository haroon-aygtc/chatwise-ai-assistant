import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, UsersIcon, Settings, Database, Bot, PanelTop } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/auth/useAuth";

export default function AdminDashboardContent() {
    const { refreshAuth, hasRole } = useAuth();
    const navigate = useNavigate();

    // Check if user has admin role
    useEffect(() => {
        if (!hasRole("admin")) {
            navigate("/unauthorized");
        }
    }, [hasRole, navigate]);
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage all aspects of your ChatSystem platform
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Management Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UsersIcon className="h-5 w-5" />
                            <span>User Management</span>
                        </CardTitle>
                        <CardDescription>Manage users, roles, and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin/users">Manage Users</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Analytics Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart className="h-5 w-5" />
                            <span>Analytics</span>
                        </CardTitle>
                        <CardDescription>View system analytics and performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin/analytics">View Analytics</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* AI Configuration Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <span>AI Configuration</span>
                        </CardTitle>
                        <CardDescription>Configure AI settings, models, and behavior</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin/ai-config">Configure AI</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Knowledge Base Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            <span>Knowledge Base</span>
                        </CardTitle>
                        <CardDescription>Manage your system's knowledge resources</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin/knowledge-base">Manage Knowledge</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Widget Builder Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PanelTop className="h-5 w-5" />
                            <span>Widget Builder</span>
                        </CardTitle>
                        <CardDescription>Create and customize chat widgets for your site</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin/widget-builder">Build Widgets</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Settings Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </CardTitle>
                        <CardDescription>Manage system configurations and settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin/settings">System Settings</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* System Stats Section */}
            <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-background rounded p-4 border">
                        <div className="text-sm font-medium text-muted-foreground">Total Users</div>
                        <div className="text-2xl font-bold mt-1">1,254</div>
                    </div>
                    <div className="bg-background rounded p-4 border">
                        <div className="text-sm font-medium text-muted-foreground">Active Sessions</div>
                        <div className="text-2xl font-bold mt-1">87</div>
                    </div>
                    <div className="bg-background rounded p-4 border">
                        <div className="text-sm font-medium text-muted-foreground">Messages Today</div>
                        <div className="text-2xl font-bold mt-1">4,232</div>
                    </div>
                    <div className="bg-background rounded p-4 border">
                        <div className="text-sm font-medium text-muted-foreground">Knowledge Items</div>
                        <div className="text-2xl font-bold mt-1">342</div>
                    </div>
                </div>
            </div>
        </div>
    );
}