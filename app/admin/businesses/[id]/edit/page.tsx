"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Eye, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Business as DatabaseBusiness } from "@/lib/types";

const businessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(1, "Please select an industry"),
  template: z.string().min(1, "Please select a template"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  status: z.enum(["draft", "active", "coming-soon", "deleted"]),
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

const templates = [
  { value: "gas-station", label: "Gas Station", category: "automotive" },
  { value: "hotel", label: "Hotel", category: "hospitality" },
  { value: "restaurant", label: "Restaurant", category: "food-service" },
  { value: "pharmacy", label: "Pharmacy", category: "healthcare" },
  { value: "farming", label: "Farm", category: "agriculture" },
];

const industries = [
  { value: "automotive", label: "Automotive" },
  { value: "hospitality", label: "Hospitality" },
  { value: "food-service", label: "Food & Service" },
  { value: "healthcare", label: "Healthcare" },
  { value: "agriculture", label: "Agriculture" },
  { value: "retail", label: "Retail" },
  { value: "professional-services", label: "Professional Services" },
];

// Transform database business to form format
function transformBusinessForEdit(business: DatabaseBusiness): BusinessFormData {
  // Extract valid website URL from social media
  const getWebsiteFromSocialMedia = (): string => {
    if (business.socialMedia?.facebook) {
      try {
        new URL(business.socialMedia.facebook);
        return business.socialMedia.facebook;
      } catch {
        return '';
      }
    }
    return '';
  };

  return {
    name: business.name,
    slug: business.slug,
    description: business.description,
    industry: business.industry,
    template: business.template,
    email: business.contact?.email || '',
    phone: business.contact?.phone || '',
    address: business.contact?.address || '',
    city: '', // Not in database schema
    state: '', // Not in database schema  
    zipCode: '', // Not in database schema
    website: getWebsiteFromSocialMedia(),
    status: business.status || 'draft',
    primaryColor: business.branding?.primaryColor || '#3b82f6',
    secondaryColor: business.branding?.secondaryColor || '#ef4444',
  };
}

// Transform form data to database format
function transformFormToDatabaseBusiness(formData: BusinessFormData, existingBusiness: DatabaseBusiness): any {
  // Validate URL format for website field
  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Build social media object only with valid URLs
  const socialMedia: any = {};
  if (formData.website && isValidUrl(formData.website)) {
    socialMedia.facebook = formData.website;
  }

  // Preserve existing business data and merge with form updates
  return {
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    industry: formData.industry,
    template: formData.template,
    status: formData.status,
    branding: {
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      // Preserve existing branding fields
      logo: existingBusiness.branding?.logo,
      favicon: existingBusiness.branding?.favicon,
      font: existingBusiness.branding?.font,
    },
    contact: {
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      // Preserve existing coordinates if any
      coordinates: existingBusiness.contact?.coordinates,
    },
    // Merge with existing social media, ensure empty object if no social media
    socialMedia: Object.keys(socialMedia).length > 0 ? {
      ...existingBusiness.socialMedia,
      ...socialMedia,
    } : existingBusiness.socialMedia || {},
    seo: {
      metaTitle: `${formData.name} - Professional Services`,
      metaDescription: formData.description.substring(0, 160), // Ensure max length
      keywords: [formData.industry.toLowerCase(), formData.template.replace('-', ' ')].slice(0, 10), // Ensure max 10 keywords
      // Preserve existing SEO fields
      ogImage: existingBusiness.seo?.ogImage,
      canonicalUrl: existingBusiness.seo?.canonicalUrl,
    },
    // Preserve timestamps
    createdAt: existingBusiness.createdAt,
    updatedAt: new Date(),
  };
}

export default function EditBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);
  const [error, setError] = useState("");
  const [businessData, setBusinessData] = useState<DatabaseBusiness | null>(null);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    const slug = generateSlug(name);
    form.setValue("slug", slug);
  };

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      industry: "",
      template: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      website: "",
      status: 'draft',
      primaryColor: "#3b82f6",
      secondaryColor: "#ef4444",
    },
  });

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      setIsLoadingBusiness(true);
      setError("");
      
      // Fetch business data from API
      const response = await fetch(`/api/businesses/${businessId}`);
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch business');
      }
      
      if (result.data) {
        // Store business data for transformation
        setBusinessData(result.data);
        // Transform database business to form format
        const formData = transformBusinessForEdit(result.data);
        form.reset(formData);
      } else {
        throw new Error('Business not found');
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      setError(error instanceof Error ? error.message : "Failed to load business data");
    } finally {
      setIsLoadingBusiness(false);
    }
  };

  const onSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    setError("");
    
    try {
      if (!businessData) {
        throw new Error('Business data not loaded');
      }
      
      // Transform form data to database format
      const updateData = transformFormToDatabaseBusiness(data, businessData);
      
      const response = await fetch(`/api/businesses/${businessId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        // Handle validation errors more gracefully
        if (result.error && Array.isArray(result.error)) {
          // If it's a validation error array, show the first error message
          const firstError = result.error[0];
          const errorMessage = firstError.message || firstError.code || "Validation error";
          throw new Error(`Validation error: ${errorMessage}`);
        }
        throw new Error(result.error || "Failed to update business");
      }
      
      // Redirect to business details page on success
      router.push(`/admin/businesses/${businessId}`);
    } catch (error) {
      console.error("Error updating business:", error);
      setError(error instanceof Error ? error.message : "Failed to update business. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = form.watch("industry") 
    ? templates.filter(template => template.category === form.watch("industry"))
    : templates;

  if (isLoadingBusiness) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading business data...</p>
        </div>
      </div>
    );
  }

  if (error && isLoadingBusiness) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchBusiness}>Try Again</Button>
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
            <h1 className="text-3xl font-bold">Edit Business</h1>
            <p className="text-muted-foreground">Update business information and settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/business/${form.watch("slug")}`} target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/businesses/${businessId}/content`}>
              Manage Content
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update the basic details for this business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter business name" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleNameChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what this business does..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry.value} value={industry.value}>
                                  {industry.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="template"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a template" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredTemplates.map((template) => (
                                <SelectItem key={template.value} value={template.value}>
                                  {template.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Changing template will affect the business appearance
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Business contact details and location
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="business@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Business status and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || 'draft'}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="coming-soon">Coming Soon</SelectItem>
                            <SelectItem value="deleted">Deleted</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Active: Visible to public. Coming Soon: Shows with overlay. Draft: Hidden. Deleted: Removed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Branding */}
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>
                    Customize the business colors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input type="color" className="w-16 h-10" {...field} />
                            <Input placeholder="#3b82f6" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input type="color" className="w-16 h-10" {...field} />
                            <Input placeholder="#ef4444" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" className="w-full" asChild>
                      <Link href={`/admin/businesses/${businessId}`}>
                        Cancel
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}