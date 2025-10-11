"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  BarChart3,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface DashboardStats {
  totalBusinesses: number;
  activeBusinesses: number;
  totalUsers: number;
  activeUsers: number;
  totalTemplates: number;
  totalViews: number;
  monthlyGrowth: number;
  systemHealth: "healthy" | "warning" | "error";
}

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockStats: DashboardStats = {
        totalBusinesses: 12,
        activeBusinesses: 10,
        totalUsers: 48,
        activeUsers: 32,
        totalTemplates: 15,
        totalViews: 2847,
        monthlyGrowth: 12.5,
        systemHealth: "healthy"
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock chart data
  const viewsData = [
    { name: "Mon", views: 120 },
    { name: "Tue", views: 190 },
    { name: "Wed", views: 300 },
    { name: "Thu", views: 280 },
    { name: "Fri", views: 400 },
    { name: "Sat", views: 350 },
    { name: "Sun", views: 200 },
  ];

  const businessTypesData = [
    { name: "Gas Stations", value: 4, color: "#3b82f6" },
    { name: "Hotels", value: 3, color: "#10b981" },
    { name: "Restaurants", value: 2, color: "#f59e0b" },
    { name: "Farms", value: 2, color: "#8b5cf6" },
    { name: "Pharmacies", value: 1, color: "#ef4444" },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "business_created",
      message: "New gas station 'QuickFuel Express' created",
      time: "2 hours ago",
      icon: Building2,
      severity: "info"
    },
    {
      id: 2,
      type: "content_updated",
      message: "Hotel 'Grand Plaza' updated services section",
      time: "4 hours ago",
      icon: Edit,
      severity: "info"
    },
    {
      id: 3,
      type: "template_used",
      message: "Pharmacy template used for 'HealthCare Plus'",
      time: "1 day ago",
      icon: FileText,
      severity: "success"
    },
    {
      id: 4,
      type: "user_login",
      message: "New user registration from john@example.com",
      time: "2 days ago",
      icon: Users,
      severity: "info"
    },
  ];

  const quickActions = [
    {
      name: "Create Business",
      description: "Add a new business to the platform",
      href: "/admin/businesses/create",
      icon: Plus,
      variant: "default" as const,
    },
    {
      name: "Manage Templates",
      description: "Edit business templates",
      href: "/admin/templates",
      icon: FileText,
      variant: "secondary" as const,
    },
    {
      name: "View Analytics",
      description: "Check performance metrics",
      href: "/admin/analytics",
      icon: BarChart3,
      variant: "outline" as const,
    },
    {
      name: "Visit Website",
      description: "Preview the public website",
      href: "/",
      icon: Globe,
      variant: "ghost" as const,
      external: true,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {admin?.name?.split(' ')[0] || 'Admin'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your multi-business platform today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 md:mt-0">
          <Clock className="w-4 h-4" />
          Last updated: {new Date().toLocaleTimeString()}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchDashboardStats}
            className="ml-2"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeBusinesses} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeUsers} active this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              5 business types
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Views</CardTitle>
            <CardDescription>
              Page views across all business sites this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.name}
                variant={action.variant}
                className="w-full justify-start"
                asChild
              >
                <Link 
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.name}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Business Types and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Types */}
        <Card>
          <CardHeader>
            <CardTitle>Business Types</CardTitle>
            <CardDescription>
              Distribution of business categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={businessTypesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {businessTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <activity.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={activity.severity === "success" ? "default" : "secondary"}>
                    {activity.type.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/activity">
                  View all activity
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current health of platform services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">Connected and operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Authentication</p>
                <p className="text-xs text-muted-foreground">All services active</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Templates</p>
                <p className="text-xs text-muted-foreground">15 templates ready</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}