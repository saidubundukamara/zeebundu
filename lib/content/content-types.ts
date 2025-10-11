import { MediaAsset } from '@/lib/types';

// Base content section interface
export interface BaseContentSection {
  id: string;
  type: string;
  title: string;
  isActive: boolean;
  order: number;
  lastModified: Date;
  metadata?: {
    createdBy?: string;
    lastEditedBy?: string;
    version?: number;
    notes?: string;
  };
}

// Specific content type interfaces
export interface HeroContentSection extends BaseContentSection {
  type: 'hero';
  content: {
    title: string;
    subtitle?: string;
    description: string;
    backgroundImage?: MediaAsset;
    backgroundVideo?: MediaAsset;
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
      target?: '_self' | '_blank';
      analytics?: {
        trackingId?: string;
        eventName?: string;
      };
    }>;
    style: {
      titleSize: 'sm' | 'md' | 'lg' | 'xl';
      titleColor: string;
      descriptionColor: string;
      backgroundColor: string;
      backgroundOpacity?: number;
    };
    animation?: {
      enabled: boolean;
      type: 'fade' | 'slide' | 'zoom';
      duration: number;
    };
  };
}

export interface AboutContentSection extends BaseContentSection {
  type: 'about';
  content: {
    title: string;
    description: string;
    image?: MediaAsset;
    features: string[];
    stats: Array<{
      id: string;
      label: string;
      value: string;
      icon?: string;
      color?: string;
    }>;
    timeline?: Array<{
      id: string;
      year: string;
      title: string;
      description: string;
    }>;
    team?: Array<{
      id: string;
      name: string;
      position: string;
      bio?: string;
      image?: MediaAsset;
      social?: {
        linkedin?: string;
        twitter?: string;
        email?: string;
      };
    }>;
  };
}

export interface ServicesContentSection extends BaseContentSection {
  type: 'services';
  content: {
    title: string;
    description?: string;
    layout: 'grid' | 'list' | 'carousel';
    services: Array<{
      id: string;
      name: string;
      description: string;
      image?: MediaAsset;
      icon?: string;
      features: string[];
      pricing?: {
        type: 'fixed' | 'range' | 'custom';
        value: string;
        currency?: string;
        period?: string;
      };
      cta?: {
        text: string;
        link: string;
        style: 'primary' | 'secondary' | 'outline';
      };
      order: number;
      isVisible: boolean;
      category?: string;
    }>;
    categories?: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  };
}

export interface GalleryContentSection extends BaseContentSection {
  type: 'gallery';
  content: {
    title: string;
    description?: string;
    layout: 'grid' | 'masonry' | 'carousel' | 'lightbox';
    columns: number;
    aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
    images: Array<{
      id: string;
      media: MediaAsset;
      caption?: string;
      alt?: string;
      isVisible: boolean;
      order: number;
      category?: string;
      tags?: string[];
    }>;
    categories?: Array<{
      id: string;
      name: string;
      color: string;
    }>;
    settings: {
      showCaptions: boolean;
      enableLightbox: boolean;
      autoplay?: boolean;
      autoplaySpeed?: number;
    };
  };
}

export interface TestimonialsContentSection extends BaseContentSection {
  type: 'testimonials';
  content: {
    title: string;
    description?: string;
    layout: 'grid' | 'carousel' | 'masonry';
    testimonials: Array<{
      id: string;
      name: string;
      position?: string;
      company?: string;
      avatar?: MediaAsset;
      rating: number;
      comment: string;
      date: string;
      isVerified?: boolean;
      source?: 'google' | 'facebook' | 'website' | 'other';
      order: number;
      isVisible: boolean;
    }>;
    settings: {
      showRatings: boolean;
      showDates: boolean;
      showCompany: boolean;
      autoplay?: boolean;
      autoplaySpeed?: number;
    };
  };
}

export interface ContactContentSection extends BaseContentSection {
  type: 'contact';
  content: {
    title: string;
    description?: string;
    contactInfo: {
      address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      phone?: string;
      email?: string;
      website?: string;
    };
    hours?: Array<{
      day: string;
      hours: string;
      isOpen: boolean;
    }>;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
      tiktok?: string;
    };
    map?: {
      enabled: boolean;
      latitude?: number;
      longitude?: number;
      zoom?: number;
      style?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
    };
    contactForm?: {
      enabled: boolean;
      fields: Array<{
        id: string;
        type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
        label: string;
        placeholder?: string;
        required: boolean;
        options?: string[];
      }>;
      submitText: string;
      successMessage: string;
      emailTo: string;
    };
  };
}

// Union type for all content sections
export type ContentSection = 
  | HeroContentSection
  | AboutContentSection
  | ServicesContentSection
  | GalleryContentSection
  | TestimonialsContentSection
  | ContactContentSection;

// Business content structure
export interface BusinessContent {
  businessId: string;
  sections: ContentSection[];
  metadata: {
    templateId: string;
    templateVersion: string;
    lastModified: Date;
    lastModifiedBy: string;
    status: 'draft' | 'published' | 'archived';
    version: number;
    publishedAt?: Date;
    seoSettings?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
      ogImage?: MediaAsset;
      canonicalUrl?: string;
    };
  };
  customCss?: string;
  customJs?: string;
}

// Template definition
export interface BusinessTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: MediaAsset;
  defaultSections: Array<{
    type: string;
    title: string;
    defaultContent: any;
    isRequired: boolean;
    order: number;
  }>;
  customization: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    layout: {
      maxWidth: string;
      spacing: 'compact' | 'normal' | 'spacious';
    };
  };
  features: string[];
  version: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Content validation result
export interface ContentValidationResult {
  isValid: boolean;
  errors: Array<{
    sectionId: string;
    sectionType: string;
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  completionPercentage: number;
  seoScore: number;
  recommendations: string[];
}

// Content publishing options
export interface PublishOptions {
  status: 'draft' | 'published';
  scheduledPublishDate?: Date;
  notifyUsers?: boolean;
  backupPrevious?: boolean;
  generateSitemap?: boolean;
  clearCache?: boolean;
}

// Content analytics
export interface ContentAnalytics {
  sectionId: string;
  sectionType: string;
  metrics: {
    views: number;
    engagement: number;
    conversions: number;
    timeSpent: number;
    bounceRate: number;
  };
  period: {
    start: Date;
    end: Date;
  };
}

// Export utility types
export type ContentSectionType = ContentSection['type'];
export type ContentSectionContent<T extends ContentSectionType> = Extract<ContentSection, { type: T }>['content'];

// Helper type for creating new content sections
export type CreateContentSectionInput<T extends ContentSectionType> = Omit<
  Extract<ContentSection, { type: T }>,
  'id' | 'lastModified' | 'metadata'
> & {
  id?: string;
};