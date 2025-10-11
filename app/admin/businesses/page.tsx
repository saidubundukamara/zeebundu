"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Globe,
  Building2,
  Calendar,
  Users
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  slug: string;
  template: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  lastUpdated: string;
  views: number;
  owner: string;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockBusinesses: Business[] = [
        {
          id: "1",
          name: "QuickFuel Express",
          slug: "quickfuel-express",
          template: "gas-station",
          status: "active",
          createdAt: "2024-01-15",
          lastUpdated: "2024-01-20",
          views: 1250,
          owner: "John Smith"
        },
        {
          id: "2",
          name: "Grand Plaza Hotel",
          slug: "grand-plaza-hotel",
          template: "hotel",
          status: "active",
          createdAt: "2024-01-10",
          lastUpdated: "2024-01-18",
          views: 2800,
          owner: "Sarah Johnson"
        },
        {
          id: "3",
          name: "Organic Valley Farm",
          slug: "organic-valley-farm",
          template: "farming",
          status: "active",
          createdAt: "2024-01-05",
          lastUpdated: "2024-01-12",
          views: 950,
          owner: "Mike Wilson"
        },
        {
          id: "4",
          name: "HealthCare Plus",
          slug: "healthcare-plus",
          template: "pharmacy",
          status: "draft",
          createdAt: "2024-01-22",
          lastUpdated: "2024-01-22",
          views: 0,
          owner: "Dr. Emily Brown"
        },
        {
          id: "5",
          name: "Bella Vista Restaurant",
          slug: "bella-vista-restaurant",
          template: "restaurant",
          status: "inactive",
          createdAt: "2023-12-20",
          lastUpdated: "2024-01-15",
          views: 3200,
          owner: "Tony Martinez"
        },
      ];
      setBusinesses(mockBusinesses);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Business["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTemplateName = (template: string) => {
    const templates: Record<string, string> = {
      "gas-station": "Gas Station",
      "hotel": "Hotel",
      "farming": "Farm",
      "pharmacy": "Pharmacy",
      "restaurant": "Restaurant",
    };
    return templates[template] || template;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
          <p className="text-gray-600 mt-1">
            Manage all business profiles and their content
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/admin/businesses/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Business
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => b.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.reduce((sum, b) => sum + b.views, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(businesses.map(b => b.template)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Businesses</CardTitle>
              <CardDescription>
                Manage and monitor all business profiles
              </CardDescription>
            </div>
            <div className="relative mt-4 md:mt-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 md:w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{business.name}</div>
                      <div className="text-sm text-muted-foreground">
                        /{business.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTemplateName(business.template)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(business.status)}</TableCell>
                  <TableCell>{business.owner}</TableCell>
                  <TableCell>{business.views.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(business.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/business/${business.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View Site
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/businesses/${business.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/businesses/${business.id}/content`}>
                            <Globe className="mr-2 h-4 w-4" />
                            Manage Content
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredBusinesses.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No businesses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search" : "Get started by creating a new business"}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/admin/businesses/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Business
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}