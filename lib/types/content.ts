import { ObjectId } from 'mongodb';
import { CTAButton, BusinessStats, Location } from './business';

export interface BusinessContent {
  _id?: ObjectId;
  businessId: ObjectId;
  section: ContentSection;
  content: SectionContent;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ContentSection = 
  | 'hero' 
  | 'about' 
  | 'services' 
  | 'gallery' 
  | 'testimonials' 
  | 'contact' 
  | 'locations'
  | 'stats'
  | 'features';

export type SectionContent = 
  | HeroContent 
  | AboutContent 
  | ServicesContent 
  | GalleryContent 
  | TestimonialsContent 
  | ContactContent 
  | LocationsContent
  | StatsContent
  | FeaturesContent;

export interface HeroContent {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  backgroundVideo?: string;
  ctaButtons: CTAButton[];
  badges?: string[];
  gradient?: string;
  theme?: string;
}

export interface AboutContent {
  title: string;
  description: string;
  mission?: string;
  vision?: string;
  values?: string[];
  stats?: BusinessStats[];
  image?: string;
  features?: string[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  image?: string;
  price?: string;
  duration?: string;
  features?: string[];
  category?: string;
  pricing?: Record<string, string>; // For gas station fuel pricing
}

export interface ServicesContent {
  title?: string;
  description?: string;
  services: ServiceItem[];
}

export interface GalleryImage {
  url: string;
  caption?: string;
  alt: string;
  category?: string;
}

export interface GalleryContent {
  title: string;
  description?: string;
  images: GalleryImage[];
}

export interface Testimonial {
  name: string;
  role?: string;
  company?: string;
  rating: number;
  comment: string;
  avatar?: string;
  date: string;
  featured?: boolean;
}

export interface TestimonialsContent {
  title?: string;
  description?: string;
  testimonials: Testimonial[];
}

export interface ContactContent {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  formFields?: ContactFormField[];
}

export interface ContactFormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface LocationsContent {
  title?: string;
  description?: string;
  locations: Location[];
}

export interface StatsContent {
  title?: string;
  description?: string;
  stats: BusinessStats[];
}

export interface FeaturesContent {
  title?: string;
  description?: string;
  features: string[];
}