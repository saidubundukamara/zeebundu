import { z } from 'zod';

// Business validation schemas
export const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100, 'Business name too long'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(50, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  industry: z.string().min(1, 'Industry is required'),
  template: z.string().min(1, 'Template is required'),
  status: z.enum(['draft', 'active', 'inactive', 'deleted']),
  branding: z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    logo: z.string().url().optional(),
    favicon: z.string().url().optional(),
    font: z.string().optional(),
  }),
  seo: z.object({
    metaTitle: z.string().min(1, 'Meta title is required').max(60, 'Meta title too long'),
    metaDescription: z.string().min(1, 'Meta description is required').max(160, 'Meta description too long'),
    keywords: z.array(z.string()).max(10, 'Too many keywords'),
    ogImage: z.string().url().optional(),
    canonicalUrl: z.string().url().optional(),
  }),
  contact: z.object({
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email format'),
    address: z.string().min(1, 'Address is required'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }).optional(),
});

// Content validation schemas
export const heroContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  subtitle: z.string().max(200, 'Subtitle too long').optional(),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  backgroundImage: z.string().url('Invalid image URL'),
  backgroundVideo: z.string().url().optional(),
  ctaButtons: z.array(z.object({
    text: z.string().min(1, 'Button text is required'),
    link: z.string().url('Invalid link URL'),
    style: z.enum(['primary', 'secondary']),
    icon: z.string().optional(),
  })).max(3, 'Too many CTA buttons'),
  badges: z.array(z.string()).optional(),
  gradient: z.string().optional(),
  theme: z.string().optional(),
});

export const serviceItemSchema = z.object({
  title: z.string().min(1, 'Service title is required'),
  description: z.string().min(1, 'Service description is required'),
  icon: z.string().min(1, 'Icon is required'),
  image: z.string().url().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  features: z.array(z.string()).optional(),
  category: z.string().optional(),
  pricing: z.record(z.string()).optional(),
});

export const servicesContentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  services: z.array(serviceItemSchema).min(1, 'At least one service is required'),
});

// Template validation schema
export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  component: z.string().min(1, 'Component name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  isActive: z.boolean(),
});

// Media validation schema
export const mediaUploadSchema = z.object({
  businessId: z.string().optional(),
  alt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
});

// Utility functions
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function validateColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}