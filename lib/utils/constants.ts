// Collection names constants
export const COLLECTIONS = {
  BUSINESSES: 'businesses',
  BUSINESS_CONTENT: 'business_content',
  BUSINESS_TEMPLATES: 'business_templates',
  MEDIA: 'media',
  ADMIN_USERS: 'admin_users',
} as const;

// Business template constants based on existing pages
export const BUSINESS_TEMPLATES = {
  GAS_STATION: 'gas-station',
  HOTEL: 'hotel',
  FARMING: 'farming',
  LIVESTOCK: 'livestock',
  POULTRY: 'poultry',
  FISH_FARMING: 'fish-farming',
  WATER_PRODUCTION: 'water-production',
  NATURAL_JUICES: 'natural-juices',
  BEVERAGES: 'beverages',
  SALON: 'salon',
  ZEEMART: 'zeemart',
  PHARMACY: 'pharmacy',
  CONSTRUCTION: 'construction',
  FOREX: 'forex',
  PETROLEUM: 'petroleum',
} as const;

export const BUSINESS_CATEGORIES = {
  ENERGY: 'energy',
  HOSPITALITY: 'hospitality',
  AGRICULTURE: 'agriculture',
  FOOD_BEVERAGE: 'food-beverage',
  RETAIL: 'retail',
  HEALTHCARE: 'healthcare',
  BEAUTY: 'beauty',
  CONSTRUCTION: 'construction',
  FINANCE: 'finance',
} as const;

export const CONTENT_SECTIONS = {
  HERO: 'hero',
  ABOUT: 'about',
  SERVICES: 'services',
  GALLERY: 'gallery',
  TESTIMONIALS: 'testimonials',
  CONTACT: 'contact',
  LOCATIONS: 'locations',
  STATS: 'stats',
  FEATURES: 'features',
} as const;

export const BUSINESS_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMING_SOON: 'coming-soon',
  DELETED: 'deleted',
} as const;

export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;

export const IMAGE_FORMATS = {
  WEBP: 'webp',
  JPG: 'jpg',
  PNG: 'png',
  AVIF: 'avif',
} as const;

// Default configurations
export const DEFAULT_BRANDING = {
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  font: 'Inter',
};

export const DEFAULT_IMAGE_SIZES = [
  { width: 400, suffix: 'sm' },
  { width: 800, suffix: 'md' },
  { width: 1200, suffix: 'lg' },
  { width: 1920, suffix: 'xl' },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

// API pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  BUSINESS_PAGE: 3600, // 1 hour
  TEMPLATE_DATA: 86400, // 24 hours
  MEDIA_ASSETS: 3600, // 1 hour
} as const;

// Error codes
export const ERROR_CODES = {
  BUSINESS_NOT_FOUND: 'BUSINESS_NOT_FOUND',
  SLUG_ALREADY_EXISTS: 'SLUG_ALREADY_EXISTS',
  TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;