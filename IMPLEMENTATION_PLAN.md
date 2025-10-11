# Multi-Business Website with CMS - Implementation Plan

## Table of Contents
1. [Project Overview](#project-overview)
2. [Database Design](#database-design)
3. [Frontend Architecture](#frontend-architecture)
4. [CMS Admin Panel](#cms-admin-panel)
5. [API Design](#api-design)
6. [Business Templates](#business-templates)
7. [Development Workflow](#development-workflow)
8. [Technical Specifications](#technical-specifications)
9. [Getting Started](#getting-started)
10. [Future Enhancements](#future-enhancements)

---

## Project Overview

### Goal
Build a scalable multi-business website where:
- **Frontend engineers** create business page templates
- **Admins** manage content through a CMS interface
- **Dynamic routing** serves business-specific content
- **Centralized management** for 15+ business verticals

### Architecture Summary
- **Frontend**: Next.js 14 with App Router (SSR/SSG)
- **Backend**: Next.js API routes + MongoDB
- **CMS**: Custom admin panel for content management
- **Database**: MongoDB with flexible content schemas
- **Deployment**: Vercel + MongoDB Atlas

---

## Database Design

### 1. Businesses Collection
```javascript
{
  _id: ObjectId,
  name: "Shell Gas Station",
  slug: "shell-gas-station", 
  industry: "petroleum",
  template: "gas-station", // matches component name
  status: "active" | "inactive" | "draft",
  branding: {
    primaryColor: "#FF6B35",
    secondaryColor: "#2E8B57", 
    logo: "https://cdn.example.com/logos/shell.png",
    favicon: "https://cdn.example.com/favicons/shell.ico",
    font: "Inter" // Google Font name
  },
  seo: {
    metaTitle: "Shell Gas Station - Premium Fuel Services",
    metaDescription: "Quality fuel and convenience services...",
    keywords: ["gas", "fuel", "petroleum", "convenience"],
    ogImage: "https://cdn.example.com/og/shell.jpg"
  },
  contact: {
    phone: "+1-555-0123",
    email: "info@shell-gas.com",
    address: "123 Main St, City, State 12345",
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  socialMedia: {
    facebook: "https://facebook.com/shell-gas",
    instagram: "https://instagram.com/shell-gas",
    twitter: "https://twitter.com/shell-gas",
    linkedin: "https://linkedin.com/company/shell-gas"
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Business Content Collection
```javascript
{
  _id: ObjectId,
  businessId: ObjectId, // references businesses collection
  section: "hero" | "about" | "services" | "gallery" | "testimonials" | "contact" | "team",
  content: {
    // Hero Section Structure
    hero: {
      title: "Premium Fuel Services",
      subtitle: "Quality you can trust, service you deserve",
      backgroundImage: "https://cdn.example.com/hero/gas-station.jpg",
      backgroundVideo: "https://cdn.example.com/videos/gas-station.mp4", // optional
      ctaButtons: [
        {
          text: "Visit Us Today",
          link: "/contact",
          style: "primary"
        },
        {
          text: "View Services",
          link: "/services", 
          style: "secondary"
        }
      ],
      badges: ["24/7 Open", "Premium Fuel", "Clean Facilities"]
    },
    
    // About Section Structure
    about: {
      title: "About Our Station",
      description: "We've been serving the community for over 20 years...",
      mission: "To provide the highest quality fuel and services...",
      vision: "To be the leading gas station in the region...",
      values: ["Quality", "Service", "Community", "Innovation"],
      stats: [
        {label: "Years of Service", value: "20+"},
        {label: "Happy Customers", value: "50K+"},
        {label: "Gallons Served", value: "10M+"}
      ],
      image: "https://cdn.example.com/about/station.jpg"
    },
    
    // Services Section Structure
    services: [
      {
        title: "Premium Fuel",
        description: "High-quality gasoline and diesel fuel",
        icon: "fuel", // icon identifier
        image: "https://cdn.example.com/services/fuel.jpg",
        features: ["Ethanol-free options", "Diesel available", "Competitive prices"],
        pricing: {
          display: true,
          regular: "$3.49",
          premium: "$3.79",
          diesel: "$3.99"
        }
      },
      {
        title: "Convenience Store",
        description: "Wide selection of snacks, drinks, and essentials",
        icon: "store",
        image: "https://cdn.example.com/services/store.jpg",
        features: ["24/7 access", "Fresh coffee", "Local products"]
      }
    ],
    
    // Gallery Section Structure
    gallery: {
      title: "Our Facilities",
      description: "Take a look at our modern, clean facilities",
      images: [
        {
          url: "https://cdn.example.com/gallery/exterior.jpg",
          caption: "Modern exterior design",
          alt: "Gas station exterior view"
        },
        {
          url: "https://cdn.example.com/gallery/pumps.jpg", 
          caption: "State-of-the-art fuel pumps",
          alt: "Fuel pump stations"
        }
      ]
    },
    
    // Testimonials Section Structure
    testimonials: [
      {
        name: "John Smith",
        role: "Regular Customer",
        rating: 5,
        comment: "Best gas station in town! Always clean and friendly service.",
        avatar: "https://cdn.example.com/testimonials/john.jpg",
        date: "2024-01-15"
      }
    ]
  },
  isActive: true,
  version: 1, // for content versioning
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Business Templates Collection
```javascript
{
  _id: ObjectId,
  name: "Gas Station Template",
  slug: "gas-station",
  component: "GasStationTemplate", // React component name
  description: "Template for gas stations and fuel services",
  category: "petroleum",
  sections: [
    {
      name: "hero",
      displayName: "Hero Section",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          label: "Main Title",
          required: true,
          maxLength: 100,
          placeholder: "Enter compelling title"
        },
        {
          name: "subtitle", 
          type: "text",
          label: "Subtitle",
          required: false,
          maxLength: 200,
          placeholder: "Supporting text"
        },
        {
          name: "backgroundImage",
          type: "image",
          label: "Background Image",
          required: true,
          dimensions: "1920x1080",
          formats: ["jpg", "png", "webp"]
        },
        {
          name: "ctaButtons",
          type: "array",
          label: "Call-to-Action Buttons",
          maxItems: 3,
          itemFields: [
            {name: "text", type: "text", required: true},
            {name: "link", type: "url", required: true},
            {name: "style", type: "select", options: ["primary", "secondary"]}
          ]
        }
      ]
    },
    {
      name: "services",
      displayName: "Services Section", 
      required: true,
      fields: [
        {
          name: "services",
          type: "array",
          label: "Services List",
          maxItems: 10,
          itemFields: [
            {name: "title", type: "text", required: true},
            {name: "description", type: "textarea", required: true},
            {name: "icon", type: "icon-picker", required: true},
            {name: "image", type: "image", required: false},
            {name: "features", type: "array", itemType: "text"}
          ]
        }
      ]
    }
  ],
  previewImage: "https://cdn.example.com/templates/gas-station-preview.jpg",
  isActive: true,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Media Collection
```javascript
{
  _id: ObjectId,
  filename: "hero-gas-station.jpg",
  originalName: "IMG_001.jpg",
  url: "https://cdn.example.com/uploads/hero-gas-station.jpg",
  thumbnailUrl: "https://cdn.example.com/uploads/thumbs/hero-gas-station.jpg",
  size: 2048576, // bytes
  mimeType: "image/jpeg",
  dimensions: {
    width: 1920,
    height: 1080
  },
  alt: "Modern gas station exterior",
  businessId: ObjectId, // optional - which business uploaded it
  tags: ["gas-station", "exterior", "hero"],
  createdAt: Date
}
```

---

## Frontend Architecture

### App Structure
```
zeebundu-website/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx              # Admin layout with navigation
│   │       ├── page.tsx                # Admin dashboard
│   │       ├── businesses/
│   │       │   ├── page.tsx            # List all businesses
│   │       │   ├── new/page.tsx        # Create new business
│   │       │   └── [id]/
│   │       │       ├── page.tsx        # Edit business details
│   │       │       ├── content/page.tsx # Edit business content
│   │       │       └── preview/page.tsx # Preview business page
│   │       ├── templates/
│   │       │   ├── page.tsx            # Manage templates
│   │       │   └── [slug]/page.tsx     # Template details
│   │       ├── media/
│   │       │   └── page.tsx            # Media library
│   │       └── settings/
│   │           └── page.tsx            # Site settings
│   ├── business/
│   │   └── [slug]/
│   │       ├── page.tsx                # Dynamic business pages
│   │       ├── contact/page.tsx        # Business contact page
│   │       └── gallery/page.tsx        # Business gallery page
│   ├── api/
│   │   ├── auth/                       # Authentication endpoints
│   │   ├── businesses/
│   │   │   ├── route.ts                # GET, POST /api/businesses
│   │   │   └── [id]/
│   │   │       ├── route.ts            # GET, PUT, DELETE /api/businesses/[id]
│   │   │       └── content/route.ts    # Business content endpoints
│   │   ├── templates/
│   │   │   ├── route.ts                # Template CRUD operations
│   │   │   └── [slug]/route.ts         # Template by slug
│   │   ├── media/
│   │   │   ├── upload/route.ts         # File upload endpoint
│   │   │   └── [id]/route.ts           # Media management
│   │   └── sitemap/route.ts            # Dynamic sitemap generation
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Homepage (business overview)
├── components/
│   ├── admin/                          # Admin-only components
│   │   ├── BusinessForm.tsx
│   │   ├── ContentEditor.tsx
│   │   ├── MediaUploader.tsx
│   │   ├── TemplateSelector.tsx
│   │   └── PreviewMode.tsx
│   ├── business-templates/             # Business page templates
│   │   ├── GasStationTemplate.tsx
│   │   ├── HotelTemplate.tsx
│   │   ├── FarmingTemplate.tsx
│   │   ├── LivestockTemplate.tsx
│   │   ├── PoultryTemplate.tsx
│   │   ├── FishFarmingTemplate.tsx
│   │   ├── WaterProductionTemplate.tsx
│   │   ├── NaturalJuicesTemplate.tsx
│   │   ├── BeveragesTemplate.tsx
│   │   ├── SalonTemplate.tsx
│   │   ├── ZeemartTemplate.tsx
│   │   ├── PharmacyTemplate.tsx
│   │   ├── ConstructionTemplate.tsx
│   │   ├── ForexTemplate.tsx
│   │   └── PetroleumTemplate.tsx
│   ├── shared/                         # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── Gallery.tsx
│   │   ├── Testimonials.tsx
│   │   ├── ContactForm.tsx
│   │   └── LoadingStates.tsx
│   └── ui/                             # Base UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       └── ImageUpload.tsx
├── lib/
│   ├── mongodb.ts                      # Database connection
│   ├── auth.ts                         # Authentication utilities
│   ├── api.ts                          # API utilities and fetch helpers
│   ├── types.ts                        # TypeScript type definitions
│   ├── utils.ts                        # General utilities
│   ├── validation.ts                   # Form validation schemas
│   └── constants.ts                    # App constants
├── hooks/                              # Custom React hooks
│   ├── useBusinessData.ts
│   ├── useContentEditor.ts
│   └── useMediaUpload.ts
├── styles/                             # Additional styles
│   └── admin.css                       # Admin-specific styles
└── public/
    ├── icons/                          # Business icons
    ├── templates/                      # Template preview images
    └── default-images/                 # Fallback images
```

### Component Architecture

#### Business Template Structure
Each business template follows this pattern:

```typescript
// components/business-templates/GasStationTemplate.tsx
interface GasStationTemplateProps {
  business: Business;
  content: BusinessContent;
  preview?: boolean;
}

export default function GasStationTemplate({ 
  business, 
  content, 
  preview = false 
}: GasStationTemplateProps) {
  const { hero, about, services, gallery, testimonials } = content;
  
  return (
    <div className="gas-station-template" style={{ 
      '--primary-color': business.branding.primaryColor,
      '--secondary-color': business.branding.secondaryColor 
    }}>
      <Hero 
        title={hero.title}
        subtitle={hero.subtitle}
        backgroundImage={hero.backgroundImage}
        ctaButtons={hero.ctaButtons}
        theme="gas-station"
      />
      
      <About 
        title={about.title}
        description={about.description}
        stats={about.stats}
        theme="gas-station"
      />
      
      <Services 
        services={services}
        theme="gas-station"
      />
      
      <Gallery 
        images={gallery.images}
        title={gallery.title}
        theme="gas-station"
      />
      
      <Testimonials 
        testimonials={testimonials}
        theme="gas-station"
      />
    </div>
  );
}
```

#### Shared Components with Theming
```typescript
// components/shared/Hero.tsx
interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  ctaButtons: CTAButton[];
  theme: string;
}

export default function Hero({ title, subtitle, backgroundImage, ctaButtons, theme }: HeroProps) {
  return (
    <section 
      className={`hero hero--${theme}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        {subtitle && <p className="hero__subtitle">{subtitle}</p>}
        
        <div className="hero__actions">
          {ctaButtons.map((button, index) => (
            <Button 
              key={index}
              variant={button.style}
              href={button.link}
              className={`hero__cta hero__cta--${button.style}`}
            >
              {button.text}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## CMS Admin Panel

### Dashboard Features

#### 1. Overview Dashboard
```typescript
// app/(admin)/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* Quick Stats */}
      <div className="stats-grid">
        <StatCard 
          title="Total Businesses" 
          value={stats.totalBusinesses}
          icon="building"
          trend="+2 this month"
        />
        <StatCard 
          title="Active Pages" 
          value={stats.activePages}
          icon="globe"
          trend="+5 this week"
        />
        <StatCard 
          title="Templates" 
          value={stats.totalTemplates}
          icon="layout"
        />
        <StatCard 
          title="Media Files" 
          value={stats.mediaCount}
          icon="image"
          trend="+15 this week"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />
      
      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
```

#### 2. Business Management
```typescript
// app/(admin)/admin/businesses/page.tsx
export default function BusinessesList() {
  return (
    <div className="businesses-list">
      <div className="page-header">
        <h1>Businesses</h1>
        <Button href="/admin/businesses/new">
          <Plus /> Add New Business
        </Button>
      </div>

      <div className="businesses-grid">
        {businesses.map(business => (
          <BusinessCard 
            key={business._id}
            business={business}
            onEdit={() => router.push(`/admin/businesses/${business._id}`)}
            onEditContent={() => router.push(`/admin/businesses/${business._id}/content`)}
            onPreview={() => window.open(`/business/${business.slug}`, '_blank')}
            onToggleStatus={() => handleToggleStatus(business._id)}
          />
        ))}
      </div>
    </div>
  );
}
```

#### 3. Content Editor Interface
```typescript
// app/(admin)/admin/businesses/[id]/content/page.tsx
export default function ContentEditor({ params }: { params: { id: string } }) {
  const [selectedSection, setSelectedSection] = useState('hero');
  const [content, setContent] = useState(null);
  const [template, setTemplate] = useState(null);

  return (
    <div className="content-editor">
      <div className="editor-sidebar">
        <BusinessSelector 
          currentBusiness={business}
          onBusinessChange={handleBusinessChange}
        />
        
        <SectionNavigator 
          sections={template.sections}
          activeSection={selectedSection}
          onSectionChange={setSelectedSection}
        />
      </div>

      <div className="editor-main">
        <SectionEditor 
          section={selectedSection}
          content={content[selectedSection]}
          template={template.sections.find(s => s.name === selectedSection)}
          onChange={handleContentChange}
        />
      </div>

      <div className="editor-actions">
        <Button variant="outline" onClick={handleSave}>
          Save Draft
        </Button>
        <Button onClick={handlePublish}>
          Publish Changes
        </Button>
        <Button variant="outline" onClick={handlePreview}>
          Preview
        </Button>
      </div>
    </div>
  );
}
```

#### 4. Section-Specific Editors

##### Hero Section Editor
```typescript
// components/admin/sections/HeroEditor.tsx
export default function HeroEditor({ content, onChange }: SectionEditorProps) {
  return (
    <div className="hero-editor">
      <h3>Hero Section</h3>
      
      <Input 
        label="Title"
        value={content.title}
        onChange={(value) => onChange({ ...content, title: value })}
        required
        maxLength={100}
      />
      
      <Input 
        label="Subtitle"
        value={content.subtitle}
        onChange={(value) => onChange({ ...content, subtitle: value })}
        maxLength={200}
      />
      
      <ImageUpload 
        label="Background Image"
        value={content.backgroundImage}
        onChange={(url) => onChange({ ...content, backgroundImage: url })}
        dimensions="1920x1080"
        required
      />
      
      <CTAButtonsEditor 
        buttons={content.ctaButtons}
        onChange={(buttons) => onChange({ ...content, ctaButtons: buttons })}
        maxButtons={3}
      />
    </div>
  );
}
```

##### Services Section Editor
```typescript
// components/admin/sections/ServicesEditor.tsx
export default function ServicesEditor({ content, onChange }: SectionEditorProps) {
  const [services, setServices] = useState(content.services || []);

  const addService = () => {
    setServices([...services, {
      title: '',
      description: '',
      icon: '',
      image: '',
      features: []
    }]);
  };

  return (
    <div className="services-editor">
      <div className="section-header">
        <h3>Services Section</h3>
        <Button onClick={addService}>
          <Plus /> Add Service
        </Button>
      </div>
      
      {services.map((service, index) => (
        <ServiceEditor 
          key={index}
          service={service}
          onChange={(updatedService) => {
            const newServices = [...services];
            newServices[index] = updatedService;
            setServices(newServices);
            onChange({ ...content, services: newServices });
          }}
          onRemove={() => {
            const newServices = services.filter((_, i) => i !== index);
            setServices(newServices);
            onChange({ ...content, services: newServices });
          }}
        />
      ))}
    </div>
  );
}
```

### Media Management
```typescript
// components/admin/MediaLibrary.tsx
export default function MediaLibrary() {
  return (
    <div className="media-library">
      <div className="media-header">
        <SearchInput 
          placeholder="Search media files..."
          onSearch={handleSearch}
        />
        <FileUpload 
          onUpload={handleUpload}
          accept="image/*,video/*"
          multiple
        />
      </div>

      <div className="media-filters">
        <FilterButton 
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All Files
        </FilterButton>
        <FilterButton 
          active={filter === 'images'}
          onClick={() => setFilter('images')}
        >
          Images
        </FilterButton>
        <FilterButton 
          active={filter === 'videos'}
          onClick={() => setFilter('videos')}
        >
          Videos
        </FilterButton>
      </div>

      <div className="media-grid">
        {mediaFiles.map(file => (
          <MediaCard 
            key={file._id}
            file={file}
            onSelect={handleSelectFile}
            onDelete={handleDeleteFile}
            selected={selectedFiles.includes(file._id)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## API Design

### Business Management APIs

#### 1. Business CRUD Operations
```typescript
// app/api/businesses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const businesses = await db.collection('businesses')
      .find({ status: { $ne: 'deleted' } })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: businesses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    const { name, slug, template, industry } = data;
    if (!name || !slug || !template || !industry) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slug already exists
    const existingBusiness = await db.collection('businesses')
      .findOne({ slug });
    
    if (existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'Business with this slug already exists' },
        { status: 409 }
      );
    }
    
    const business = {
      ...data,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('businesses').insertOne(business);
    
    return NextResponse.json({ 
      success: true, 
      data: { ...business, _id: result.insertedId }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create business' },
      { status: 500 }
    );
  }
}
```

#### 2. Business Content Management
```typescript
// app/api/businesses/[id]/content/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const content = await db.collection('business_content')
      .find({ businessId: new ObjectId(params.id) })
      .toArray();
    
    // Transform array to object keyed by section
    const contentBySection = content.reduce((acc, item) => {
      acc[item.section] = item.content;
      return acc;
    }, {});
    
    return NextResponse.json({ success: true, data: contentBySection });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { section, content } = await request.json();
    
    const result = await db.collection('business_content').findOneAndUpdate(
      { 
        businessId: new ObjectId(params.id),
        section 
      },
      {
        $set: {
          content,
          updatedAt: new Date()
        },
        $setOnInsert: {
          businessId: new ObjectId(params.id),
          section,
          createdAt: new Date()
        }
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );
    
    return NextResponse.json({ success: true, data: result.value });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
```

#### 3. Public Business API (for frontend)
```typescript
// app/api/businesses/slug/[slug]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { db } = await connectToDatabase();
    
    // Get business details
    const business = await db.collection('businesses')
      .findOne({ slug: params.slug, status: 'active' });
    
    if (!business) {
      return NextResponse.json(
        { success: false, error: 'Business not found' },
        { status: 404 }
      );
    }
    
    // Get business content
    const content = await db.collection('business_content')
      .find({ businessId: business._id, isActive: true })
      .toArray();
    
    const contentBySection = content.reduce((acc, item) => {
      acc[item.section] = item.content;
      return acc;
    }, {});
    
    // Get template information
    const template = await db.collection('business_templates')
      .findOne({ slug: business.template });
    
    return NextResponse.json({
      success: true,
      data: {
        business,
        content: contentBySection,
        template
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch business data' },
      { status: 500 }
    );
  }
}
```

#### 4. Media Upload API
```typescript
// app/api/media/upload/route.ts
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
    
    // Save file to public directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadPath = path.join(process.cwd(), 'public/uploads', filename);
    
    await writeFile(uploadPath, buffer);
    
    // Save metadata to database
    const { db } = await connectToDatabase();
    const mediaRecord = {
      filename,
      originalName: file.name,
      url: `/uploads/${filename}`,
      size: file.size,
      mimeType: file.type,
      createdAt: new Date()
    };
    
    const result = await db.collection('media').insertOne(mediaRecord);
    
    return NextResponse.json({
      success: true,
      data: {
        ...mediaRecord,
        _id: result.insertedId
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
```

---

## Business Templates

### Template Mapping (from React Project)

Based on the existing React project, here are the 15+ business templates to create:

#### 1. Gas Station Template (`GasStationTemplate.tsx`)
**Source**: `GasStationsPage.tsx`
**Features**: 
- Fuel pricing display
- Station amenities
- Location map
- Operating hours
- Loyalty program info

#### 2. Hotel & Resorts Template (`HotelTemplate.tsx`)
**Source**: `HotelsResortsPage.tsx`
**Features**:
- Room showcase
- Amenities gallery
- Booking integration
- Location highlights
- Guest testimonials

#### 3. Farming Template (`FarmingTemplate.tsx`)
**Source**: `FarmingPage.tsx`
**Features**:
- Crop information
- Farming practices
- Seasonal calendar
- Farm tours
- Product showcase

#### 4. Livestock Template (`LivestockTemplate.tsx`)
**Source**: `LivestockPage.tsx`
**Features**:
- Animal breeds
- Care practices
- Products (meat, dairy)
- Farm certifications
- Health standards

#### 5. Poultry Template (`PoultryTemplate.tsx`)
**Source**: `PoultryPage.tsx`
**Features**:
- Poultry types
- Egg production
- Feed information
- Quality standards
- Distribution network

#### 6. Fish Farming Template (`FishFarmingTemplate.tsx`)
**Source**: `FishFarmingPage.tsx`
**Features**:
- Fish species
- Farming methods
- Sustainability practices
- Fresh fish availability
- Processing facilities

#### 7. Water Production Template (`WaterProductionTemplate.tsx`)
**Source**: `WaterProductionPage.tsx`
**Features**:
- Purification process
- Quality certifications
- Product sizes
- Distribution network
- Environmental impact

#### 8. Natural Juices Template (`NaturalJuicesTemplate.tsx`)
**Source**: `NaturalJuicesPage.tsx`
**Features**:
- Fruit sources
- Production process
- Nutritional information
- Flavor varieties
- Health benefits

#### 9. Beverages Template (`BeveragesTemplate.tsx`)
**Source**: `BeveragesPage.tsx`
**Features**:
- Product catalog
- Brand partnerships
- Distribution channels
- Wholesale information
- New arrivals

#### 10. Salon Template (`SalonTemplate.tsx`)
**Source**: `SalonPage.tsx`
**Features**:
- Service menu
- Stylist profiles
- Before/after gallery
- Appointment booking
- Product sales

#### 11. Zeemart Template (`ZeemartTemplate.tsx`)
**Source**: `ZeemartPage.tsx`
**Features**:
- Product categories
- Daily specials
- Store locations
- Operating hours
- Online shopping

#### 12. Pharmacy Template (`PharmacyTemplate.tsx`)
**Source**: `PharmacyPage.tsx`
**Features**:
- Medication categories
- Health services
- Prescription refills
- Health tips blog
- Emergency contacts

#### 13. Construction Materials Template (`ConstructionTemplate.tsx`)
**Source**: `ConstructionMaterialsPage.tsx`
**Features**:
- Material catalog
- Project galleries
- Delivery services
- Bulk pricing
- Technical specifications

#### 14. Foreign Exchange Template (`ForexTemplate.tsx`)
**Source**: `ForeignExchangePage.tsx`
**Features**:
- Exchange rates
- Currency calculator
- Service locations
- Transfer options
- Market updates

#### 15. Petroleum Services Template (`PetroleumTemplate.tsx`)
**Source**: `PetroleumServicesPage.tsx`
**Features**:
- Service offerings
- Equipment showcase
- Safety protocols
- Industry certifications
- Project portfolio

### Template Component Structure

```typescript
// components/business-templates/BaseTemplate.tsx
interface BaseTemplateProps {
  business: Business;
  content: BusinessContent;
  preview?: boolean;
}

export default function BaseTemplate({ business, content, preview }: BaseTemplateProps) {
  // Apply business-specific theming
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', business.branding.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', business.branding.secondaryColor);
  }, [business.branding]);

  return (
    <div className={`template-${business.template} ${preview ? 'preview-mode' : ''}`}>
      {/* SEO Meta Tags */}
      <Head>
        <title>{business.seo.metaTitle}</title>
        <meta name="description" content={business.seo.metaDescription} />
        <meta name="keywords" content={business.seo.keywords.join(', ')} />
        <meta property="og:title" content={business.seo.metaTitle} />
        <meta property="og:description" content={business.seo.metaDescription} />
        <meta property="og:image" content={business.seo.ogImage} />
      </Head>

      {/* Template-specific content */}
      {children}
    </div>
  );
}
```

---

## Development Workflow

### Phase 1: Foundation (Week 1-2)

#### Setup & Infrastructure
```bash
# 1. Create Next.js project
npx create-next-app@latest zeebundu-website --typescript --tailwind --app

# 2. Install dependencies
npm install mongodb mongoose @types/mongodb
npm install next-auth bcryptjs
npm install @uploadthing/react uploadthing
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react @radix-ui/react-icons
npm install framer-motion
npm install react-hot-toast

# 3. Setup environment variables
echo "MONGODB_URI=mongodb://localhost:27017/zeebundu
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id" > .env.local
```

#### Database Connection
```typescript
// lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
```

#### Authentication Setup
```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { db } = await connectToDatabase();
        const user = await db.collection('admin_users').findOne({
          email: credentials.email
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login'
  }
};

export default NextAuth(authOptions);
```

### Phase 2: Admin CMS (Week 3-4)

#### Admin Layout
```typescript
// app/(admin)/admin/layout.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader user={session.user} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### Business Management Interface
```typescript
// components/admin/BusinessForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  industry: z.string().min(1, 'Industry is required'),
  template: z.string().min(1, 'Template is required'),
  status: z.enum(['draft', 'active', 'inactive']),
  branding: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    logo: z.string().optional()
  })
});

export default function BusinessForm({ business, onSubmit }: BusinessFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: business
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="business-form">
      <div className="form-section">
        <h3>Basic Information</h3>
        
        <Input
          label="Business Name"
          {...register('name')}
          error={errors.name?.message}
        />
        
        <Input
          label="URL Slug"
          {...register('slug')}
          error={errors.slug?.message}
          help="This will be used in the URL: /business/your-slug"
        />
        
        <Select
          label="Industry"
          {...register('industry')}
          error={errors.industry?.message}
          options={INDUSTRY_OPTIONS}
        />
        
        <TemplateSelector
          label="Page Template"
          {...register('template')}
          error={errors.template?.message}
        />
      </div>

      <div className="form-section">
        <h3>Branding</h3>
        
        <ColorPicker
          label="Primary Color"
          {...register('branding.primaryColor')}
        />
        
        <ColorPicker
          label="Secondary Color"
          {...register('branding.secondaryColor')}
        />
        
        <ImageUpload
          label="Logo"
          {...register('branding.logo')}
        />
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary">
          Save Business
        </Button>
      </div>
    </form>
  );
}
```

### Phase 3: Frontend Templates (Week 5-6)

#### Dynamic Business Page
```typescript
// app/business/[slug]/page.tsx
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getBusinessBySlug } from '@/lib/api';

// Dynamic template imports
const templates = {
  'gas-station': dynamic(() => import('@/components/business-templates/GasStationTemplate')),
  'hotel': dynamic(() => import('@/components/business-templates/HotelTemplate')),
  'farming': dynamic(() => import('@/components/business-templates/FarmingTemplate')),
  // ... other templates
};

export async function generateStaticParams() {
  // Get all business slugs for static generation
  const businesses = await getAllBusinesses();
  return businesses.map((business) => ({
    slug: business.slug,
  }));
}

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const businessData = await getBusinessBySlug(params.slug);

  if (!businessData) {
    notFound();
  }

  const { business, content, template } = businessData;
  
  // Get the appropriate template component
  const TemplateComponent = templates[business.template];
  
  if (!TemplateComponent) {
    console.error(`Template not found: ${business.template}`);
    notFound();
  }

  return (
    <TemplateComponent 
      business={business}
      content={content}
      template={template}
    />
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const businessData = await getBusinessBySlug(params.slug);
  
  if (!businessData) {
    return {};
  }

  const { business } = businessData;

  return {
    title: business.seo.metaTitle,
    description: business.seo.metaDescription,
    keywords: business.seo.keywords,
    openGraph: {
      title: business.seo.metaTitle,
      description: business.seo.metaDescription,
      images: [business.seo.ogImage],
    },
  };
}
```

#### Template Implementation Example
```typescript
// components/business-templates/GasStationTemplate.tsx
import Hero from '@/components/shared/Hero';
import Services from '@/components/shared/Services';
import About from '@/components/shared/About';
import Gallery from '@/components/shared/Gallery';
import Contact from '@/components/shared/Contact';

interface GasStationTemplateProps {
  business: Business;
  content: BusinessContent;
  template: BusinessTemplate;
}

export default function GasStationTemplate({ 
  business, 
  content, 
  template 
}: GasStationTemplateProps) {
  return (
    <div className="gas-station-template">
      {/* Apply business branding */}
      <style jsx>{`
        .gas-station-template {
          --primary: ${business.branding.primaryColor};
          --secondary: ${business.branding.secondaryColor};
        }
      `}</style>

      {/* Hero Section */}
      <Hero 
        title={content.hero?.title}
        subtitle={content.hero?.subtitle}
        backgroundImage={content.hero?.backgroundImage}
        ctaButtons={content.hero?.ctaButtons}
        theme="gas-station"
      />

      {/* Services Section - Gas Station Specific */}
      <section className="fuel-services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {content.services?.map((service, index) => (
              <div key={index} className="service-card gas-station-service">
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                
                {/* Gas station specific: fuel pricing */}
                {service.pricing && (
                  <div className="fuel-pricing">
                    <div className="price-item">
                      <span>Regular</span>
                      <span className="price">{service.pricing.regular}</span>
                    </div>
                    <div className="price-item">
                      <span>Premium</span>
                      <span className="price">{service.pricing.premium}</span>
                    </div>
                    <div className="price-item">
                      <span>Diesel</span>
                      <span className="price">{service.pricing.diesel}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <About 
        title={content.about?.title}
        description={content.about?.description}
        mission={content.about?.mission}
        stats={content.about?.stats}
        image={content.about?.image}
        theme="gas-station"
      />

      {/* Gallery Section */}
      <Gallery 
        title={content.gallery?.title}
        images={content.gallery?.images}
        theme="gas-station"
      />

      {/* Contact Section */}
      <Contact 
        business={business}
        theme="gas-station"
      />
    </div>
  );
}
```

### Phase 4: Integration & Testing (Week 7)

#### API Integration
```typescript
// lib/api.ts
export async function getBusinessBySlug(slug: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/businesses/slug/${slug}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  return result.data;
}

export async function updateBusinessContent(businessId: string, section: string, content: any) {
  const response = await fetch(`/api/businesses/${businessId}/content`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ section, content }),
  });

  if (!response.ok) {
    throw new Error('Failed to update content');
  }

  return response.json();
}
```

#### Testing Strategy
```typescript
// __tests__/business-page.test.tsx
import { render, screen } from '@testing-library/react';
import BusinessPage from '@/app/business/[slug]/page';
import { mockBusinessData } from '@/test-utils/mockData';

jest.mock('@/lib/api', () => ({
  getBusinessBySlug: jest.fn(() => Promise.resolve(mockBusinessData)),
}));

describe('Business Page', () => {
  it('renders business content correctly', async () => {
    render(<BusinessPage params={{ slug: 'test-gas-station' }} />);
    
    expect(screen.getByText('Test Gas Station')).toBeInTheDocument();
    expect(screen.getByText('Premium fuel services')).toBeInTheDocument();
  });

  it('applies business-specific branding', async () => {
    render(<BusinessPage params={{ slug: 'test-gas-station' }} />);
    
    const template = screen.getByTestId('gas-station-template');
    expect(template).toHaveStyle('--primary: #FF6B35');
  });
});
```

### Phase 5: Deployment & Launch (Week 8)

#### Build Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.example.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### Deployment Script
```bash
#!/bin/bash
# deploy.sh

echo "Building Next.js application..."
npm run build

echo "Running tests..."
npm test

echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
```

---

## Technical Specifications

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context + Custom hooks

#### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB with native driver
- **Authentication**: NextAuth.js
- **File Upload**: UploadThing or custom solution
- **Image Processing**: Sharp (for optimization)
- **Validation**: Zod schemas

#### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js built-in webpack

#### Deployment
- **Frontend Hosting**: Vercel
- **Database**: MongoDB Atlas
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain with SSL
- **Analytics**: Vercel Analytics + Google Analytics

### Performance Targets
- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: 
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- **Bundle Size**: < 200KB initial bundle
- **Image Optimization**: WebP/AVIF with lazy loading

### Security Features
- **Authentication**: Secure session management
- **Input Validation**: Server-side validation for all inputs
- **File Upload**: Type validation + size limits
- **Headers**: Security headers (CSP, HSTS, etc.)
- **Database**: Connection string encryption
- **API**: Rate limiting on public endpoints

---

## Getting Started

### Prerequisites
```bash
# Required software
- Node.js 18+ 
- npm or yarn
- MongoDB (local or Atlas)
- Git

# Recommended tools
- VS Code with extensions:
  - TypeScript
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
```

### Installation Steps

#### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd zeebundu-website

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configurations
```

#### 2. Database Setup
```bash
# If using local MongoDB
mongod --dbpath /path/to/your/db

# Create initial admin user
node scripts/create-admin.js
```

#### 3. Development
```bash
# Start development server
npm run dev

# In separate terminal, run database seed
npm run seed

# Open http://localhost:3000
```

#### 4. Initial Configuration
1. Visit `http://localhost:3000/admin`
2. Login with admin credentials
3. Create your first business
4. Upload template content
5. Test the business page

### Project Structure Setup
```bash
# Create all necessary directories
mkdir -p {components/{admin,business-templates,shared,ui},lib,hooks,styles,public/{uploads,icons}}

# Initialize git hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

### Development Workflow
```bash
# Feature development
git checkout -b feature/new-template
# ... make changes
npm run test
npm run build
git commit -m "feat: add new business template"
git push origin feature/new-template

# Create pull request
# After review, merge to main
```

---

## Future Enhancements

### Phase 2 Features (Months 2-3)

#### 1. Advanced CMS Features
- **Content Versioning**: Track content changes with rollback capability
- **Workflow Management**: Content approval process
- **Bulk Operations**: Mass update multiple businesses
- **Content Scheduling**: Publish content at specific times
- **Multi-language Support**: Internationalization for content

#### 2. SEO & Analytics
- **Advanced SEO Tools**: Schema markup, sitemap generation
- **Analytics Dashboard**: Business performance metrics
- **A/B Testing**: Template and content variations
- **Search Functionality**: Site-wide search with filters
- **Social Media Integration**: Auto-posting to social platforms

#### 3. E-commerce Integration
- **Online Ordering**: For applicable businesses (mart, pharmacy)
- **Inventory Management**: Stock tracking and updates
- **Payment Processing**: Stripe/PayPal integration
- **Order Management**: Admin order processing
- **Customer Accounts**: User registration and profiles

### Phase 3 Features (Months 4-6)

#### 1. Mobile App
- **React Native App**: Native mobile experience
- **Push Notifications**: Business updates and promotions
- **Offline Mode**: Cached content for offline viewing
- **Location Services**: Find nearest business locations
- **Loyalty Programs**: Digital rewards system

#### 2. Advanced Business Features
- **Booking System**: Appointments for salons, hotels
- **Event Management**: Business events and promotions
- **Staff Management**: Employee profiles and schedules
- **Customer Reviews**: Rating and review system
- **Live Chat**: Customer support integration

#### 3. Marketing Tools
- **Email Marketing**: Newsletter and promotional campaigns
- **Social Media Management**: Centralized social posting
- **Lead Generation**: Contact form and CRM integration
- **Promotional Campaigns**: Discount codes and offers
- **Affiliate Program**: Partner business referrals

### Technical Roadmap

#### Performance Optimizations
- **Edge Caching**: CDN optimization for static content
- **Database Optimization**: Indexing and query optimization
- **Bundle Splitting**: Route-based code splitting
- **Image Optimization**: Advanced compression and formats
- **Service Workers**: Offline capabilities and caching

#### Infrastructure Improvements
- **Microservices**: Split admin and public APIs
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Application performance monitoring
- **Backup System**: Automated database backups
- **Scaling**: Auto-scaling based on traffic

#### Developer Experience
- **Design System**: Comprehensive component library
- **Storybook**: Component documentation and testing
- **API Documentation**: Swagger/OpenAPI specifications
- **Developer Portal**: Business template creation guide
- **CLI Tools**: Command-line business management

### Business Model Extensions

#### 1. Multi-tenant SaaS
- **White-label Solution**: Sell platform to other multi-business companies
- **Subscription Tiers**: Different feature levels
- **Custom Domains**: Each client gets their own domain
- **Branded Admin**: Client-specific admin panel styling

#### 2. Marketplace Features
- **Business Directory**: Public listing of all businesses
- **Cross-promotion**: Businesses promote each other
- **Unified Loyalty Program**: Points across all businesses
- **Package Deals**: Combined services from multiple businesses

#### 3. Data & Analytics Services
- **Business Intelligence**: Advanced analytics and insights
- **Market Research**: Industry trend analysis
- **Customer Insights**: Behavior analysis across businesses
- **Reporting API**: Third-party integrations

---

This comprehensive implementation plan provides a solid foundation for building a scalable, multi-business website with a powerful CMS. The modular architecture ensures that new businesses can be easily added, and the template system allows for rapid development of new business types while maintaining consistency across the platform.

The plan is designed to be executed in phases, allowing for iterative development and testing while delivering value at each stage. The technical specifications ensure modern, performant, and secure implementation that can scale with business growth.