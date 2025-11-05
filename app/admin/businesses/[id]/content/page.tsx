"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  Calendar,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { HeroEditor } from "@/components/admin/content-editors/HeroEditor";
import { GalleryEditor } from "@/components/admin/content-editors/GalleryEditor";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface ContentSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact';
  title: string;
  content: any;
  isActive: boolean;
}

interface HeroContent {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage?: any;
  backgroundVideo?: any;
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  textAlign: 'left' | 'center' | 'right';
  buttons: Array<{
    id: string;
    text: string;
    link: string;
    style: 'primary' | 'secondary' | 'outline';
    isVisible: boolean;
  }>;
  style: {
    titleSize: 'sm' | 'md' | 'lg' | 'xl';
    titleColor: string;
    descriptionColor: string;
    backgroundColor: string;
  };
}

interface GalleryContent {
  title: string;
  description?: string;
  layout: 'grid' | 'masonry' | 'carousel' | 'lightbox';
  columns: number;
  images: Array<{
    id: string;
    media: any;
    caption?: string;
    alt?: string;
    isVisible: boolean;
    order: number;
  }>;
}

export default function BusinessContentPage() {
  const params = useParams();
  const businessId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbConnectionWarning, setDbConnectionWarning] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [activeTab, setActiveTab] = useState("hero");
  const [addServiceOpenId, setAddServiceOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinessContent();
  }, [businessId]);

  const fetchBusinessContent = async () => {
    setIsLoading(true);
    let businessData: any = null;
    
    try {
      // Try to fetch business details
      const businessResponse = await fetch(`/api/businesses/${businessId}`);
      if (businessResponse.ok) {
        const businessResult = await businessResponse.json();
        if (businessResult.success) {
          businessData = businessResult.data;
          setBusiness(businessData);
        }
      }
    } catch (error) {
      console.warn('Failed to fetch business data, using fallback:', error);
      setDbConnectionWarning(true);
    }

    // If no business data available, create mock business for content editing
    if (!businessData) {
      businessData = {
        _id: businessId,
        name: 'Business Name (Edit Me)',
        slug: 'business-name',
        description: 'Business description goes here...',
        template: 'gas-station',
        status: 'active',
        contact: {
          phone: '(555) 123-4567',
          email: 'contact@business.com',
          address: '123 Main St, City, State 12345'
        },
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#06B6D4'
        },
        socialMedia: {},
        hours: {
          'Monday - Friday': '9:00 AM - 5:00 PM',
          'Saturday': '10:00 AM - 4:00 PM',
          'Sunday': 'Closed'
        }
      };
      setBusiness(businessData);
    }

    // Try to fetch business content
    try {
      const contentResponse = await fetch(`/api/businesses/${businessId}/content`);
      if (contentResponse.ok) {
        const contentResult = await contentResponse.json();
        if (contentResult.success && contentResult.data && contentResult.data.length > 0) {
          setSections(contentResult.data);
          setIsLoading(false);
          return;
        }
      }
    } catch (contentError) {
      console.warn('Content API not available, using default sections:', contentError);
      setDbConnectionWarning(true);
    }

    // Create default sections
    const defaultSections: ContentSection[] = [
      {
        id: "hero",
        type: "hero",
        title: "Hero Section",
        isActive: true,
        content: {
          title: `Welcome to ${businessData.name}`,
          subtitle: businessData.description || "Your trusted partner for quality service",
          description: businessData.description || `Experience exceptional service at ${businessData.name}. We're committed to providing you with the best possible experience.`,
          overlay: {
            enabled: true,
            color: "#000000",
            opacity: 50
          },
          textAlign: "center" as const,
          buttons: [
            {
              id: "btn-1",
              text: "Contact Us",
              link: "#contact",
              style: "primary" as const,
              isVisible: true
            },
            {
              id: "btn-2",
              text: "Our Services",
              link: "#services",
              style: "outline" as const,
              isVisible: true
            }
          ],
          style: {
            titleSize: "lg" as const,
            titleColor: "#ffffff",
            descriptionColor: "#e5e7eb",
            backgroundColor: "#1f2937"
          }
        }
      },
      {
        id: "about",
        type: "about",
        title: "About Section",
        isActive: true,
        content: {
          title: `About ${businessData.name}`,
          description: businessData.description || "Learn more about our business and what makes us special.",
          features: [
            "Quality service",
            "Professional staff",
            "Competitive prices",
            "Customer satisfaction"
          ],
          stats: [
            { label: "Years in Business", value: "1+" },
            { label: "Happy Customers", value: "100+" },
            { label: "Service Quality", value: "Premium" },
            { label: "Customer Rating", value: "5-Star" }
          ]
        }
      },
      {
        id: "services",
        type: "services",
        title: "Services Section",
        isActive: true,
        content: {
          title: "Our Services",
          description: "Discover what we have to offer",
          services: [
            {
              name: "Primary Service",
              description: "Our main service offering",
              icon: "service",
              features: ["Feature 1", "Feature 2", "Feature 3"]
            }
          ]
        }
      },
      {
        id: "gallery",
        type: "gallery",
        title: "Gallery Section",
        isActive: true,
        content: {
          title: "Our Gallery",
          description: "Take a look at our work and facilities",
          layout: "grid" as const,
          columns: 3,
          images: []
        }
      },
      {
        id: "testimonials",
        type: "testimonials",
        title: "Testimonials Section",
        isActive: true,
        content: {
          title: "What Our Customers Say",
          testimonials: []
        }
      },
      {
        id: "contact",
        type: "contact",
        title: "Contact Section",
        isActive: true,
        content: {
          title: "Contact Us",
          address: businessData.contact?.address || "Address not provided",
          phone: businessData.contact?.phone || "Phone not provided",
          email: businessData.contact?.email || "Email not provided",
          hours: businessData.hours || {
            "Monday - Friday": "9:00 AM - 5:00 PM",
            "Saturday": "10:00 AM - 4:00 PM",
            "Sunday": "Closed"
          },
          socialMedia: businessData.socialMedia || {}
        }
      }
    ];

    setSections(defaultSections);
    setIsLoading(false);
  };

  const saveSection = async (sectionId: string, content: any) => {
    setIsSaving(true);
    try {
      // Update local state optimistically
      setSections(prev => prev.map(section => 
        section.id === sectionId ? { ...section, content } : section
      ));

      // Save to API
      const response = await fetch(`/api/businesses/${businessId}/content/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to save section');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to save section');
      }
      
      console.log("Successfully saved section:", sectionId);
    } catch (error) {
      console.error("Error saving section:", error);
      // Don't revert local state - keep the changes for editing
      // Just show a warning about the save failure
      if (dbConnectionWarning) {
        console.log('Save skipped: Database connection not available (development mode)');
      } else {
        alert('Failed to save changes to database. Your edits are preserved locally but may be lost on page refresh.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const renderHeroEditor = (section: ContentSection) => (
    <HeroEditor
      content={section.content as HeroContent}
      onChange={(newContent) => {
        setSections(prev => prev.map(s => 
          s.id === section.id ? { ...s, content: newContent } : s
        ));
      }}
      businessId={businessId}
      onSave={() => saveSection(section.id, section.content)}
      isSaving={isSaving}
    />
  );

  const renderGalleryEditor = (section: ContentSection) => (
    <GalleryEditor
      content={section.content as GalleryContent}
      onChange={(newContent) => {
        setSections(prev => prev.map(s => 
          s.id === section.id ? { ...s, content: newContent } : s
        ));
      }}
      businessId={businessId}
      onSave={() => saveSection(section.id, section.content)}
      isSaving={isSaving}
    />
  );

  const renderAboutEditor = (section: ContentSection) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={section.content.title}
          onChange={(e) => {
            const newContent = { ...section.content, title: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Section title"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={section.content.description}
          onChange={(e) => {
            const newContent = { ...section.content, description: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="About description"
          className="min-h-[120px]"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Features (one per line)</label>
        <Textarea
          value={section.content.features.join('\n')}
          onChange={(e) => {
            const features = e.target.value.split('\n').filter(f => f.trim());
            const newContent = { ...section.content, features };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
        />
      </div>
      <Button 
        onClick={() => saveSection(section.id, section.content)}
        disabled={isSaving}
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save About Section
      </Button>
    </div>
  );

  const renderServicesEditor = (section: ContentSection) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Section Title</label>
        <Input
          value={section.content.title}
          onChange={(e) => {
            const newContent = { ...section.content, title: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Services section title"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={section.content.description}
          onChange={(e) => {
            const newContent = { ...section.content, description: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Services description"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Services</label>
          <Dialog modal={false} open={addServiceOpenId === section.id} onOpenChange={(o) => setAddServiceOpenId(o ? section.id : null)}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={() => setAddServiceOpenId(section.id)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input id="svc-name" placeholder="Service name" />
                  <Input id="svc-price" placeholder="Price (e.g. $85)" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input id="svc-image" placeholder="Image URL" className="flex-1" />
                    <MediaPicker
                      trigger={<Button variant="outline" size="sm">Pick/Upload</Button>}
                      selectionMode="single"
                      acceptedTypes={['image']}
                      onSelect={(media: any) => {
                        const url = media?.url;
                        const input = document.getElementById('svc-image') as HTMLInputElement | null;
                        if (input && url) input.value = url;
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Choose from Cloudinary library or upload from device</p>
                </div>
                <Textarea id="svc-desc" placeholder="Service description" />
              </div>
              <DialogFooter>
                <Button onClick={async () => {
                  const name = (document.getElementById('svc-name') as HTMLInputElement)?.value?.trim() || '';
                  const price = (document.getElementById('svc-price') as HTMLInputElement)?.value?.trim() || '';
                  const image = (document.getElementById('svc-image') as HTMLInputElement)?.value?.trim() || '';
                  const description = (document.getElementById('svc-desc') as HTMLTextAreaElement)?.value?.trim() || '';

                  if (!name) {
                    alert('Service name is required');
                    return;
                  }

                  const newService = {
                    name,
                    title: name,
                    description,
                    image,
                    price,
                    duration: '',
                    features: [] as string[],
                    category: ''
                  };

                  const nextServices = Array.isArray(section.content.services)
                    ? [...section.content.services, newService]
                    : [newService];

                  // Remove any empty placeholder services just in case
                  const cleanedServices = nextServices.filter((s: any) => (s?.name || s?.title)?.trim());
                  const newContent = { ...section.content, services: cleanedServices };

                  // Update local state
                  setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                  // Persist immediately
                  try {
                    await saveSection(section.id, newContent);
                    setAddServiceOpenId(null);
                  } catch (e) {
                    console.warn('Failed to persist new service immediately, it remains in local state.');
                  }
                }}>
                  Save Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {section.content.services?.filter((service: any) => (service?.name || service?.title)?.trim()).map((service: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Service {index + 1}</div>
                  <Button size="icon" variant="ghost" onClick={() => {
                    const newServices = (section.content.services || []).filter((_: any, i: number) => i !== index);
                    const newContent = { ...section.content, services: newServices };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={service.name ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newServices = [...(section.content.services || [])];
                      newServices[index] = { 
                        ...service, 
                        name: value,
                        title: (service.title ?? '') === (service.name ?? '') || !service.title ? value : service.title
                      };
                      const newContent = { ...section.content, services: newServices };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Service name"
                  />
                  <Input
                    value={service.price ?? ''}
                    onChange={(e) => {
                      const newServices = [...(section.content.services || [])];
                      newServices[index] = { ...service, price: e.target.value };
                      const newContent = { ...section.content, services: newServices };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Price (e.g. $85)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={service.image ?? ''}
                    onChange={(e) => {
                      const newServices = [...(section.content.services || [])];
                      newServices[index] = { ...service, image: e.target.value };
                      const newContent = { ...section.content, services: newServices };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Image URL"
                    className="flex-1"
                  />
                  <MediaPicker
                    trigger={<Button variant="outline" size="sm">Pick/Upload</Button>}
                    selectionMode="single"
                    acceptedTypes={['image']}
                    onSelect={(media: any) => {
                      const url = media?.url;
                      if (!url) return;
                      const newServices = [...(section.content.services || [])];
                      newServices[index] = { ...service, image: url };
                      const newContent = { ...section.content, services: newServices };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                  />
                </div>
                <Textarea
                  value={service.description ?? ''}
                  onChange={(e) => {
                    const newServices = [...(section.content.services || [])];
                    newServices[index] = { ...service, description: e.target.value };
                    const newContent = { ...section.content, services: newServices };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}
                  placeholder="Service description"
                  className="mt-2"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Button 
        onClick={() => {
          const cleaned = {
            ...section.content,
            services: (section.content.services || []).filter((svc: any) => (svc?.name || svc?.title)?.trim())
          };
          setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: cleaned } : s));
          return saveSection(section.id, cleaned);
        }}
        disabled={isSaving}
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Services Section
      </Button>
    </div>
  );

  const renderContactEditor = (section: ContentSection) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Section Title</label>
        <Input
          value={section.content.title}
          onChange={(e) => {
            const newContent = { ...section.content, title: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Contact section title"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input
            value={section.content.phone}
            onChange={(e) => {
              const newContent = { ...section.content, phone: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            value={section.content.email}
            onChange={(e) => {
              const newContent = { ...section.content, email: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Email address"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Address</label>
        <Textarea
          value={section.content.address}
          onChange={(e) => {
            const newContent = { ...section.content, address: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Full address"
        />
      </div>
      <Button 
        onClick={() => saveSection(section.id, section.content)}
        disabled={isSaving}
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Contact Section
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading business content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Content</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchBusinessContent();
            }}>
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/businesses">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Businesses
              </Link>
            </Button>
          </div>
        </div>
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
            <h1 className="text-3xl font-bold">Manage Content</h1>
            <p className="text-muted-foreground">{business?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/business/${business?.slug}`} target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Preview Site
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/businesses/${businessId}/edit`}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Business
            </Link>
          </Button>
        </div>
      </div>

      {/* Database Connection Warning */}
      {dbConnectionWarning && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Development Mode:</strong> Database connection not available. You can still edit content, but changes won't be saved until database is configured. 
            Create a <code>.env.local</code> file with <code>MONGODB_URI</code> to enable data persistence.
          </AlertDescription>
        </Alert>
      )}

      {/* Content Editor */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Contact
          </TabsTrigger>
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.type}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {section.title}
                      <Badge variant={section.isActive ? "default" : "secondary"}>
                        {section.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Customize the {section.type} section content
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {section.type === "hero" && renderHeroEditor(section)}
                {section.type === "about" && renderAboutEditor(section)}
                {section.type === "services" && renderServicesEditor(section)}
                {section.type === "gallery" && renderGalleryEditor(section)}
                {section.type === "contact" && renderContactEditor(section)}
                {section.type === "testimonials" && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Testimonials editor coming soon. 
                      This section is currently managed automatically.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}