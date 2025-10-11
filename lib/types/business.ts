import { ObjectId } from 'mongodb';

export interface Business {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  industry: string;
  template: string;
  status: 'draft' | 'active' | 'inactive' | 'deleted';
  branding: BrandingConfig;
  seo: SEOData;
  contact: ContactInfo;
  socialMedia: SocialMediaLinks;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  favicon?: string;
  font?: string;
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface Location {
  name: string;
  address: string;
  phone?: string;
  hours: string;
  amenities?: string[];
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BusinessStats {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface CTAButton {
  text: string;
  link: string;
  style: 'primary' | 'secondary';
  icon?: string;
}