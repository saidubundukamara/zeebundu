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

interface ContentSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact';
  title: string;
  content: any;
  isActive: boolean;
}

export default function BusinessContentPage() {
  const params = useParams();
  const businessId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [business, setBusiness] = useState<any>(null);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    fetchBusinessContent();
  }, [businessId]);

  const fetchBusinessContent = async () => {
    try {
      // Mock data for now
      const mockBusiness = {
        id: businessId,
        name: "QuickFuel Express",
        slug: "quickfuel-express",
        template: "gas-station",
      };

      const mockSections: ContentSection[] = [
        {
          id: "hero",
          type: "hero",
          title: "Hero Section",
          isActive: true,
          content: {
            headline: "Premium Fuel & Quality Service",
            subheadline: "Your trusted partner for quality fuel and exceptional automotive services",
            buttonText: "Visit Us Today",
            buttonLink: "#contact",
            backgroundImage: "/images/gas-station-hero.jpg",
          }
        },
        {
          id: "about",
          type: "about",
          title: "About Section",
          isActive: true,
          content: {
            title: "About QuickFuel Express",
            description: "For over 20 years, QuickFuel Express has been serving the community with premium gasoline, diesel, and comprehensive automotive services. We pride ourselves on cleanliness, safety, and customer satisfaction.",
            features: [
              "Premium fuel grades",
              "24/7 convenience store",
              "Professional car wash",
              "Automotive maintenance"
            ],
            stats: [
              { label: "Years in Business", value: "20+" },
              { label: "Happy Customers", value: "50,000+" },
              { label: "Fuel Quality", value: "Premium" },
              { label: "Service Rating", value: "5-Star" }
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
            description: "Complete automotive solutions for your convenience",
            services: [
              {
                name: "Premium Fuel",
                description: "High-quality gasoline and diesel fuel",
                icon: "fuel",
                features: ["Regular", "Premium", "Diesel", "Ethanol-free"]
              },
              {
                name: "Car Wash",
                description: "Professional automated car wash services",
                icon: "wash",
                features: ["Basic wash", "Premium detail", "Wax service", "Interior cleaning"]
              },
              {
                name: "Convenience Store",
                description: "24/7 convenience store with essentials",
                icon: "store",
                features: ["Snacks & drinks", "Automotive supplies", "Personal care", "Hot food"]
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
            title: "Our Facility",
            images: [
              { url: "/images/gallery/station-front.jpg", alt: "Station front view", caption: "Modern facilities" },
              { url: "/images/gallery/car-wash.jpg", alt: "Car wash bay", caption: "Professional car wash" },
              { url: "/images/gallery/convenience-store.jpg", alt: "Store interior", caption: "24/7 convenience store" },
              { url: "/images/gallery/fuel-pumps.jpg", alt: "Fuel pumps", caption: "State-of-the-art pumps" }
            ]
          }
        },
        {
          id: "testimonials",
          type: "testimonials",
          title: "Testimonials Section",
          isActive: true,
          content: {
            title: "What Our Customers Say",
            testimonials: [
              {
                id: "1",
                name: "John Smith",
                rating: 5,
                comment: "Best gas station in town! Clean facilities and friendly staff.",
                date: "2024-01-15"
              },
              {
                id: "2",
                name: "Sarah Johnson",
                rating: 5,
                comment: "Love the car wash service. My car always looks brand new!",
                date: "2024-01-10"
              },
              {
                id: "3",
                name: "Mike Wilson",
                rating: 5,
                comment: "Convenient location and great prices. Highly recommended!",
                date: "2024-01-08"
              }
            ]
          }
        },
        {
          id: "contact",
          type: "contact",
          title: "Contact Section",
          isActive: true,
          content: {
            title: "Visit Us Today",
            address: "123 Main Street, Springfield, CA 90210",
            phone: "(555) 123-4567",
            email: "contact@quickfuel.com",
            hours: {
              "Monday - Friday": "6:00 AM - 11:00 PM",
              "Saturday": "7:00 AM - 11:00 PM",
              "Sunday": "8:00 AM - 10:00 PM"
            },
            socialMedia: {
              facebook: "https://facebook.com/quickfuel",
              instagram: "@quickfuelexpress",
              twitter: "@quickfuel"
            }
          }
        }
      ];

      setBusiness(mockBusiness);
      setSections(mockSections);
    } catch (error) {
      console.error("Error fetching business content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSection = async (sectionId: string, content: any) => {
    setIsSaving(true);
    try {
      // Update local state
      setSections(prev => prev.map(section => 
        section.id === sectionId ? { ...section, content } : section
      ));

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Saved section:", sectionId, content);
    } catch (error) {
      console.error("Error saving section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderHeroEditor = (section: ContentSection) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Headline</label>
        <Input
          value={section.content.headline}
          onChange={(e) => {
            const newContent = { ...section.content, headline: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Enter headline"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Subheadline</label>
        <Textarea
          value={section.content.subheadline}
          onChange={(e) => {
            const newContent = { ...section.content, subheadline: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Enter subheadline"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Button Text</label>
          <Input
            value={section.content.buttonText}
            onChange={(e) => {
              const newContent = { ...section.content, buttonText: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Button text"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Button Link</label>
          <Input
            value={section.content.buttonLink}
            onChange={(e) => {
              const newContent = { ...section.content, buttonLink: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Button link"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Background Image URL</label>
        <Input
          value={section.content.backgroundImage}
          onChange={(e) => {
            const newContent = { ...section.content, backgroundImage: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Image URL"
        />
      </div>
      <Button 
        onClick={() => saveSection(section.id, section.content)}
        disabled={isSaving}
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Hero Section
      </Button>
    </div>
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
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Service
          </Button>
        </div>
        <div className="space-y-3">
          {section.content.services.map((service: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={service.name}
                    onChange={(e) => {
                      const newServices = [...section.content.services];
                      newServices[index] = { ...service, name: e.target.value };
                      const newContent = { ...section.content, services: newServices };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Service name"
                  />
                  <Input
                    value={service.icon}
                    onChange={(e) => {
                      const newServices = [...section.content.services];
                      newServices[index] = { ...service, icon: e.target.value };
                      const newContent = { ...section.content, services: newServices };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Icon name"
                  />
                </div>
                <Textarea
                  value={service.description}
                  onChange={(e) => {
                    const newServices = [...section.content.services];
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
        onClick={() => saveSection(section.id, section.content)}
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
                {section.type === "contact" && renderContactEditor(section)}
                {(section.type === "gallery" || section.type === "testimonials") && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {section.type === "gallery" ? "Gallery" : "Testimonials"} editor coming soon. 
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