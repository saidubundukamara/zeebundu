# Business Templates Development Guide

This guide explains how to create new business templates for the multi-business website CMS.

## Overview

Business templates are React components that render dynamic business pages based on industry-specific designs. Each template receives business data, content from the CMS, and template configuration to create a customized website for that business.

## File Structure

```
components/business-templates/
├── README.md                 # This guide
├── GasStationTemplate.tsx    # Gas station template
├── HotelTemplate.tsx         # Hotel & resort template
├── FarmingTemplate.tsx       # Agriculture template
├── PharmacyTemplate.tsx      # Healthcare template
└── [YourTemplate].tsx        # Your new template
```

## Template Props Interface

All templates must implement the `TemplateProps` interface:

```typescript
interface TemplateProps {
  business: Business;           // Business info (name, branding, contact)
  content: {                   // CMS content organized by sections
    hero?: any;
    services?: any;
    about?: any;
    contact?: any;
    [sectionName]?: any;       // Template-specific sections
  };
  template: BusinessTemplate;  // Template metadata
  preview?: boolean;           // Preview mode flag
}
```

## Step-by-Step Template Creation

### 1. Create Template File

Create a new file in this directory following the naming pattern: `[BusinessType]Template.tsx`

### 2. Basic Template Structure

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/components/shared/Hero';
import Services from '@/components/shared/Services';
import About from '@/components/shared/About';
import Contact from '@/components/shared/Contact';
import { Business, BusinessTemplate } from '@/lib/types';

interface TemplateProps {
  business: Business;
  content: {
    hero?: any;
    services?: any;
    about?: any;
    contact?: any;
    // Add template-specific sections here
  };
  template: BusinessTemplate;
  preview?: boolean;
}

