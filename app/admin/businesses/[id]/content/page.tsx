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
  Loader2,
  DollarSign,
  Truck,
  Package,
  ArrowDown,
  ArrowRight,
  FileText,
  CreditCard,
  Clock
} from "lucide-react";
import Link from "next/link";
import { HeroEditor } from "@/components/admin/content-editors/HeroEditor";
import { GalleryEditor } from "@/components/admin/content-editors/GalleryEditor";
import { ExchangeRatesEditor } from "@/components/admin/content-editors/ExchangeRatesEditor";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface ContentSection {
  id: string;
  type: 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'exchangeRates' | 'operations' | 'livestockCategories' | 'regionalImpact' | 'products' | 'process' | 'borrowingProcess' | 'requirements' | 'loanDuration' | 'paymentMethods' | 'loanProducts' | 'terms';
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
  const [addProductOpenId, setAddProductOpenId] = useState<string | null>(null);
  const [addCategoryOpenId, setAddCategoryOpenId] = useState<string | null>(null);
  const [addFoodSecurityPointOpenId, setAddFoodSecurityPointOpenId] = useState<string | null>(null);
  const [addProcessingPointOpenId, setAddProcessingPointOpenId] = useState<string | null>(null);
  const [addWaterProductOpenId, setAddWaterProductOpenId] = useState<string | null>(null);
  const [addProcessStepOpenId, setAddProcessStepOpenId] = useState<string | null>(null);
  const [productSizes, setProductSizes] = useState<string[]>([]);
  const [addRequirementOpenId, setAddRequirementOpenId] = useState<string | null>(null);
  const [addLoanDurationOpenId, setAddLoanDurationOpenId] = useState<string | null>(null);
  const [addPaymentMethodOpenId, setAddPaymentMethodOpenId] = useState<string | null>(null);
  const [addLoanProductOpenId, setAddLoanProductOpenId] = useState<string | null>(null);
  const [requirementDoc, setRequirementDoc] = useState<string>('');
  const [paymentFeature, setPaymentFeature] = useState<string>('');
  const [loanProductFeature, setLoanProductFeature] = useState<string>('');

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
          let fetchedSections = contentResult.data;
          
          // If this is a foreign-exchange template, ensure exchangeRates section exists
          if (businessData?.template === 'foreign-exchange') {
            const exchangeRatesIndex = fetchedSections.findIndex((s: any) => s.type === 'exchangeRates' || s.id === 'exchangeRates');
            if (exchangeRatesIndex === -1) {
              // Add exchangeRates section if it doesn't exist
              fetchedSections.push({
                id: "exchangeRates",
                type: "exchangeRates",
                title: "Exchange Rates",
                isActive: true,
                content: {
                  title: "Today's Rates",
                  description: "Competitive foreign exchange rates available at all our bureau locations.",
                  currencies: []
                }
              });
            } else {
              // Ensure the exchangeRates section has the correct structure
              const exchangeRatesSection = fetchedSections[exchangeRatesIndex];
              if (exchangeRatesSection) {
                // Ensure content structure is correct
                if (!exchangeRatesSection.content) {
                  exchangeRatesSection.content = {};
                }
                if (!Array.isArray(exchangeRatesSection.content.currencies)) {
                  exchangeRatesSection.content.currencies = [];
                }
                if (!exchangeRatesSection.content.title) {
                  exchangeRatesSection.content.title = "Today's Rates";
                }
                if (!exchangeRatesSection.content.description) {
                  exchangeRatesSection.content.description = "Competitive foreign exchange rates available at all our bureau locations.";
                }
              }
            }
          }

          // If this is a micro-finance template, ensure micro-finance-specific sections exist
          if (businessData?.template === 'micro-finance' || businessData?.template === 'lending' || businessData?.template === 'microfinance') {
            // Borrowing Process section
            const borrowingProcessIndex = fetchedSections.findIndex((s: any) => s.type === 'borrowingProcess' || s.id === 'borrowingProcess');
            if (borrowingProcessIndex === -1) {
              fetchedSections.push({
                id: "borrowingProcess",
                type: "borrowingProcess",
                title: "Borrowing Process",
                isActive: true,
                content: {
                  title: "Simple Application Process",
                  description: "Get your loan approved in just a few easy steps.",
                  steps: []
                }
              });
            }

            // Requirements section
            const requirementsIndex = fetchedSections.findIndex((s: any) => s.type === 'requirements' || s.id === 'requirements');
            if (requirementsIndex === -1) {
              fetchedSections.push({
                id: "requirements",
                type: "requirements",
                title: "Requirements",
                isActive: true,
                content: {
                  title: "Requirements to Meet Before Lending",
                  description: "To ensure a smooth application process, please ensure you have the following documents and meet these requirements:",
                  requirements: []
                }
              });
            }

            // Loan Duration section
            const loanDurationIndex = fetchedSections.findIndex((s: any) => s.type === 'loanDuration' || s.id === 'loanDuration');
            if (loanDurationIndex === -1) {
              fetchedSections.push({
                id: "loanDuration",
                type: "loanDuration",
                title: "Loan Duration",
                isActive: true,
                content: {
                  title: "Flexible Loan Duration Options",
                  description: "Choose the repayment period that best fits your financial situation.",
                  options: []
                }
              });
            }

            // Payment Methods section
            const paymentMethodsIndex = fetchedSections.findIndex((s: any) => s.type === 'paymentMethods' || s.id === 'paymentMethods');
            if (paymentMethodsIndex === -1) {
              fetchedSections.push({
                id: "paymentMethods",
                type: "paymentMethods",
                title: "Payment Methods",
                isActive: true,
                content: {
                  title: "Convenient Payment Methods",
                  description: "We offer multiple flexible payment options.",
                  methods: []
                }
              });
            }

            // Loan Products section
            const loanProductsIndex = fetchedSections.findIndex((s: any) => s.type === 'loanProducts' || s.id === 'loanProducts');
            if (loanProductsIndex === -1) {
              fetchedSections.push({
                id: "loanProducts",
                type: "loanProducts",
                title: "Loan Products",
                isActive: true,
                content: {
                  title: "Our Loan Products",
                  description: "We offer a variety of loan products designed to meet different needs.",
                  products: []
                }
              });
            }

            // Terms section
            const termsIndex = fetchedSections.findIndex((s: any) => s.type === 'terms' || s.id === 'terms');
            if (termsIndex === -1) {
              fetchedSections.push({
                id: "terms",
                type: "terms",
                title: "Terms and Conditions",
                isActive: true,
                content: {
                  title: "Terms and Conditions",
                  description: "Please read and understand our terms and conditions before applying for a loan.",
                  terms: []
                }
              });
            }
          }

          // If this is a livestock template, ensure livestock-specific sections exist
          if (businessData?.template === 'livestock') {
            // Operations section
            const operationsIndex = fetchedSections.findIndex((s: any) => s.type === 'operations' || s.id === 'operations');
            if (operationsIndex === -1) {
              fetchedSections.push({
                id: "operations",
                type: "operations",
                title: "Farm Operations",
                isActive: true,
                content: {
                  title: "Sustainable Livestock Excellence",
                  subtitle: "Livestock",
                  description: "Livestock farming for beef and dairy production, supporting regional food security and contributing to local meat processing industries.",
                  farmName: "Cattle Farm",
                  farmType: "Premium Beef & Dairy",
                  products: [],
                  stats: []
                }
              });
            }

            // Livestock Categories section
            const livestockCategoriesIndex = fetchedSections.findIndex((s: any) => s.type === 'livestockCategories' || s.id === 'livestockCategories');
            if (livestockCategoriesIndex === -1) {
              fetchedSections.push({
                id: "livestockCategories",
                type: "livestockCategories",
                title: "Livestock Categories",
                isActive: true,
                content: {
                  title: "Heritage Livestock Excellence",
                  description: "Premium breeds raised with care in natural environments for optimal health and quality, supporting sustainable agriculture.",
                  categories: []
                }
              });
            }

            // Regional Impact section
            const regionalImpactIndex = fetchedSections.findIndex((s: any) => s.type === 'regionalImpact' || s.id === 'regionalImpact');
            if (regionalImpactIndex === -1) {
              fetchedSections.push({
                id: "regionalImpact",
                type: "regionalImpact",
                title: "Regional Impact",
                isActive: true,
                content: {
                  title: "Supporting Regional Food Security",
                  description: "Our livestock operations play a vital role in strengthening regional food systems and contributing to local meat processing industries, ensuring sustainable food security for our communities.",
                  foodSecurityTitle: "Food Security Impact",
                  processingTitle: "Local Processing Partnership",
                  foodSecurityPoints: [],
                  processingPartnershipPoints: [],
                  stats: []
                }
              });
            }
          }

          // If this is a water-production template, ensure water-specific sections exist
          if (businessData?.template === 'water-production') {
            // Products section
            const productsIndex = fetchedSections.findIndex((s: any) => s.type === 'products' || s.id === 'products');
            if (productsIndex === -1) {
              fetchedSections.push({
                id: "products",
                type: "products",
                title: "Products",
                isActive: true,
                content: {
                  title: "PREMIUM WATER SOLUTIONS",
                  subtitle: "Production Line Portfolio",
                  description: "Advanced purification technology meets diverse market demands through our comprehensive product range",
                  products: []
                }
              });
            }

            // Process section
            const processIndex = fetchedSections.findIndex((s: any) => s.type === 'process' || s.id === 'process');
            if (processIndex === -1) {
              fetchedSections.push({
                id: "process",
                type: "process",
                title: "Production Process",
                isActive: true,
                content: {
                  title: "Production Steps",
                  description: "Follow our step-by-step process as each stage descends through our precision production line",
                  steps: []
                }
              });
            }
          }
          
          setSections(fetchedSections);
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

    // Add exchangeRates section for foreign-exchange template
    if (businessData?.template === 'foreign-exchange') {
      defaultSections.push({
        id: "exchangeRates",
        type: "exchangeRates",
        title: "Exchange Rates",
        isActive: true,
        content: {
          title: "Today's Rates",
          description: "Competitive foreign exchange rates available at all our bureau locations.",
          currencies: []
        }
      });
    }

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

  const renderOperationsEditor = (section: ContentSection) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={section.content.title || ''}
            onChange={(e) => {
              const newContent = { ...section.content, title: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Section title"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Subtitle</label>
          <Input
            value={section.content.subtitle || ''}
            onChange={(e) => {
              const newContent = { ...section.content, subtitle: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Section subtitle"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={section.content.description || ''}
          onChange={(e) => {
            const newContent = { ...section.content, description: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Description"
          className="min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Farm Name</label>
          <Input
            value={section.content.farmName || ''}
            onChange={(e) => {
              const newContent = { ...section.content, farmName: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Cattle Farm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Farm Type</label>
          <Input
            value={section.content.farmType || ''}
            onChange={(e) => {
              const newContent = { ...section.content, farmType: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Premium Beef & Dairy"
          />
        </div>
      </div>
      
      {/* Products Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Products</label>
          <Dialog modal={false} open={addProductOpenId === section.id} onOpenChange={(o) => setAddProductOpenId(o ? section.id : null)}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={() => setAddProductOpenId(section.id)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input id="prod-name" placeholder="Product name" />
                  <Input id="prod-category" placeholder="Category (e.g. Beef Products)" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input id="prod-price" placeholder="Price (e.g. $18/lb)" />
                  <Input id="prod-icon" placeholder="Icon name (e.g. Beef, Heart, Award)" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input id="prod-image" placeholder="Image URL" className="flex-1" />
                    <MediaPicker
                      trigger={<Button variant="outline" size="sm">Pick/Upload</Button>}
                      selectionMode="single"
                      acceptedTypes={['image']}
                      onSelect={(media: any) => {
                        const url = media?.url;
                        const input = document.getElementById('prod-image') as HTMLInputElement | null;
                        if (input && url) input.value = url;
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Choose from library or upload</p>
                </div>
                <Textarea id="prod-desc" placeholder="Product description" />
                <div>
                  <label className="text-sm font-medium mb-2 block">Features (one per line)</label>
                  <Textarea id="prod-features" placeholder="Grass-Fed&#10;Local Processing&#10;Premium Cuts" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={async () => {
                  const name = (document.getElementById('prod-name') as HTMLInputElement)?.value?.trim() || '';
                  const category = (document.getElementById('prod-category') as HTMLInputElement)?.value?.trim() || '';
                  const price = (document.getElementById('prod-price') as HTMLInputElement)?.value?.trim() || '';
                  const icon = (document.getElementById('prod-icon') as HTMLInputElement)?.value?.trim() || 'Beef';
                  const image = (document.getElementById('prod-image') as HTMLInputElement)?.value?.trim() || '';
                  const description = (document.getElementById('prod-desc') as HTMLTextAreaElement)?.value?.trim() || '';
                  const featuresText = (document.getElementById('prod-features') as HTMLTextAreaElement)?.value?.trim() || '';
                  const features = featuresText.split('\n').filter(f => f.trim());

                  if (!name) {
                    alert('Product name is required');
                    return;
                  }

                  const newProduct = {
                    name,
                    category,
                    price,
                    icon,
                    image,
                    description,
                    features
                  };

                  const nextProducts = Array.isArray(section.content.products)
                    ? [...section.content.products, newProduct]
                    : [newProduct];

                  const cleanedProducts = nextProducts.filter((p: any) => p?.name?.trim());
                  const newContent = { ...section.content, products: cleanedProducts };

                  setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                  try {
                    await saveSection(section.id, newContent);
                    setAddProductOpenId(null);
                    // Clear form
                    ['prod-name', 'prod-category', 'prod-price', 'prod-icon', 'prod-image', 'prod-desc', 'prod-features'].forEach(id => {
                      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                      if (el) el.value = '';
                    });
                  } catch (e) {
                    console.warn('Failed to persist new product immediately');
                  }
                }}>
                  Save Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {(section.content.products || []).filter((p: any) => p?.name?.trim()).map((product: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Product {index + 1}</div>
                  <Button size="icon" variant="ghost" onClick={() => {
                    const newProducts = (section.content.products || []).filter((_: any, i: number) => i !== index);
                    const newContent = { ...section.content, products: newProducts };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={product.name || ''}
                    onChange={(e) => {
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, name: e.target.value };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Product name"
                  />
                  <Input
                    value={product.category || ''}
                    onChange={(e) => {
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, category: e.target.value };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Category"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={product.price || ''}
                    onChange={(e) => {
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, price: e.target.value };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Price"
                  />
                  <Input
                    value={product.icon || ''}
                    onChange={(e) => {
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, icon: e.target.value };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Icon name"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={product.image || ''}
                    onChange={(e) => {
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, image: e.target.value };
                      const newContent = { ...section.content, products: newProducts };
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
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, image: url };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                  />
                </div>
                <Textarea
                  value={product.description || ''}
                  onChange={(e) => {
                    const newProducts = [...(section.content.products || [])];
                    newProducts[index] = { ...product, description: e.target.value };
                    const newContent = { ...section.content, products: newProducts };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}
                  placeholder="Product description"
                  className="mt-2"
                />
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Features (one per line)</label>
                  <Textarea
                    value={(product.features || []).join('\n')}
                    onChange={(e) => {
                      const features = e.target.value.split('\n').filter(f => f.trim());
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, features };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Feature 1&#10;Feature 2"
                    className="min-h-[60px] text-xs"
                  />
                </div>
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
        Save Operations Section
      </Button>
    </div>
  );

  const renderLivestockCategoriesEditor = (section: ContentSection) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={section.content.title || ''}
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
          value={section.content.description || ''}
          onChange={(e) => {
            const newContent = { ...section.content, description: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Description"
          className="min-h-[100px]"
        />
      </div>
      
      {/* Categories Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Livestock Categories</label>
          <Dialog modal={false} open={addCategoryOpenId === section.id} onOpenChange={(o) => setAddCategoryOpenId(o ? section.id : null)}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={() => setAddCategoryOpenId(section.id)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Livestock Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input id="cat-name" placeholder="Category name (e.g. Beef Cattle)" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input id="cat-image" placeholder="Image URL" className="flex-1" />
                    <MediaPicker
                      trigger={<Button variant="outline" size="sm">Pick/Upload</Button>}
                      selectionMode="single"
                      acceptedTypes={['image']}
                      onSelect={(media: any) => {
                        const url = media?.url;
                        const input = document.getElementById('cat-image') as HTMLInputElement | null;
                        if (input && url) input.value = url;
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Choose from library or upload</p>
                </div>
                <Textarea id="cat-desc" placeholder="Category description" />
                <Input id="cat-specialty" placeholder="Specialty (e.g. Grass-Fed Beef)" />
                <Input id="cat-icon" placeholder="Icon name (e.g. Home, Heart)" />
                <div>
                  <label className="text-sm font-medium mb-2 block">Breeds (one per line)</label>
                  <Textarea id="cat-breeds" placeholder="Angus&#10;Hereford&#10;Charolais" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Features (one per line)</label>
                  <Textarea id="cat-features" placeholder="Grass-Fed&#10;Open Pasture&#10;USDA Certified" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={async () => {
                  const name = (document.getElementById('cat-name') as HTMLInputElement)?.value?.trim() || '';
                  const image = (document.getElementById('cat-image') as HTMLInputElement)?.value?.trim() || '';
                  const description = (document.getElementById('cat-desc') as HTMLTextAreaElement)?.value?.trim() || '';
                  const specialty = (document.getElementById('cat-specialty') as HTMLInputElement)?.value?.trim() || '';
                  const icon = (document.getElementById('cat-icon') as HTMLInputElement)?.value?.trim() || 'Home';
                  const breedsText = (document.getElementById('cat-breeds') as HTMLTextAreaElement)?.value?.trim() || '';
                  const breeds = breedsText.split('\n').filter(b => b.trim());
                  const featuresText = (document.getElementById('cat-features') as HTMLTextAreaElement)?.value?.trim() || '';
                  const features = featuresText.split('\n').filter(f => f.trim());

                  if (!name) {
                    alert('Category name is required');
                    return;
                  }

                  const newCategory = {
                    name,
                    image,
                    description,
                    specialty,
                    icon,
                    breeds,
                    features
                  };

                  const nextCategories = Array.isArray(section.content.categories)
                    ? [...section.content.categories, newCategory]
                    : [newCategory];

                  const cleanedCategories = nextCategories.filter((c: any) => c?.name?.trim());
                  const newContent = { ...section.content, categories: cleanedCategories };

                  setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                  try {
                    await saveSection(section.id, newContent);
                    setAddCategoryOpenId(null);
                    // Clear form
                    ['cat-name', 'cat-image', 'cat-desc', 'cat-specialty', 'cat-icon', 'cat-breeds', 'cat-features'].forEach(id => {
                      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                      if (el) el.value = '';
                    });
                  } catch (e) {
                    console.warn('Failed to persist new category immediately');
                  }
                }}>
                  Save Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {(section.content.categories || []).filter((c: any) => c?.name?.trim()).map((category: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Category {index + 1}</div>
                  <Button size="icon" variant="ghost" onClick={() => {
                    const newCategories = (section.content.categories || []).filter((_: any, i: number) => i !== index);
                    const newContent = { ...section.content, categories: newCategories };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={category.name || ''}
                  onChange={(e) => {
                    const newCategories = [...(section.content.categories || [])];
                    newCategories[index] = { ...category, name: e.target.value };
                    const newContent = { ...section.content, categories: newCategories };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}
                  placeholder="Category name"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={category.specialty || ''}
                    onChange={(e) => {
                      const newCategories = [...(section.content.categories || [])];
                      newCategories[index] = { ...category, specialty: e.target.value };
                      const newContent = { ...section.content, categories: newCategories };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Specialty"
                  />
                  <Input
                    value={category.icon || ''}
                    onChange={(e) => {
                      const newCategories = [...(section.content.categories || [])];
                      newCategories[index] = { ...category, icon: e.target.value };
                      const newContent = { ...section.content, categories: newCategories };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Icon name"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={category.image || ''}
                    onChange={(e) => {
                      const newCategories = [...(section.content.categories || [])];
                      newCategories[index] = { ...category, image: e.target.value };
                      const newContent = { ...section.content, categories: newCategories };
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
                      const newCategories = [...(section.content.categories || [])];
                      newCategories[index] = { ...category, image: url };
                      const newContent = { ...section.content, categories: newCategories };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                  />
                </div>
                <Textarea
                  value={category.description || ''}
                  onChange={(e) => {
                    const newCategories = [...(section.content.categories || [])];
                    newCategories[index] = { ...category, description: e.target.value };
                    const newContent = { ...section.content, categories: newCategories };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}
                  placeholder="Category description"
                  className="mt-2"
                />
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Breeds (one per line)</label>
                  <Textarea
                    value={(category.breeds || []).join('\n')}
                    onChange={(e) => {
                      const breeds = e.target.value.split('\n').filter(b => b.trim());
                      const newCategories = [...(section.content.categories || [])];
                      newCategories[index] = { ...category, breeds };
                      const newContent = { ...section.content, categories: newCategories };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Breed 1&#10;Breed 2"
                    className="min-h-[60px] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Features (one per line)</label>
                  <Textarea
                    value={(category.features || []).join('\n')}
                    onChange={(e) => {
                      const features = e.target.value.split('\n').filter(f => f.trim());
                      const newCategories = [...(section.content.categories || [])];
                      newCategories[index] = { ...category, features };
                      const newContent = { ...section.content, categories: newCategories };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Feature 1&#10;Feature 2"
                    className="min-h-[60px] text-xs"
                  />
                </div>
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
        Save Categories Section
      </Button>
    </div>
  );

  const renderRegionalImpactEditor = (section: ContentSection) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={section.content.title || ''}
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
          value={section.content.description || ''}
          onChange={(e) => {
            const newContent = { ...section.content, description: e.target.value };
            setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
          }}
          placeholder="Description"
          className="min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Food Security Title</label>
          <Input
            value={section.content.foodSecurityTitle || ''}
            onChange={(e) => {
              const newContent = { ...section.content, foodSecurityTitle: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Food Security Impact"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Processing Title</label>
          <Input
            value={section.content.processingTitle || ''}
            onChange={(e) => {
              const newContent = { ...section.content, processingTitle: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Local Processing Partnership"
          />
        </div>
      </div>

      {/* Food Security Points */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Food Security Points</label>
          <Dialog modal={false} open={addFoodSecurityPointOpenId === section.id} onOpenChange={(o) => setAddFoodSecurityPointOpenId(o ? section.id : null)}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={() => setAddFoodSecurityPointOpenId(section.id)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Point
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Food Security Point</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input id="fs-title" placeholder="Point title (e.g. Local Supply Chain)" />
                <Textarea id="fs-desc" placeholder="Point description" className="min-h-[100px]" />
              </div>
              <DialogFooter>
                <Button onClick={async () => {
                  const title = (document.getElementById('fs-title') as HTMLInputElement)?.value?.trim() || '';
                  const description = (document.getElementById('fs-desc') as HTMLTextAreaElement)?.value?.trim() || '';

                  if (!title || !description) {
                    alert('Title and description are required');
                    return;
                  }

                  const newPoint = { title, description };
                  const nextPoints = Array.isArray(section.content.foodSecurityPoints)
                    ? [...section.content.foodSecurityPoints, newPoint]
                    : [newPoint];

                  const newContent = { ...section.content, foodSecurityPoints: nextPoints };
                  setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                  try {
                    await saveSection(section.id, newContent);
                    setAddFoodSecurityPointOpenId(null);
                    (document.getElementById('fs-title') as HTMLInputElement).value = '';
                    (document.getElementById('fs-desc') as HTMLTextAreaElement).value = '';
                  } catch (e) {
                    console.warn('Failed to persist new point immediately');
                  }
                }}>
                  Save Point
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {(section.content.foodSecurityPoints || []).map((point: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Point {index + 1}</div>
                  <Button size="icon" variant="ghost" onClick={() => {
                    const newPoints = (section.content.foodSecurityPoints || []).filter((_: any, i: number) => i !== index);
                    const newContent = { ...section.content, foodSecurityPoints: newPoints };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={point.title || ''}
                  onChange={(e) => {
                    const newPoints = [...(section.content.foodSecurityPoints || [])];
                    newPoints[index] = { ...point, title: e.target.value };
                    const newContent = { ...section.content, foodSecurityPoints: newPoints };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}
                  placeholder="Point title"
                />
                <Textarea
                  value={point.description || ''}
                  onChange={(e) => {
                    const newPoints = [...(section.content.foodSecurityPoints || [])];
                    newPoints[index] = { ...point, description: e.target.value };
                    const newContent = { ...section.content, foodSecurityPoints: newPoints };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}
                  placeholder="Point description"
                  className="min-h-[80px]"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Processing Partnership Points */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Processing Partnership Points</label>
          <Dialog modal={false} open={addProcessingPointOpenId === section.id} onOpenChange={(o) => setAddProcessingPointOpenId(o ? section.id : null)}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={() => setAddProcessingPointOpenId(section.id)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Point
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Processing Partnership Point</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input id="pp-title" placeholder="Point title (e.g. Industry Support)" />
                <Textarea id="pp-desc" placeholder="Point description" className="min-h-[100px]" />
              </div>
              <DialogFooter>
                <Button onClick={async () => {
                  const title = (document.getElementById('pp-title') as HTMLInputElement)?.value?.trim() || '';
                  const description = (document.getElementById('pp-desc') as HTMLTextAreaElement)?.value?.trim() || '';

                  if (!title || !description) {
                    alert('Title and description are required');
                    return;
                  }

                  const newPoint = { title, description };
                  const nextPoints = Array.isArray(section.content.processingPartnershipPoints)
                    ? [...section.content.processingPartnershipPoints, newPoint]
                    : [newPoint];

                  const newContent = { ...section.content, processingPartnershipPoints: nextPoints };
                  setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                  try {
                    await saveSection(section.id, newContent);
                    setAddProcessingPointOpenId(null);
                    (document.getElementById('pp-title') as HTMLInputElement).value = '';
                    (document.getElementById('pp-desc') as HTMLTextAreaElement).value = '';
                  } catch (e) {
                    console.warn('Failed to persist new point immediately');
                  }
                }}>
                  Save Point
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {(section.content.processingPartnershipPoints || []).map((point: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Point {index + 1}</div>
                  <Button size="icon" variant="ghost" onClick={() => {
                    const newPoints = (section.content.processingPartnershipPoints || []).filter((_: any, i: number) => i !== index);
                    const newContent = { ...section.content, processingPartnershipPoints: newPoints };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={point.title || ''}
                  onChange={(e) => {
                    const newPoints = [...(section.content.processingPartnershipPoints || [])];
                    newPoints[index] = { ...point, title: e.target.value };
                    const newContent = { ...section.content, processingPartnershipPoints: newPoints };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}
                  placeholder="Point title"
                />
                <Textarea
                  value={point.description || ''}
                  onChange={(e) => {
                    const newPoints = [...(section.content.processingPartnershipPoints || [])];
                    newPoints[index] = { ...point, description: e.target.value };
                    const newContent = { ...section.content, processingPartnershipPoints: newPoints };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                  }}
                  placeholder="Point description"
                  className="min-h-[80px]"
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
        Save Regional Impact Section
      </Button>
    </div>
  );

  const renderExchangeRatesEditor = (section: ContentSection) => {
    // Ensure content has the correct structure
    const content = {
      title: section.content?.title || '',
      description: section.content?.description || '',
      currencies: Array.isArray(section.content?.currencies) ? section.content.currencies : []
    };
    
    return (
      <ExchangeRatesEditor
        content={content}
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
  };

  const renderProductsEditor = (section: ContentSection) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => {
                const newContent = { ...section.content, title: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="PREMIUM WATER SOLUTIONS"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <Input
              value={section.content.subtitle || ''}
              onChange={(e) => {
                const newContent = { ...section.content, subtitle: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="Production Line Portfolio"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => {
              const newContent = { ...section.content, description: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Description"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Products</label>
            <Dialog modal={false} open={addWaterProductOpenId === section.id} onOpenChange={(o) => {
              setAddWaterProductOpenId(o ? section.id : null);
              if (!o) {
                setProductSizes([]); // Reset sizes when dialog closes
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => {
                  setAddWaterProductOpenId(section.id);
                  setProductSizes([]); // Reset sizes when opening dialog
                }}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input id="prod-category" placeholder="Category (e.g. Bottled Water)" />
                    <Input id="prod-icon" placeholder="Icon (Droplets, Truck, Shield, Users)" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input id="prod-image" placeholder="Image URL" className="flex-1" />
                      <MediaPicker
                        trigger={<Button variant="outline" size="sm">Pick/Upload</Button>}
                        selectionMode="single"
                        acceptedTypes={['image']}
                        onSelect={(media: any) => {
                          const url = media?.url;
                          const input = document.getElementById('prod-image') as HTMLInputElement | null;
                          if (input && url) input.value = url;
                        }}
                      />
                    </div>
                  </div>
                  <Textarea id="prod-desc" placeholder="Product description" />
                  <div>
                    <label className="text-sm font-medium mb-2 block">Available Formats</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input 
                          id="prod-size-input" 
                          placeholder="e.g. 500ml Bottles" 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const sizeInput = e.target as HTMLInputElement;
                              const size = sizeInput?.value?.trim();
                              if (size) {
                                setProductSizes(prev => [...prev, size]);
                                sizeInput.value = '';
                              }
                            }
                          }} 
                        />
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            const sizeInput = document.getElementById('prod-size-input') as HTMLInputElement;
                            const size = sizeInput?.value?.trim();
                            if (size) {
                              setProductSizes(prev => [...prev, size]);
                              sizeInput.value = '';
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {productSizes.map((size: string, sizeIndex: number) => (
                          <div key={sizeIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span>{size}</span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                              onClick={() => {
                                setProductSizes(prev => prev.filter((_, i) => i !== sizeIndex));
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={async () => {
                    const category = (document.getElementById('prod-category') as HTMLInputElement)?.value?.trim() || '';
                    const icon = (document.getElementById('prod-icon') as HTMLInputElement)?.value?.trim() || 'Droplets';
                    const image = (document.getElementById('prod-image') as HTMLInputElement)?.value?.trim() || '';
                    const description = (document.getElementById('prod-desc') as HTMLTextAreaElement)?.value?.trim() || '';
                    const sizes = productSizes;

                    if (!category) {
                      alert('Product category is required');
                      return;
                    }

                    const newProduct = {
                      category,
                      name: category,
                      icon,
                      image: image ? (image.startsWith('http') ? image : { url: image }) : '',
                      description,
                      sizes
                    };

                    const nextProducts = Array.isArray(section.content.products)
                      ? [...section.content.products, newProduct]
                      : [newProduct];

                    const newContent = { ...section.content, products: nextProducts };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                    try {
                      await saveSection(section.id, newContent);
                      setAddWaterProductOpenId(null);
                      setProductSizes([]);
                      ['prod-category', 'prod-icon', 'prod-image', 'prod-desc', 'prod-size-input'].forEach(id => {
                        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                        if (el) el.value = '';
                      });
                    } catch (e) {
                      console.warn('Failed to persist new product immediately');
                    }
                  }}>
                    Save Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 mt-4">
            {(section.content.products || []).map((product: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Product {index + 1}</div>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newProducts = (section.content.products || []).filter((_: any, i: number) => i !== index);
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={product.category || ''}
                      onChange={(e) => {
                        const newProducts = [...(section.content.products || [])];
                        newProducts[index] = { ...product, category: e.target.value, name: e.target.value };
                        const newContent = { ...section.content, products: newProducts };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Category"
                    />
                    <Input
                      value={product.icon || ''}
                      onChange={(e) => {
                        const newProducts = [...(section.content.products || [])];
                        newProducts[index] = { ...product, icon: e.target.value };
                        const newContent = { ...section.content, products: newProducts };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Icon"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={typeof product.image === 'string' ? product.image : (product.image?.url || '')}
                      onChange={(e) => {
                        const newProducts = [...(section.content.products || [])];
                        newProducts[index] = { ...product, image: e.target.value };
                        const newContent = { ...section.content, products: newProducts };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Image URL"
                      className="flex-1"
                    />
                    <MediaPicker
                      trigger={<Button variant="outline" size="sm">Pick</Button>}
                      selectionMode="single"
                      acceptedTypes={['image']}
                      onSelect={(media: any) => {
                        const url = media?.url;
                        const newProducts = [...(section.content.products || [])];
                        newProducts[index] = { ...product, image: url };
                        const newContent = { ...section.content, products: newProducts };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                    />
                  </div>
                  <Textarea
                    value={product.description || ''}
                    onChange={(e) => {
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, description: e.target.value };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Description"
                  />
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Available Formats</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id={`prod-size-input-${index}`}
                          placeholder="e.g. 500ml Bottles"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const sizeInput = e.target as HTMLInputElement;
                              const size = sizeInput?.value?.trim();
                              if (size) {
                                const newProducts = [...(section.content.products || [])];
                                const currentSizes = Array.isArray(newProducts[index].sizes) ? newProducts[index].sizes : [];
                                newProducts[index] = { ...product, sizes: [...currentSizes, size] };
                                const newContent = { ...section.content, products: newProducts };
                                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                                sizeInput.value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const sizeInput = document.getElementById(`prod-size-input-${index}`) as HTMLInputElement;
                            const size = sizeInput?.value?.trim();
                            if (size) {
                              const newProducts = [...(section.content.products || [])];
                              const currentSizes = Array.isArray(newProducts[index].sizes) ? newProducts[index].sizes : [];
                              newProducts[index] = { ...product, sizes: [...currentSizes, size] };
                              const newContent = { ...section.content, products: newProducts };
                              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                              sizeInput.value = '';
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {(Array.isArray(product.sizes) ? product.sizes : []).map((size: string, sizeIndex: number) => (
                          <div key={sizeIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span>{size}</span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newProducts = [...(section.content.products || [])];
                                const currentSizes = Array.isArray(newProducts[index].sizes) ? newProducts[index].sizes : [];
                                currentSizes.splice(sizeIndex, 1);
                                newProducts[index] = { ...product, sizes: currentSizes };
                                const newContent = { ...section.content, products: newProducts };
                                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
          Save Products Section
        </Button>
      </div>
    );
  };

  const renderProcessEditor = (section: ContentSection) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => {
                const newContent = { ...section.content, title: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="Production Steps"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => {
              const newContent = { ...section.content, description: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Description"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Process Steps</label>
            <Dialog modal={false} open={addProcessStepOpenId === section.id} onOpenChange={(o) => setAddProcessStepOpenId(o ? section.id : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setAddProcessStepOpenId(section.id)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Process Step</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input id="step-number" placeholder="Step Number (e.g. 01, 02)" />
                    <Input id="step-icon" placeholder="Icon (Droplets, Shield, Star, Zap)" />
                  </div>
                  <Input id="step-title" placeholder="Step Title" />
                  <Input id="step-subtitle" placeholder="Subtitle (e.g. First Step)" />
                  <Textarea id="step-desc" placeholder="Step description" />
                </div>
                <DialogFooter>
                  <Button onClick={async () => {
                    const number = (document.getElementById('step-number') as HTMLInputElement)?.value?.trim() || '';
                    const icon = (document.getElementById('step-icon') as HTMLInputElement)?.value?.trim() || 'Droplets';
                    const title = (document.getElementById('step-title') as HTMLInputElement)?.value?.trim() || '';
                    const subtitle = (document.getElementById('step-subtitle') as HTMLInputElement)?.value?.trim() || '';
                    const description = (document.getElementById('step-desc') as HTMLTextAreaElement)?.value?.trim() || '';

                    if (!title) {
                      alert('Step title is required');
                      return;
                    }

                    const newStep = {
                      number: number || String((section.content.steps || []).length + 1).padStart(2, '0'),
                      stepNumber: (section.content.steps || []).length + 1,
                      icon,
                      title,
                      subtitle,
                      description
                    };

                    const nextSteps = Array.isArray(section.content.steps)
                      ? [...section.content.steps, newStep]
                      : [newStep];

                    const newContent = { ...section.content, steps: nextSteps };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                    try {
                      await saveSection(section.id, newContent);
                      setAddProcessStepOpenId(null);
                      ['step-number', 'step-icon', 'step-title', 'step-subtitle', 'step-desc'].forEach(id => {
                        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                        if (el) el.value = '';
                      });
                    } catch (e) {
                      console.warn('Failed to persist new step immediately');
                    }
                  }}>
                    Save Step
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 mt-4">
            {(section.content.steps || []).map((step: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Step {index + 1}</div>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newSteps = (section.content.steps || []).filter((_: any, i: number) => i !== index);
                      const newContent = { ...section.content, steps: newSteps };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={step.number || ''}
                      onChange={(e) => {
                        const newSteps = [...(section.content.steps || [])];
                        newSteps[index] = { ...step, number: e.target.value };
                        const newContent = { ...section.content, steps: newSteps };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="01"
                    />
                    <Input
                      value={step.icon || ''}
                      onChange={(e) => {
                        const newSteps = [...(section.content.steps || [])];
                        newSteps[index] = { ...step, icon: e.target.value };
                        const newContent = { ...section.content, steps: newSteps };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Icon"
                    />
                  </div>
                  <Input
                    value={step.title || ''}
                    onChange={(e) => {
                      const newSteps = [...(section.content.steps || [])];
                      newSteps[index] = { ...step, title: e.target.value };
                      const newContent = { ...section.content, steps: newSteps };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Step Title"
                  />
                  <Input
                    value={step.subtitle || ''}
                    onChange={(e) => {
                      const newSteps = [...(section.content.steps || [])];
                      newSteps[index] = { ...step, subtitle: e.target.value };
                      const newContent = { ...section.content, steps: newSteps };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Subtitle"
                  />
                  <Textarea
                    value={step.description || ''}
                    onChange={(e) => {
                      const newSteps = [...(section.content.steps || [])];
                      newSteps[index] = { ...step, description: e.target.value };
                      const newContent = { ...section.content, steps: newSteps };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Description"
                    className="min-h-[80px]"
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
          Save Process Section
        </Button>
      </div>
    );
  };

  const renderBorrowingProcessEditor = (section: ContentSection) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => {
                const newContent = { ...section.content, title: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="Simple Application Process"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => {
              const newContent = { ...section.content, description: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Description"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Process Steps</label>
            <Dialog modal={false} open={addProcessStepOpenId === section.id} onOpenChange={(o) => setAddProcessStepOpenId(o ? section.id : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setAddProcessStepOpenId(section.id)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Process Step</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input id="borrow-step-number" placeholder="Step Number (e.g. 1, 2)" />
                    <Input id="borrow-step-icon" placeholder="Icon (CheckCircle, FileText, Shield, DollarSign)" />
                  </div>
                  <Input id="borrow-step-title" placeholder="Step Title" />
                  <Textarea id="borrow-step-desc" placeholder="Step description" />
                </div>
                <DialogFooter>
                  <Button onClick={async () => {
                    const number = (document.getElementById('borrow-step-number') as HTMLInputElement)?.value?.trim() || '';
                    const icon = (document.getElementById('borrow-step-icon') as HTMLInputElement)?.value?.trim() || 'CheckCircle';
                    const title = (document.getElementById('borrow-step-title') as HTMLInputElement)?.value?.trim() || '';
                    const description = (document.getElementById('borrow-step-desc') as HTMLTextAreaElement)?.value?.trim() || '';

                    if (!title) {
                      alert('Step title is required');
                      return;
                    }

                    const newStep = {
                      number: number || String((section.content.steps || []).length + 1),
                      icon,
                      title,
                      description
                    };

                    const nextSteps = Array.isArray(section.content.steps)
                      ? [...section.content.steps, newStep]
                      : [newStep];

                    const newContent = { ...section.content, steps: nextSteps };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                    try {
                      await saveSection(section.id, newContent);
                      setAddProcessStepOpenId(null);
                      ['borrow-step-number', 'borrow-step-icon', 'borrow-step-title', 'borrow-step-desc'].forEach(id => {
                        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                        if (el) el.value = '';
                      });
                    } catch (e) {
                      console.warn('Failed to persist new step immediately');
                    }
                  }}>
                    Save Step
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 mt-4">
            {(section.content.steps || []).map((step: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Step {index + 1}</div>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newSteps = (section.content.steps || []).filter((_: any, i: number) => i !== index);
                      const newContent = { ...section.content, steps: newSteps };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={step.number || ''}
                      onChange={(e) => {
                        const newSteps = [...(section.content.steps || [])];
                        newSteps[index] = { ...step, number: e.target.value };
                        const newContent = { ...section.content, steps: newSteps };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="1"
                    />
                    <Input
                      value={step.icon || ''}
                      onChange={(e) => {
                        const newSteps = [...(section.content.steps || [])];
                        newSteps[index] = { ...step, icon: e.target.value };
                        const newContent = { ...section.content, steps: newSteps };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Icon"
                    />
                  </div>
                  <Input
                    value={step.title || ''}
                    onChange={(e) => {
                      const newSteps = [...(section.content.steps || [])];
                      newSteps[index] = { ...step, title: e.target.value };
                      const newContent = { ...section.content, steps: newSteps };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Step Title"
                  />
                  <Textarea
                    value={step.description || ''}
                    onChange={(e) => {
                      const newSteps = [...(section.content.steps || [])];
                      newSteps[index] = { ...step, description: e.target.value };
                      const newContent = { ...section.content, steps: newSteps };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Description"
                    className="min-h-[80px]"
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
          Save Borrowing Process Section
        </Button>
      </div>
    );
  };

  const renderRequirementsEditor = (section: ContentSection) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => {
                const newContent = { ...section.content, title: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="Requirements to Meet Before Lending"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => {
              const newContent = { ...section.content, description: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Description"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Requirements</label>
            <Dialog modal={false} open={addRequirementOpenId === section.id} onOpenChange={(o) => setAddRequirementOpenId(o ? section.id : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setAddRequirementOpenId(section.id)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Requirement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Requirement</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input id="req-title" placeholder="Requirement Title" />
                  <Textarea id="req-desc" placeholder="Description" />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="req-required" defaultChecked />
                    <label htmlFor="req-required" className="text-sm">Required</label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Documents (one per line)</label>
                    <Textarea id="req-docs" placeholder="Valid National ID&#10;Bank statements&#10;Proof of income" className="min-h-[100px]" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={async () => {
                    const title = (document.getElementById('req-title') as HTMLInputElement)?.value?.trim() || '';
                    const description = (document.getElementById('req-desc') as HTMLTextAreaElement)?.value?.trim() || '';
                    const required = (document.getElementById('req-required') as HTMLInputElement)?.checked;
                    const docsText = (document.getElementById('req-docs') as HTMLTextAreaElement)?.value?.trim() || '';
                    const documents = docsText.split('\n').filter(d => d.trim()).map(d => d.trim());

                    if (!title) {
                      alert('Requirement title is required');
                      return;
                    }

                    const newRequirement = {
                      title,
                      description,
                      required,
                      documents
                    };

                    const nextRequirements = Array.isArray(section.content.requirements)
                      ? [...section.content.requirements, newRequirement]
                      : [newRequirement];

                    const newContent = { ...section.content, requirements: nextRequirements };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                    try {
                      await saveSection(section.id, newContent);
                      setAddRequirementOpenId(null);
                      ['req-title', 'req-desc', 'req-docs'].forEach(id => {
                        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                        if (el) el.value = '';
                      });
                    } catch (e) {
                      console.warn('Failed to persist new requirement immediately');
                    }
                  }}>
                    Save Requirement
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 mt-4">
            {(section.content.requirements || []).map((req: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Requirement {index + 1}</div>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newRequirements = (section.content.requirements || []).filter((_: any, i: number) => i !== index);
                      const newContent = { ...section.content, requirements: newRequirements };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={req.title || ''}
                    onChange={(e) => {
                      const newRequirements = [...(section.content.requirements || [])];
                      newRequirements[index] = { ...req, title: e.target.value };
                      const newContent = { ...section.content, requirements: newRequirements };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Requirement Title"
                  />
                  <Textarea
                    value={req.description || ''}
                    onChange={(e) => {
                      const newRequirements = [...(section.content.requirements || [])];
                      newRequirements[index] = { ...req, description: e.target.value };
                      const newContent = { ...section.content, requirements: newRequirements };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Description"
                    className="min-h-[80px]"
                  />
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={req.required !== false}
                      onChange={(e) => {
                        const newRequirements = [...(section.content.requirements || [])];
                        newRequirements[index] = { ...req, required: e.target.checked };
                        const newContent = { ...section.content, requirements: newRequirements };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                    />
                    <label className="text-sm">Required</label>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Documents</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id={`req-doc-input-${index}`}
                          placeholder="Document name"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const docInput = e.target as HTMLInputElement;
                              const doc = docInput?.value?.trim();
                              if (doc) {
                                const newRequirements = [...(section.content.requirements || [])];
                                const currentDocs = Array.isArray(newRequirements[index].documents) ? newRequirements[index].documents : [];
                                newRequirements[index] = { ...req, documents: [...currentDocs, doc] };
                                const newContent = { ...section.content, requirements: newRequirements };
                                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                                docInput.value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const docInput = document.getElementById(`req-doc-input-${index}`) as HTMLInputElement;
                            const doc = docInput?.value?.trim();
                            if (doc) {
                              const newRequirements = [...(section.content.requirements || [])];
                              const currentDocs = Array.isArray(newRequirements[index].documents) ? newRequirements[index].documents : [];
                              newRequirements[index] = { ...req, documents: [...currentDocs, doc] };
                              const newContent = { ...section.content, requirements: newRequirements };
                              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                              docInput.value = '';
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {(Array.isArray(req.documents) ? req.documents : []).map((doc: string, docIndex: number) => (
                          <div key={docIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span>{doc}</span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newRequirements = [...(section.content.requirements || [])];
                                const currentDocs = Array.isArray(newRequirements[index].documents) ? newRequirements[index].documents : [];
                                currentDocs.splice(docIndex, 1);
                                newRequirements[index] = { ...req, documents: currentDocs };
                                const newContent = { ...section.content, requirements: newRequirements };
                                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
          Save Requirements Section
        </Button>
      </div>
    );
  };

  const renderLoanDurationEditor = (section: ContentSection) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => {
                const newContent = { ...section.content, title: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="Flexible Loan Duration Options"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => {
              const newContent = { ...section.content, description: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Description"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Loan Duration Options</label>
            <Dialog modal={false} open={addLoanDurationOpenId === section.id} onOpenChange={(o) => setAddLoanDurationOpenId(o ? section.id : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setAddLoanDurationOpenId(section.id)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Duration Option
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Loan Duration Option</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input id="duration-period" placeholder="Duration (e.g. 3 Months, 6 Months)" />
                  <Textarea id="duration-desc" placeholder="Description" />
                  <div className="grid grid-cols-3 gap-3">
                    <Input id="duration-interest" placeholder="Interest Rate (e.g. 5% per month)" />
                    <Input id="duration-min" placeholder="Min Amount (e.g. $500)" />
                    <Input id="duration-max" placeholder="Max Amount (e.g. $5,000)" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={async () => {
                    const duration = (document.getElementById('duration-period') as HTMLInputElement)?.value?.trim() || '';
                    const description = (document.getElementById('duration-desc') as HTMLTextAreaElement)?.value?.trim() || '';
                    const interestRate = (document.getElementById('duration-interest') as HTMLInputElement)?.value?.trim() || '';
                    const minAmount = (document.getElementById('duration-min') as HTMLInputElement)?.value?.trim() || '';
                    const maxAmount = (document.getElementById('duration-max') as HTMLInputElement)?.value?.trim() || '';

                    if (!duration) {
                      alert('Duration is required');
                      return;
                    }

                    const newOption = {
                      duration,
                      description,
                      interestRate,
                      minAmount,
                      maxAmount
                    };

                    const nextOptions = Array.isArray(section.content.options)
                      ? [...section.content.options, newOption]
                      : [newOption];

                    const newContent = { ...section.content, options: nextOptions };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                    try {
                      await saveSection(section.id, newContent);
                      setAddLoanDurationOpenId(null);
                      ['duration-period', 'duration-desc', 'duration-interest', 'duration-min', 'duration-max'].forEach(id => {
                        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                        if (el) el.value = '';
                      });
                    } catch (e) {
                      console.warn('Failed to persist new option immediately');
                    }
                  }}>
                    Save Option
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 mt-4">
            {(section.content.options || []).map((option: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Option {index + 1}</div>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newOptions = (section.content.options || []).filter((_: any, i: number) => i !== index);
                      const newContent = { ...section.content, options: newOptions };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={option.duration || ''}
                    onChange={(e) => {
                      const newOptions = [...(section.content.options || [])];
                      newOptions[index] = { ...option, duration: e.target.value };
                      const newContent = { ...section.content, options: newOptions };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Duration"
                  />
                  <Textarea
                    value={option.description || ''}
                    onChange={(e) => {
                      const newOptions = [...(section.content.options || [])];
                      newOptions[index] = { ...option, description: e.target.value };
                      const newContent = { ...section.content, options: newOptions };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Description"
                    className="min-h-[80px]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      value={option.interestRate || ''}
                      onChange={(e) => {
                        const newOptions = [...(section.content.options || [])];
                        newOptions[index] = { ...option, interestRate: e.target.value };
                        const newContent = { ...section.content, options: newOptions };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Interest Rate"
                    />
                    <Input
                      value={option.minAmount || ''}
                      onChange={(e) => {
                        const newOptions = [...(section.content.options || [])];
                        newOptions[index] = { ...option, minAmount: e.target.value };
                        const newContent = { ...section.content, options: newOptions };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Min Amount"
                    />
                    <Input
                      value={option.maxAmount || ''}
                      onChange={(e) => {
                        const newOptions = [...(section.content.options || [])];
                        newOptions[index] = { ...option, maxAmount: e.target.value };
                        const newContent = { ...section.content, options: newOptions };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Max Amount"
                    />
                  </div>
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
          Save Loan Duration Section
        </Button>
      </div>
    );
  };

  const renderPaymentMethodsEditor = (section: ContentSection) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => {
                const newContent = { ...section.content, title: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="Convenient Payment Methods"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => {
              const newContent = { ...section.content, description: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Description"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Payment Methods</label>
            <Dialog modal={false} open={addPaymentMethodOpenId === section.id} onOpenChange={(o) => setAddPaymentMethodOpenId(o ? section.id : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setAddPaymentMethodOpenId(section.id)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input id="payment-name" placeholder="Method Name" />
                    <Input id="payment-icon" placeholder="Icon (CreditCard, Clock, DollarSign)" />
                  </div>
                  <Textarea id="payment-desc" placeholder="Description" />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Features (one per line)</label>
                    <Textarea id="payment-features" placeholder="Online banking&#10;Mobile banking&#10;24/7 availability" className="min-h-[100px]" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={async () => {
                    const name = (document.getElementById('payment-name') as HTMLInputElement)?.value?.trim() || '';
                    const icon = (document.getElementById('payment-icon') as HTMLInputElement)?.value?.trim() || 'CreditCard';
                    const description = (document.getElementById('payment-desc') as HTMLTextAreaElement)?.value?.trim() || '';
                    const featuresText = (document.getElementById('payment-features') as HTMLTextAreaElement)?.value?.trim() || '';
                    const features = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());

                    if (!name) {
                      alert('Payment method name is required');
                      return;
                    }

                    const newMethod = {
                      name,
                      icon,
                      description,
                      features
                    };

                    const nextMethods = Array.isArray(section.content.methods)
                      ? [...section.content.methods, newMethod]
                      : [newMethod];

                    const newContent = { ...section.content, methods: nextMethods };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                    try {
                      await saveSection(section.id, newContent);
                      setAddPaymentMethodOpenId(null);
                      ['payment-name', 'payment-icon', 'payment-desc', 'payment-features'].forEach(id => {
                        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                        if (el) el.value = '';
                      });
                    } catch (e) {
                      console.warn('Failed to persist new method immediately');
                    }
                  }}>
                    Save Method
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 mt-4">
            {(section.content.methods || []).map((method: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Method {index + 1}</div>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newMethods = (section.content.methods || []).filter((_: any, i: number) => i !== index);
                      const newContent = { ...section.content, methods: newMethods };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={method.name || ''}
                      onChange={(e) => {
                        const newMethods = [...(section.content.methods || [])];
                        newMethods[index] = { ...method, name: e.target.value };
                        const newContent = { ...section.content, methods: newMethods };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Method Name"
                    />
                    <Input
                      value={method.icon || ''}
                      onChange={(e) => {
                        const newMethods = [...(section.content.methods || [])];
                        newMethods[index] = { ...method, icon: e.target.value };
                        const newContent = { ...section.content, methods: newMethods };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Icon"
                    />
                  </div>
                  <Textarea
                    value={method.description || ''}
                    onChange={(e) => {
                      const newMethods = [...(section.content.methods || [])];
                      newMethods[index] = { ...method, description: e.target.value };
                      const newContent = { ...section.content, methods: newMethods };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Description"
                    className="min-h-[80px]"
                  />
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Features</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id={`payment-feature-input-${index}`}
                          placeholder="Feature name"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const featureInput = e.target as HTMLInputElement;
                              const feature = featureInput?.value?.trim();
                              if (feature) {
                                const newMethods = [...(section.content.methods || [])];
                                const currentFeatures = Array.isArray(newMethods[index].features) ? newMethods[index].features : [];
                                newMethods[index] = { ...method, features: [...currentFeatures, feature] };
                                const newContent = { ...section.content, methods: newMethods };
                                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                                featureInput.value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const featureInput = document.getElementById(`payment-feature-input-${index}`) as HTMLInputElement;
                            const feature = featureInput?.value?.trim();
                            if (feature) {
                              const newMethods = [...(section.content.methods || [])];
                              const currentFeatures = Array.isArray(newMethods[index].features) ? newMethods[index].features : [];
                              newMethods[index] = { ...method, features: [...currentFeatures, feature] };
                              const newContent = { ...section.content, methods: newMethods };
                              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                              featureInput.value = '';
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {(Array.isArray(method.features) ? method.features : []).map((feature: string, featureIndex: number) => (
                          <div key={featureIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span>{feature}</span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newMethods = [...(section.content.methods || [])];
                                const currentFeatures = Array.isArray(newMethods[index].features) ? newMethods[index].features : [];
                                currentFeatures.splice(featureIndex, 1);
                                newMethods[index] = { ...method, features: currentFeatures };
                                const newContent = { ...section.content, methods: newMethods };
                                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
          Save Payment Methods Section
        </Button>
      </div>
    );
  };

  const renderLoanProductsEditor = (section: ContentSection) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => {
                const newContent = { ...section.content, title: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="Our Loan Products"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => {
              const newContent = { ...section.content, description: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Description"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Loan Products</label>
            <Dialog modal={false} open={addLoanProductOpenId === section.id} onOpenChange={(o) => setAddLoanProductOpenId(o ? section.id : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setAddLoanProductOpenId(section.id)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Loan Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Loan Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input id="loan-product-name" placeholder="Product Name" />
                  <Textarea id="loan-product-desc" placeholder="Description" />
                  <div className="grid grid-cols-3 gap-3">
                    <Input id="loan-product-interest" placeholder="Interest Rate" />
                    <Input id="loan-product-min" placeholder="Min Amount" />
                    <Input id="loan-product-max" placeholder="Max Amount" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Features (one per line)</label>
                    <Textarea id="loan-product-features" placeholder="No collateral required&#10;Quick approval&#10;Flexible repayment" className="min-h-[100px]" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={async () => {
                    const name = (document.getElementById('loan-product-name') as HTMLInputElement)?.value?.trim() || '';
                    const description = (document.getElementById('loan-product-desc') as HTMLTextAreaElement)?.value?.trim() || '';
                    const interestRate = (document.getElementById('loan-product-interest') as HTMLInputElement)?.value?.trim() || '';
                    const minAmount = (document.getElementById('loan-product-min') as HTMLInputElement)?.value?.trim() || '';
                    const maxAmount = (document.getElementById('loan-product-max') as HTMLInputElement)?.value?.trim() || '';
                    const featuresText = (document.getElementById('loan-product-features') as HTMLTextAreaElement)?.value?.trim() || '';
                    const features = featuresText.split('\n').filter(f => f.trim()).map(f => f.trim());

                    if (!name) {
                      alert('Product name is required');
                      return;
                    }

                    const newProduct = {
                      name,
                      description,
                      interestRate,
                      minAmount,
                      maxAmount,
                      features
                    };

                    const nextProducts = Array.isArray(section.content.products)
                      ? [...section.content.products, newProduct]
                      : [newProduct];

                    const newContent = { ...section.content, products: nextProducts };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));

                    try {
                      await saveSection(section.id, newContent);
                      setAddLoanProductOpenId(null);
                      ['loan-product-name', 'loan-product-desc', 'loan-product-interest', 'loan-product-min', 'loan-product-max', 'loan-product-features'].forEach(id => {
                        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
                        if (el) el.value = '';
                      });
                    } catch (e) {
                      console.warn('Failed to persist new product immediately');
                    }
                  }}>
                    Save Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-3 mt-4">
            {(section.content.products || []).map((product: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Product {index + 1}</div>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newProducts = (section.content.products || []).filter((_: any, i: number) => i !== index);
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={product.name || ''}
                    onChange={(e) => {
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, name: e.target.value };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Product Name"
                  />
                  <Textarea
                    value={product.description || ''}
                    onChange={(e) => {
                      const newProducts = [...(section.content.products || [])];
                      newProducts[index] = { ...product, description: e.target.value };
                      const newContent = { ...section.content, products: newProducts };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}
                    placeholder="Description"
                    className="min-h-[80px]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      value={product.interestRate || ''}
                      onChange={(e) => {
                        const newProducts = [...(section.content.products || [])];
                        newProducts[index] = { ...product, interestRate: e.target.value };
                        const newContent = { ...section.content, products: newProducts };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Interest Rate"
                    />
                    <Input
                      value={product.minAmount || ''}
                      onChange={(e) => {
                        const newProducts = [...(section.content.products || [])];
                        newProducts[index] = { ...product, minAmount: e.target.value };
                        const newContent = { ...section.content, products: newProducts };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Min Amount"
                    />
                    <Input
                      value={product.maxAmount || ''}
                      onChange={(e) => {
                        const newProducts = [...(section.content.products || [])];
                        newProducts[index] = { ...product, maxAmount: e.target.value };
                        const newContent = { ...section.content, products: newProducts };
                        setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                      }}
                      placeholder="Max Amount"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Features</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id={`loan-product-feature-input-${index}`}
                          placeholder="Feature name"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const featureInput = e.target as HTMLInputElement;
                              const feature = featureInput?.value?.trim();
                              if (feature) {
                                const newProducts = [...(section.content.products || [])];
                                const currentFeatures = Array.isArray(newProducts[index].features) ? newProducts[index].features : [];
                                newProducts[index] = { ...product, features: [...currentFeatures, feature] };
                                const newContent = { ...section.content, products: newProducts };
                                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                                featureInput.value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const featureInput = document.getElementById(`loan-product-feature-input-${index}`) as HTMLInputElement;
                            const feature = featureInput?.value?.trim();
                            if (feature) {
                              const newProducts = [...(section.content.products || [])];
                              const currentFeatures = Array.isArray(newProducts[index].features) ? newProducts[index].features : [];
                              newProducts[index] = { ...product, features: [...currentFeatures, feature] };
                              const newContent = { ...section.content, products: newProducts };
                              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                              featureInput.value = '';
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {(Array.isArray(product.features) ? product.features : []).map((feature: string, featureIndex: number) => (
                          <div key={featureIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                            <span>{feature}</span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newProducts = [...(section.content.products || [])];
                                const currentFeatures = Array.isArray(newProducts[index].features) ? newProducts[index].features : [];
                                currentFeatures.splice(featureIndex, 1);
                                newProducts[index] = { ...product, features: currentFeatures };
                                const newContent = { ...section.content, products: newProducts };
                                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
          Save Loan Products Section
        </Button>
      </div>
    );
  };

  const renderTermsEditor = (section: ContentSection) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => {
                const newContent = { ...section.content, title: e.target.value };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
              }}
              placeholder="Terms and Conditions"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={section.content.description || ''}
            onChange={(e) => {
              const newContent = { ...section.content, description: e.target.value };
              setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
            }}
            placeholder="Description"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Terms</label>
            <Button size="sm" variant="outline" onClick={() => {
              const termInput = document.getElementById('term-input') as HTMLInputElement;
              const term = termInput?.value?.trim();
              if (term) {
                const nextTerms = Array.isArray(section.content.terms)
                  ? [...section.content.terms, term]
                  : [term];
                const newContent = { ...section.content, terms: nextTerms };
                setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                termInput.value = '';
              }
            }}>
              <Plus className="w-4 h-4 mr-1" />
              Add Term
            </Button>
          </div>
          <div className="space-y-2 mb-4">
            <Input
              id="term-input"
              placeholder="Enter a term or condition"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const termInput = e.target as HTMLInputElement;
                  const term = termInput?.value?.trim();
                  if (term) {
                    const nextTerms = Array.isArray(section.content.terms)
                      ? [...section.content.terms, term]
                      : [term];
                    const newContent = { ...section.content, terms: nextTerms };
                    setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    termInput.value = '';
                  }
                }
              }}
            />
          </div>
          <div className="space-y-3 mt-4">
            {(section.content.terms || []).map((term: any, index: number) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {typeof term === 'string' ? (
                        <p className="text-sm">{term}</p>
                      ) : (
                        <>
                          {term.title && <h4 className="font-medium mb-1">{term.title}</h4>}
                          <p className="text-sm text-muted-foreground">{term.description || term.text}</p>
                        </>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => {
                      const newTerms = (section.content.terms || []).filter((_: any, i: number) => i !== index);
                      const newContent = { ...section.content, terms: newTerms };
                      setSections(prev => prev.map(s => s.id === section.id ? { ...s, content: newContent } : s));
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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
          Save Terms Section
        </Button>
      </div>
    );
  };

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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full gap-x-2 gap-y-3 ${
          business?.template === 'foreign-exchange' ? 'grid-cols-7' : 
          business?.template === 'livestock' ? 'grid-cols-9' : 
          business?.template === 'water-production' ? 'grid-cols-8' :
          (business?.template === 'micro-finance' || business?.template === 'lending' || business?.template === 'microfinance') ? 'grid-cols-9' :
          'grid-cols-6'
        }`}>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Hero
          </TabsTrigger>
          {business?.template === 'livestock' && (
            <>
              <TabsTrigger value="operations" className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Operations
              </TabsTrigger>
              <TabsTrigger value="livestockCategories" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Categories
              </TabsTrigger>
            </>
          )}
          {business?.template === 'water-production' && (
            <>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="process" className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4" />
                Process
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="about" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Services
          </TabsTrigger>
          {business?.template === 'foreign-exchange' && (
            <TabsTrigger value="exchangeRates" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Exchange Rates
            </TabsTrigger>
          )}
          {business?.template === 'livestock' && (
            <TabsTrigger value="regionalImpact" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Impact
            </TabsTrigger>
          )}
          {(business?.template === 'micro-finance' || business?.template === 'lending' || business?.template === 'microfinance') && (
            <>
              <TabsTrigger value="borrowingProcess" className="flex items-center gap-2 leading-relaxed">
                <ArrowRight className="w-4 h-4" />
                Borrowing Process
              </TabsTrigger>
              <TabsTrigger value="requirements" className="flex items-center gap-2 leading-relaxed">
                <FileText className="w-4 h-4" />
                Requirements
              </TabsTrigger>
              <TabsTrigger value="loanDuration" className="flex items-center gap-2 leading-relaxed">
                <Clock className="w-4 h-4" />
                Loan Duration
              </TabsTrigger>
              <TabsTrigger value="paymentMethods" className="flex items-center gap-2 leading-relaxed">
                <CreditCard className="w-4 h-4" />
                Payment Methods
              </TabsTrigger>
              <TabsTrigger value="loanProducts" className="flex items-center gap-2 leading-relaxed">
                <DollarSign className="w-4 h-4" />
                Loan Products
              </TabsTrigger>
              <TabsTrigger value="terms" className="flex items-center gap-2 leading-relaxed">
                <FileText className="w-4 h-4" />
                Terms
              </TabsTrigger>
            </>
          )}
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

        {sections.map((section) => {
          // Only render TabsContent for sections that should be visible
          if (section.type === "exchangeRates" && business?.template !== 'foreign-exchange') {
            return null;
          }
          if ((section.type === "operations" || section.type === "livestockCategories" || section.type === "regionalImpact") && business?.template !== 'livestock') {
            return null;
          }
          if ((section.type === "products" || section.type === "process") && business?.template !== 'water-production') {
            return null;
          }
          if ((section.type === "borrowingProcess" || section.type === "requirements" || section.type === "loanDuration" || section.type === "paymentMethods" || section.type === "loanProducts" || section.type === "terms") && business?.template !== 'micro-finance' && business?.template !== 'lending' && business?.template !== 'microfinance') {
            return null;
          }
          
          return (
            <TabsContent key={section.id} value={section.type} className="mt-12">
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 leading-relaxed">
                        {section.title}
                        <Badge variant={section.isActive ? "default" : "secondary"}>
                          {section.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Customize the {section.type} section content
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {section.type === "hero" && renderHeroEditor(section)}
                  {section.type === "about" && renderAboutEditor(section)}
                  {section.type === "services" && renderServicesEditor(section)}
                  {section.type === "exchangeRates" && renderExchangeRatesEditor(section)}
                  {section.type === "gallery" && renderGalleryEditor(section)}
                  {section.type === "contact" && renderContactEditor(section)}
                  {section.type === "operations" && renderOperationsEditor(section)}
                  {section.type === "livestockCategories" && renderLivestockCategoriesEditor(section)}
                  {section.type === "regionalImpact" && renderRegionalImpactEditor(section)}
                  {section.type === "products" && renderProductsEditor(section)}
                  {section.type === "process" && renderProcessEditor(section)}
                  {section.type === "borrowingProcess" && renderBorrowingProcessEditor(section)}
                  {section.type === "requirements" && renderRequirementsEditor(section)}
                  {section.type === "loanDuration" && renderLoanDurationEditor(section)}
                  {section.type === "paymentMethods" && renderPaymentMethodsEditor(section)}
                  {section.type === "loanProducts" && renderLoanProductsEditor(section)}
                  {section.type === "terms" && renderTermsEditor(section)}
                  {section.type === "testimonials" && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Testimonials editor coming soon. 
                        This section is currently managed automatically.
                      </AlertDescription>
                    </Alert>
                  )}
                  {!["hero", "about", "services", "exchangeRates", "gallery", "products", "process", "contact", "testimonials", "operations", "livestockCategories", "regionalImpact", "borrowingProcess", "requirements", "loanDuration", "paymentMethods", "loanProducts", "terms"].includes(section.type) && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No editor available for section type: {section.type}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}