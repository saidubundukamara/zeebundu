import { Business } from '../types';
import { IBaseRepository } from './IBaseRepository';

export interface IBusinessRepository extends IBaseRepository<Business> {
  // Business-specific operations
  findBySlug(slug: string): Promise<Business | null>;
  findByTemplate(template: string): Promise<Business[]>;
  findByIndustry(industry: string): Promise<Business[]>;
  findByStatus(status: string): Promise<Business[]>;
  findActiveBusinesses(): Promise<Business[]>;
  
  // Validation operations
  isSlugAvailable(slug: string, excludeId?: string): Promise<boolean>;
  validateSlugUniqueness(slug: string, excludeId?: string): Promise<void>;
  
  // Business management
  activateBusiness(id: string): Promise<Business | null>;
  deactivateBusiness(id: string): Promise<Business | null>;
  softDeleteBusiness(id: string): Promise<Business | null>;
  
  // Search and filtering
  searchBusinesses(searchTerm: string): Promise<Business[]>;
  getBusinessesByFilters(filters: BusinessFilters): Promise<Business[]>;
}

export interface BusinessFilters {
  template?: string;
  industry?: string;
  status?: string;
  search?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}