export default function YourBusinessTemplate({ 
  business, 
  content, 
  template, 
  preview = false 
}: TemplateProps) {
  // State for scroll animations
  const [visibleSections, setVisibleSections] = useState(new Set<string>());

  // CSS Custom Properties Setup (Required)
  useEffect(() => {
    if (typeof document !== 'undefined' && business.branding) {
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', business.branding.primaryColor || '#default-color');
      root.style.setProperty('--brand-secondary', business.branding.secondaryColor || '#default-color');
    }
  }, [business.branding]);

  // Intersection Observer for Animations (Recommended)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
0.
  // Icon mapping function (customize for your industry)
  function getServiceIcon(iconName: string) {
    const iconMap: Record<string, React.ReactNode> = {
      'default': <DefaultIcon className="w-8 h-8" />,
      // Add industry-specific icons here
    };
    
    return iconMap[iconName] || iconMap[iconName.toLowerCase()] || iconMap['default'];
  }

  // Content transformation functions
  const heroProps = {
    title: content.hero?.title || `Welcome to ${business.name}`,
    subtitle: content.hero?.subtitle || 'Your Industry Subtitle',
    description: content.hero?.description || business.description || 'Default description',
    backgroundImage: content.hero?.backgroundImage || '/default-hero-bg.jpg',
    theme: 'from-blue-900 to-gray-900', // Choose industry-appropriate colors
    buttons: content.hero?.ctaButtons || [
      { text: 'Learn More', href: '#about', variant: 'primary' as const },
      { text: 'Contact Us', href: '#contact', variant: 'secondary' as const }
    ]
  };

  const servicesProps = {
    title: content.services?.title || 'Our Services',
    subtitle: content.services?.subtitle || 'What we offer',
    services: content.services?.items || [
      // Default services for your industry
      {
        name: 'Default Service',
        description: 'Service description',
        icon: 'default',
        features: ['Feature 1', 'Feature 2']
      }
    ],
    getIcon: getServiceIcon
  };

  const aboutProps = {
    title: content.about?.title || `About ${business.name}`,
    description: content.about?.description || 'Company description',
    image: content.about?.image || '/default-about-image.jpg',
    stats: content.about?.stats || [
      { label: 'Years Experience', value: '10+' },
      { label: 'Happy Customers', value: '500+' }
    ],
    features: content.about?.features || [
      'Industry expertise',
      'Quality service',
      'Customer focused'
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className={`transition-opacity duration-1000 ${
        visibleSections.has('hero') ? 'opacity-100' : 'opacity-0'
      }`}>
        <Hero {...heroProps} />
      </section>

      {/* Add your industry-specific custom sections here */}
      
      {/* Services Section */}
      <section id="services" className={`py-20 transition-all duration-1000 ${
        visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <Services {...servicesProps} />
      </section>

      {/* About Section */}
      <section id="about" className={`py-20 bg-gray-50 transition-all duration-1000 ${
        visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <About {...aboutProps} />
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-20 transition-all duration-1000 ${
        visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <Contact business={business} content={content.contact} />
      </section>
    </div>
  );
}
```

### 3. Register Your Template

Add your template to the mapping in `/app/business/[slug]/page.tsx`:

```typescript
import YourBusinessTemplate from '@/components/business-templates/YourBusinessTemplate';

function getTemplateComponent(templateName: string) {
  const templates = {
    'gas-station': GasStationTemplate,
    'hotel': HotelTemplate,
    'farming': FarmingTemplate,
    'pharmacy': PharmacyTemplate,
    'your-business': YourBusinessTemplate,        // Add this line
    'alternative-name': YourBusinessTemplate,     // Support multiple keys if needed
  };
  
  return templates[templateName as keyof typeof templates];
}
```

## Shared Components Reference

### Hero Component Props
```typescript
{
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  theme: string;           // Tailwind gradient classes
  buttons?: Array<{
    text: string;
    href: string;
    variant: 'primary' | 'secondary';
  }>;
}
```

### Services Component Props
```typescript
{
  title: string;
  subtitle?: string;
  services: Array<{
    name: string;
    description: string;
    icon?: string;
    features?: string[];
    price?: string;
  }>;
  getIcon: (iconName: string) => React.ReactNode;
}
```

### About Component Props
```typescript
{
  title: string;
  description: string;
  image?: string;
  stats?: Array<{
    label: string;
    value: string;
  }>;
  features?: string[];
}
```

### Contact Component Props
```typescript
{
  business: Business;      // Contains contact info
  content?: any;           // Additional contact content
}
```

## Industry-Specific Customization

### Color Themes
Choose appropriate gradient themes for your industry:

```typescript
// Examples from existing templates
'from-blue-900 to-gray-900'     // Gas Station (fuel/automotive)
'from-emerald-500 to-teal-500'  // Hotel (hospitality)
'from-green-500 to-emerald-500' // Farming (agriculture)
'from-red-500 to-red-600'       // Pharmacy (healthcare)
```

### Custom Sections
Add industry-specific sections between shared components:

```typescript
{/* Example: Menu section for restaurant template */}
<section id="menu" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12">Our Menu</h2>
    {/* Custom menu content */}
  </div>
</section>

{/* Example: Rooms section for hotel template */}
<section id="rooms" className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12">Rooms & Suites</h2>
    {/* Custom rooms content */}
  </div>
</section>
```

### Icon Mapping
Create industry-specific icon mappings:

```typescript
// Restaurant example
function getServiceIcon(iconName: string) {
  const iconMap: Record<string, React.ReactNode> = {
    'dining': <Utensils className="w-8 h-8" />,
    'delivery': <Truck className="w-8 h-8" />,
    'catering': <Users className="w-8 h-8" />,
    'bar': <Wine className="w-8 h-8" />,
    'default': <Star className="w-8 h-8" />
  };
  
  return iconMap[iconName] || iconMap[iconName.toLowerCase()] || iconMap['default'];
}
```

## Default Content Examples

Provide industry-appropriate defaults:

```typescript
// Restaurant template defaults
const defaultServices = [
  {
    name: 'Fine Dining',
    description: 'Exceptional cuisine crafted by our expert chefs',
    icon: 'dining',
    features: ['Fresh ingredients', 'Expert preparation', 'Beautiful presentation']
  },
  {
    name: 'Catering',
    description: 'Professional catering for all your special events',
    icon: 'catering',
    features: ['Custom menus', 'Professional service', 'All event sizes']
  }
];

const defaultStats = [
  { label: 'Years Serving', value: '15+' },
  { label: 'Happy Customers', value: '10K+' },
  { label: 'Menu Items', value: '50+' },
  { label: 'Star Rating', value: '4.8' }
];
```

## Animation Patterns

Use consistent animation patterns:

```typescript
// Fade in on scroll
className={`transition-opacity duration-1000 ${
  visibleSections.has('section-id') ? 'opacity-100' : 'opacity-0'
}`}

// Slide up on scroll
className={`transition-all duration-1000 ${
  visibleSections.has('section-id') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
}`}

// Stagger animations for lists
{items.map((item, index) => (
  <div
    key={index}
    className={`transition-all duration-1000 ${
      visibleSections.has('section-id') 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-10'
    }`}
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    {/* Item content */}
  </div>
))}
```

## Testing Your Template

1. **Mock Data Testing**: Create test data matching your Business and content interfaces
2. **Responsive Design**: Test on mobile, tablet, and desktop viewports
3. **Animation Testing**: Verify scroll animations work smoothly
4. **Content Edge Cases**: Test with missing content, long text, many services
5. **Brand Color Testing**: Verify custom brand colors apply correctly

## Best Practices

1. **Performance**: Use lazy loading for images and heavy components
2. **Accessibility**: Include proper ARIA labels and semantic HTML
3. **SEO**: Use proper heading hierarchy (h1, h2, h3, etc.)
4. **Mobile First**: Design for mobile and enhance for larger screens
5. **Consistent Spacing**: Use Tailwind's spacing scale (py-20, mb-12, etc.)
6. **Error Boundaries**: Handle missing content gracefully with defaults
7. **TypeScript**: Maintain strict typing for all props and data

## Existing Templates Reference

Study these existing templates for patterns and inspiration:

- **GasStationTemplate.tsx**: Fuel pricing overlay, location features
- **HotelTemplate.tsx**: Rooms showcase, amenities grid
- **FarmingTemplate.tsx**: Product categories, certifications
- **PharmacyTemplate.tsx**: Health services, medication categories

## Need Help?

- Check existing templates for implementation examples
- Refer to shared component files in `/components/shared/`
- Review type definitions in `/lib/types/`
- Test with mock business data during development