"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Edit2, 
  Eye, 
  Settings,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Palette,
  Building2,
  Users,
  BarChart3,
  FileText,
  AlertCircle,
  Loader2,
  ExternalLink,
  Activity
} from "lucide-react";
import Link from "next/link";
import { Business as DatabaseBusiness } from "@/lib/types";

interface AdminBusinessDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  industry: string;
  template: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  isActive: boolean;
  primaryColor: string;
  secondaryColor: string;
  createdAt: string;
  updatedAt: string;
}

// Transform database business to admin details format
function transformBusinessDetailsForAdmin(business: DatabaseBusiness): AdminBusinessDetails {
  // Handle dates that might be strings or Date objects
  const formatDate = (date: Date | string): string => {
    if (!date) return new Date().toISOString();
    
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    
    return date.toISOString();
  };

  return {
    id: business._id?.toString() || '',
    name: business.name,
    slug: business.slug,
    description: business.description,
    industry: business.industry,
    template: business.template,
    email: business.contact?.email || '',
    phone: business.contact?.phone || '',
    address: business.contact?.address || '',
    city: '', // Not in database schema - could be extracted from address
    state: '', // Not in database schema - could be extracted from address  
    zipCode: '', // Not in database schema - could be extracted from address
    website: business.socialMedia?.facebook || '', // Using social media as website fallback
    isActive: business.status === 'active',
    primaryColor: business.branding?.primaryColor || '#3b82f6',
    secondaryColor: business.branding?.secondaryColor || '#ef4444',
    createdAt: formatDate(business.createdAt),
    updatedAt: formatDate(business.updatedAt)
  };
}

interface BusinessStats {
  pageViews: number;
  uniqueVisitors: number;
  contactSubmissions: number;
  lastUpdated: string;
}

export default function BusinessDetailsPage() {
  const params = useParams();
  const businessId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [business, setBusiness] = useState<AdminBusinessDetails | null>(null);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusinessDetails();
  }, [businessId]);

  const fetchBusinessDetails = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Fetch business data from API
      const response = await fetch(`/api/businesses/${businessId}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch business');
      }
      
      if (result.data) {
        // Transform database business to admin format
        const adminBusiness = transformBusinessDetailsForAdmin(result.data);
        setBusiness(adminBusiness);
        
        // Mock stats for now - in a real app, this would be a separate API call
        const mockStats: BusinessStats = {
          pageViews: 0, // Would come from analytics
          uniqueVisitors: 0, // Would come from analytics
          contactSubmissions: 0, // Would come from form submissions
          lastUpdated: adminBusiness.updatedAt,
        };
        setStats(mockStats);
      } else {
        throw new Error('Business not found');
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
      setError(error instanceof Error ? error.message : "Failed to load business details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIndustryLabel = (industry: string) => {
    const industryMap: Record<string, string> = {
      "Automotive": "Automotive",
      "Hospitality": "Hospitality", 
      "Food & Beverage": "Food & Beverage",
      "Healthcare": "Healthcare",
      "Agriculture": "Agriculture",
      "Retail": "Retail",
      "Real Estate": "Real Estate",
      "automotive": "Automotive",
      "hospitality": "Hospitality",
      "food-service": "Food & Service",
      "healthcare": "Healthcare",
      "agriculture": "Agriculture",
      "retail": "Retail",
      "professional-services": "Professional Services",
    };
    return industryMap[industry] || industry;
  };

  const getTemplateLabel = (template: string) => {
    const templateMap: Record<string, string> = {
      "gas-station": "Gas Station",
      "hotel": "Hotel",
      "hotel-resort": "Hotel & Resort",
      "restaurant": "Restaurant", 
      "pharmacy": "Pharmacy",
      "farming": "Farm",
      "agriculture": "Agriculture",
      "retail": "Retail",
      "automotive": "Automotive",
      "real-estate": "Real Estate"
    };
    return templateMap[template] || template.charAt(0).toUpperCase() + template.slice(1).replace('-', ' ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Business not found"}</AlertDescription>
        </Alert>
        <Button onClick={fetchBusinessDetails}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/businesses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Businesses
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Building2 className="w-6 h-6" />
              <h1 className="text-3xl font-bold">{business.name}</h1>
              <Badge variant={business.isActive ? "default" : "secondary"}>
                {business.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{business.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/business/${business.slug}`} target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              View Site
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/businesses/${businessId}/edit`}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Business
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/businesses/${businessId}/content`}>
              <FileText className="w-4 h-4 mr-2" />
              Manage Content
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                      <p className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                      <p className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Mail className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Contact Forms</p>
                      <p className="text-2xl font-bold">{stats.contactSubmissions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Complete business profile and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Basic Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Industry:</span>
                      <Badge variant="outline">{getIndustryLabel(business.industry)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Template:</span>
                      <Badge variant="outline">{getTemplateLabel(business.template)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">URL:</span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">/business/{business.slug}</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                        {business.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">
                        {business.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div>{business.address}</div>
                        <div>{business.city}, {business.state} {business.zipCode}</div>
                      </div>
                    </div>
                    {business.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {business.website}
                          <ExternalLink className="w-3 h-3 ml-1 inline" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                <p className="text-sm leading-relaxed">{business.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates and changes to this business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Business content updated</p>
                    <p className="text-xs text-muted-foreground">{formatDate(business.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Business profile created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(business.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for this business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/admin/businesses/${businessId}/content`}>
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Content
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/admin/businesses/${businessId}/edit`}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Details
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/business/${business.slug}`} target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Site
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Branding
              </CardTitle>
              <CardDescription>
                Current color scheme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Primary Color</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-200" 
                    style={{ backgroundColor: business.primaryColor }}
                  ></div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{business.primaryColor}</code>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Secondary Color</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border border-gray-200" 
                    style={{ backgroundColor: business.secondaryColor }}
                  ></div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{business.secondaryColor}</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{formatDate(business.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">{formatDate(business.updatedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Business ID</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">{business.id}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}