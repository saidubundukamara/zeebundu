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
import { Business as DatabaseBusiness } from "@/lib/types";

interface AdminBusiness {
  id: string;
  name: string;
  slug: string;
  template: string;
  industry: string;
  status: "active" | "coming-soon" | "draft" | "deleted";
  createdAt: string;
  lastUpdated: string;
  views: number;
  owner: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
}

// Transform database business to admin display format
function transformBusinessForAdmin(business: DatabaseBusiness): AdminBusiness {
  // Handle dates that might be strings or Date objects
  const formatDate = (date: Date | string): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    
    if (typeof date === 'string') {
      return new Date(date).toISOString().split('T')[0];
    }
    
    return date.toISOString().split('T')[0];
  };

  return {
    id: business._id?.toString() || '',
    name: business.name,
    slug: business.slug,
    template: business.template,
    industry: business.industry,
    status: business.status,
    createdAt: formatDate(business.createdAt),
    lastUpdated: formatDate(business.updatedAt),
    views: 0, // This would need to be tracked separately in a real app
    owner: business.contact?.email || 'Unknown', // Using email as owner identifier
    description: business.description,
    contactEmail: business.contact?.email || '',
    contactPhone: business.contact?.phone || ''
  };
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all businesses from API (not just active ones for admin)
      const response = await fetch('/api/businesses');
      const result = await response.json();
      
      if (result.success && result.data) {
        // Transform database businesses to admin format
        const adminBusinesses = result.data.map(transformBusinessForAdmin);
        setBusinesses(adminBusinesses);
      } else {
        setError(result.error || 'Failed to load businesses');
      }
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      setError('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: AdminBusiness["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:!bg-green-100">Active</Badge>;
      case "coming-soon":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:!bg-yellow-100">Coming Soon</Badge>;
      case "draft":
        return <Badge variant="outline" className="hover:!bg-transparent">Draft</Badge>;
      case "deleted":
        return <Badge className="bg-red-100 text-red-800 hover:!bg-red-100">Deleted</Badge>;
      default:
        return <Badge variant="secondary" className="hover:!bg-secondary">{status}</Badge>;
    }
  };

  const getTemplateName = (template: string) => {
    const templates: Record<string, string> = {
      "gas-station": "Gas Station",
      "hotel": "Hotel",
      "hotel-resort": "Hotel & Resort", 
      "farming": "Farm",
      "agriculture": "Agriculture",
      "pharmacy": "Pharmacy",
      "healthcare": "Healthcare",
      "restaurant": "Restaurant",
      "food": "Food & Beverage",
      "retail": "Retail",
      "automotive": "Automotive",
      "real-estate": "Real Estate",
      "micro-finance": "Micro-Finance & Lending",
      "lending": "Micro-Finance & Lending",
      "microfinance": "Micro-Finance & Lending"
    };
    return templates[template] || template.charAt(0).toUpperCase() + template.slice(1).replace('-', ' ');
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

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-12">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to load businesses</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchBusinesses}>
            Try Again
          </Button>
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
            <CardTitle className="text-sm font-medium">Industries</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(businesses.map(b => b.industry)).size}
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
                <TableHead>Industry</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
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
                    <Badge variant="secondary">
                      {business.industry}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTemplateName(business.template)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(business.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {business.owner}
                    </div>
                  </TableCell>
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