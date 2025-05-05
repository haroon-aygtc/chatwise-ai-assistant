import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  ArrowUpRight,
  Users,
  MessageSquare,
  Bot,
  Clock,
  BarChart3,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Dashboard = () => {
  // Sample data for charts
  const conversationData = [
    { name: "Mon", conversations: 120, responses: 150 },
    { name: "Tue", conversations: 180, responses: 220 },
    { name: "Wed", conversations: 150, responses: 190 },
    { name: "Thu", conversations: 210, responses: 240 },
    { name: "Fri", conversations: 250, responses: 280 },
    { name: "Sat", conversations: 190, responses: 210 },
    { name: "Sun", conversations: 140, responses: 160 },
  ];

  const userEngagementData = [
    { name: "Week 1", active: 400, new: 240 },
    { name: "Week 2", active: 450, new: 210 },
    { name: "Week 3", active: 520, new: 280 },
    { name: "Week 4", active: 580, new: 250 },
  ];

  const responseTypeData = [
    { name: "Informational", value: 45 },
    { name: "Technical", value: 25 },
    { name: "Support", value: 20 },
    { name: "Sales", value: 10 },
  ];

  const COLORS = ["#0088FE", "#E6A817", "#FFBB28", "#FF8042"];

  const [dateRange, setDateRange] = useState("7d");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your chat system</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md p-1 mr-2">
            <Button
              variant={dateRange === "7d" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDateRange("7d")}
              className="text-xs h-7"
            >
              7D
            </Button>
            <Button
              variant={dateRange === "30d" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDateRange("30d")}
              className="text-xs h-7"
            >
              30D
            </Button>
            <Button
              variant={dateRange === "90d" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDateRange("90d")}
              className="text-xs h-7"
            >
              90D
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="border-b">
          <TabsList className="bg-transparent h-10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-background"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-background"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-background"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="pt-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span style={{ color: "#E6A817" }} className="flex items-center mr-1">
                    +12% <ArrowUpRight className="h-3 w-3" />
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversations
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5,678</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span style={{ color: "#E6A817" }} className="flex items-center mr-1">
                    +23% <ArrowUpRight className="h-3 w-3" />
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  AI Responses
                </CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,567</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span style={{ color: "#E6A817" }} className="flex items-center mr-1">
                    +18% <ArrowUpRight className="h-3 w-3" />
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Response Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span style={{ color: "#E6A817" }} className="flex items-center mr-1">
                    -0.3s <ArrowUpRight className="h-3 w-3" />
                  </span>
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Analytics</CardTitle>
                <CardDescription>
                  Daily conversation volume over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversationData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    className="animate-fade-in"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="conversations"
                      name="Conversations"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="responses"
                      name="AI Responses"
                      fill="hsl(var(--primary) / 0.5)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>
                  User activity and retention metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userEngagementData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    className="animate-fade-in"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="active"
                      name="Active Users"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                      activeDot={{ r: 6 }}
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="new"
                      name="New Users"
                      stroke="#E6A817"
                      fill="rgba(230, 168, 23, 0.2)"
                      activeDot={{ r: 6 }}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest conversations and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          New conversation started
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {i} minute{i !== 1 ? "s" : ""} ago
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        User ID: user_{1000 + i}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of AI responses by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart className="animate-fade-in">
                    <Pie
                      data={responseTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      animationDuration={1500}
                    >
                      {responseTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>
                  Average AI response time over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { date: "Jan", time: 1.8 },
                      { date: "Feb", time: 1.6 },
                      { date: "Mar", time: 1.4 },
                      { date: "Apr", time: 1.3 },
                      { date: "May", time: 1.2 },
                      { date: "Jun", time: 1.1 },
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    className="animate-fade-in"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value}s`, "Response Time"]}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Satisfaction Metrics</CardTitle>
              <CardDescription>
                Feedback ratings and satisfaction scores
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { category: "Very Satisfied", value: 45 },
                    { category: "Satisfied", value: 30 },
                    { category: "Neutral", value: 15 },
                    { category: "Dissatisfied", value: 7 },
                    { category: "Very Dissatisfied", value: 3 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  className="animate-fade-in"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Weekly Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Generated</div>
                <p className="text-xs text-muted-foreground">
                  Last updated: Today at 9:30 AM
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Generated</div>
                <p className="text-xs text-muted-foreground">
                  Last updated: Yesterday at 11:15 PM
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Custom Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Create New</div>
                <p className="text-xs text-muted-foreground">
                  Select parameters and generate
                </p>
                <div className="mt-4">
                  <Button size="sm" className="w-full">
                    <Calendar className="mr-2 h-4 w-4" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>
                Access and download system reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "User Activity Summary",
                    date: "June 15, 2023",
                    type: "PDF",
                  },
                  {
                    name: "Conversation Analytics",
                    date: "June 10, 2023",
                    type: "CSV",
                  },
                  {
                    name: "AI Performance Metrics",
                    date: "June 5, 2023",
                    type: "PDF",
                  },
                  {
                    name: "Knowledge Base Usage",
                    date: "May 28, 2023",
                    type: "Excel",
                  },
                  {
                    name: "System Health Report",
                    date: "May 20, 2023",
                    type: "PDF",
                  },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Generated: {report.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>
                Recent alerts and system messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "System Update",
                    message: "New AI model version available for deployment",
                    time: "10 minutes ago",
                    type: "info",
                  },
                  {
                    title: "Performance Alert",
                    message: "Response time increased by 15% in the last hour",
                    time: "1 hour ago",
                    type: "warning",
                  },
                  {
                    title: "User Milestone",
                    message: "Reached 1,000 active users today!",
                    time: "3 hours ago",
                    type: "success",
                  },
                  {
                    title: "API Error",
                    message: "Temporary disruption in external API service",
                    time: "5 hours ago",
                    type: "error",
                  },
                  {
                    title: "Knowledge Base Update",
                    message: "15 new documents added to the knowledge base",
                    time: "Yesterday",
                    type: "info",
                  },
                ].map((notification, index) => {
                  const getBadgeVariant = (type: string) => {
                    switch (type) {
                      case "info":
                        return "secondary";
                      case "warning":
                        return "secondary";
                      case "success":
                        return "default";
                      case "error":
                        return "destructive";
                      default:
                        return "outline";
                    }
                  };

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge variant={getBadgeVariant(notification.type)}>
                            {notification.type}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Mark as read
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "System Updates",
                      description: "Receive notifications about system updates",
                    },
                    {
                      title: "Performance Alerts",
                      description: "Get notified about performance issues",
                    },
                    {
                      title: "User Milestones",
                      description: "Celebrate user growth and milestones",
                    },
                    {
                      title: "API Status",
                      description: "Monitor external API connectivity",
                    },
                  ].map((setting, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium">{setting.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                      <Switch checked={index !== 3} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Methods</CardTitle>
                <CardDescription>
                  How you'll receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      method: "In-app",
                      description: "Show notifications in the dashboard",
                    },
                    {
                      method: "Email",
                      description: "Send notifications to your email",
                    },
                    {
                      method: "Slack",
                      description: "Post notifications to Slack",
                    },
                    {
                      method: "SMS",
                      description: "Send text message alerts (urgent only)",
                    },
                  ].map((method, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium">{method.method}</h4>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      <Switch checked={index < 2} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
