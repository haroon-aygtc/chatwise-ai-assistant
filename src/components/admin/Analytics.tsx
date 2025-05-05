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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  Filter,
  LineChart,
  PieChart,
  Calendar,
  ArrowUpRight,
  Users,
  MessageSquare,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
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

const Analytics = () => {
  const [dateRange, setDateRange] = useState("last-30-days");
  const [exportFormat, setExportFormat] = useState("csv");

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
    { name: "Informational", value: 40 },
    { name: "Troubleshooting", value: 25 },
    { name: "Product Inquiry", value: 20 },
    { name: "Other", value: 15 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor and analyze conversation metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="last-month">Last month</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,842</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                +18% <ArrowUpRight className="h-3 w-3" />
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Time
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                -0.3s <ArrowUpRight className="h-3 w-3" />
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              User Satisfaction
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                +3% <ArrowUpRight className="h-3 w-3" />
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,583</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                +12% <ArrowUpRight className="h-3 w-3" />
              </span>
              from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="conversations">
            <MessageSquare className="mr-2 h-4 w-4" /> Conversations
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="performance">
            <LineChart className="mr-2 h-4 w-4" /> Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Volume</CardTitle>
                <CardDescription>
                  Daily conversation volume over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart
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
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Response Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of AI responses by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart className="animate-fade-in">
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
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="pt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversation Metrics</CardTitle>
              <CardDescription>
                Detailed analytics about conversation performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Avg. Conversation Length</h3>
                  <div className="text-2xl font-bold">4.2 messages</div>
                  <p className="text-xs text-muted-foreground">
                    +0.5 from last period
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Avg. Resolution Time</h3>
                  <div className="text-2xl font-bold">3.5 minutes</div>
                  <p className="text-xs text-muted-foreground">
                    -0.8 from last period
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Handoff Rate</h3>
                  <div className="text-2xl font-bold">8.3%</div>
                  <p className="text-xs text-muted-foreground">
                    -2.1% from last period
                  </p>
                </div>
              </div>

              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart
                    data={[
                      { date: "Jan", messages: 3.8, time: 4.2 },
                      { date: "Feb", messages: 3.9, time: 4.0 },
                      { date: "Mar", messages: 4.0, time: 3.8 },
                      { date: "Apr", messages: 4.1, time: 3.7 },
                      { date: "May", messages: 4.2, time: 3.5 },
                      { date: "Jun", messages: 4.2, time: 3.5 },
                    ]}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    className="animate-fade-in"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
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
                    <Line
                      type="monotone"
                      dataKey="messages"
                      name="Avg. Messages"
                      stroke="hsl(var(--primary))"
                      activeDot={{ r: 8 }}
                      animationDuration={1500}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      name="Avg. Time (min)"
                      stroke="hsl(var(--secondary))"
                      activeDot={{ r: 8 }}
                      animationDuration={1500}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="pt-6 space-y-6">
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
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary) / 0.2)"
                    activeDot={{ r: 6 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="pt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Performance Metrics</CardTitle>
              <CardDescription>
                Response time and accuracy metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart
                  data={[
                    { date: "Jan", time: 1.8, accuracy: 88 },
                    { date: "Feb", time: 1.6, accuracy: 89 },
                    { date: "Mar", time: 1.4, accuracy: 90 },
                    { date: "Apr", time: 1.3, accuracy: 91 },
                    { date: "May", time: 1.2, accuracy: 92 },
                    { date: "Jun", time: 1.1, accuracy: 92 },
                  ]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  className="animate-fade-in"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="time"
                    name="Response Time (s)"
                    stroke="hsl(var(--primary))"
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy (%)"
                    stroke="hsl(var(--secondary))"
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
