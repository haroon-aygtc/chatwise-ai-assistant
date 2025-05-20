import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Mock data for demonstration
const mockChatSessions = [
    {
        id: "cs-001",
        user: "John Doe",
        startTime: "2023-10-15T14:30:00",
        lastActivity: "2023-10-15T15:45:00",
        status: "completed",
        messageCount: 24,
    },
    {
        id: "cs-002",
        user: "Jane Smith",
        startTime: "2023-10-16T09:15:00",
        lastActivity: "2023-10-16T09:30:00",
        status: "active",
        messageCount: 8,
    },
    {
        id: "cs-003",
        user: "Bob Johnson",
        startTime: "2023-10-16T11:20:00",
        lastActivity: "2023-10-16T11:45:00",
        status: "active",
        messageCount: 15,
    },
    {
        id: "cs-004",
        user: "Alice Williams",
        startTime: "2023-10-14T16:00:00",
        lastActivity: "2023-10-14T16:30:00",
        status: "completed",
        messageCount: 12,
    },
    {
        id: "cs-005",
        user: "Charlie Brown",
        startTime: "2023-10-15T10:00:00",
        lastActivity: "2023-10-15T10:20:00",
        status: "completed",
        messageCount: 7,
    },
];

export default function ChatSessionsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter sessions based on search query
    const filteredSessions = mockChatSessions.filter(session =>
        session.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Chat Sessions</h1>
                <p className="text-muted-foreground">
                    View and manage all chat sessions in the system
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Sessions</CardTitle>
                    <CardDescription>
                        Browse through all chat sessions or search for specific ones
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Input
                            placeholder="Search by user or session ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-md"
                        />
                    </div>

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Session ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>Last Activity</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Messages</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell className="font-medium">{session.id}</TableCell>
                                        <TableCell>{session.user}</TableCell>
                                        <TableCell>{formatDate(session.startTime)}</TableCell>
                                        <TableCell>{formatDate(session.lastActivity)}</TableCell>
                                        <TableCell>
                                            <Badge variant={session.status === "active" ? "default" : "secondary"}>
                                                {session.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{session.messageCount}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {filteredSessions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-4">
                                            No sessions found matching your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Export Data</Button>
                    <Button variant="default">New Chat Session</Button>
                </CardFooter>
            </Card>
        </div>
    );
} 