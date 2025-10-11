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
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Eye, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const businessSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(1, "Please select an industry"),
  template: z.string().min(1, "Please select a template"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  primaryColor: z.string().default("#3b82f6"),
  secondaryColor: z.string().default("#ef4444"),
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

export default function EditBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(true);
  const [error, setError] = useState("");

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
      isActive: true,
      primaryColor: "#3b82f6",
      secondaryColor: "#ef4444",
    },
  });

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  const fetchBusiness = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockBusiness = {
        id: businessId,
        name: "QuickFuel Express",
        slug: "quickfuel-express",
        description: "Premium gas station with convenience store and car wash services",
        industry: "automotive",
        template: "gas-station",
        email: "contact@quickfuel.com",
        phone: "(555) 123-4567",
        address: "123 Main Street",
        city: "Springfield",
        state: "CA",
        zipCode: "90210",
        website: "https://www.quickfuel.com",
        isActive: true,
        primaryColor: "#3b82f6",
        secondaryColor: "#ef4444",
      };

      // Simulate API delay
      setTimeout(() => {
        form.reset(mockBusiness);
        setIsLoadingBusiness(false);
      }, 1000);
    } catch (error) {
      setError("Failed to load business data");
      setIsLoadingBusiness(false);
    }
  };

  const onSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const response = await fetch(`/api/businesses/${businessId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push(`/admin/businesses/${businessId}`);
      } else {
        throw new Error("Failed to update business");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      setError("Failed to update business. Please try again.");
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="business-name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Changing this will affect the business URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Make this business visible to the public
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
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