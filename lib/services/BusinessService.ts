import { Business, ApiResponse } from '../types';
import { BusinessRepository } from '../repositories/BusinessRepository';
import { businessSchema } from '../utils/validation';
import { sanitizeSlug } from '../utils/validation';
import { BUSINESS_STATUS } from '../utils/constants';

export class BusinessService {
  private businessRepository: BusinessRepository;

  constructor() {
    this.businessRepository = new BusinessRepository();
  }
  async createBusiness(data: Omit<Business, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Business>> {
    try {
      // Validate input data
      const validatedData = businessSchema.parse(data);
      
      // Sanitize and validate slug
      const sanitizedSlug = sanitizeSlug(validatedData.slug);
      await this.businessRepository.validateSlugUniqueness(sanitizedSlug);
      
      // Create business with sanitized slug
      const business = await this.businessRepository.create({
        ...validatedData,
        slug: sanitizedSlug,
        status: validatedData.status || BUSINESS_STATUS.DRAFT,
      });

      return {
        success: true,
        data: business,
        message: 'Business created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create business'
      };
    }
  }

  async updateBusiness(id: string, data: Partial<Business>): Promise<ApiResponse<Business>> {
    try {
      // Check if business exists
      const existing = await this.businessRepository.findById(id);
      if (!existing) {
        return {
          success: false,
          error: 'Business not found'
        };
      }

      // If slug is being updated, validate uniqueness
      if (data.slug) {
        const sanitizedSlug = sanitizeSlug(data.slug);
        await this.businessRepository.validateSlugUniqueness(sanitizedSlug, id);
        data.slug = sanitizedSlug;
      }

      // Validate partial data - skip full validation for updates to avoid schema mismatch
      // Only validate specific fields that are being updated
      if (data.slug) {
        const sanitizeSlugValidation = sanitizeSlug(data.slug);
        if (!sanitizeSlugValidation || sanitizeSlugValidation !== data.slug) {
          data.slug = sanitizeSlugValidation;
        }
      }
      
      // Validate color formats if provided
      if (data.branding?.primaryColor && !/^#[0-9A-F]{6}$/i.test(data.branding.primaryColor)) {
        throw new Error('Invalid primary color format');
      }
      if (data.branding?.secondaryColor && !/^#[0-9A-F]{6}$/i.test(data.branding.secondaryColor)) {
        throw new Error('Invalid secondary color format');
      }
      
      // Validate email format if provided
      if (data.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
        throw new Error('Invalid email format');
      }

      const updatedBusiness = await this.businessRepository.updateById(id, { $set: data });
      
      if (!updatedBusiness) {
        // If update returns null, try to fetch the document to verify if the update actually succeeded
        const refetchedBusiness = await this.businessRepository.findById(id);
        if (refetchedBusiness) {
          // Update succeeded but findOneAndUpdate didn't return the document
          return {
            success: true,
            data: refetchedBusiness,
            message: 'Business updated successfully'
          };
        } else {
          return {
            success: false,
            error: 'Failed to update business'
          };
        }
      }

      return {
        success: true,
        data: updatedBusiness,
        message: 'Business updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update business'
      };
    }
  }

  async getBusinessById(id: string): Promise<ApiResponse<Business>> {
    try {
      const business = await this.businessRepository.findById(id);
      
      if (!business) {
        return {
          success: false,
          error: 'Business not found'
        };
      }

      return {
        success: true,
        data: business
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch business'
      };
    }
  }

  async getBusinessBySlug(slug: string): Promise<ApiResponse<Business>> {
    try {
      const business = await this.businessRepository.findBySlug(slug);
      
      if (!business) {
        return {
          success: false,
          error: 'Business not found'
        };
      }

      // Only return active businesses for public access
      if (business.status !== BUSINESS_STATUS.ACTIVE) {
        return {
          success: false,
          error: 'Business not available'
        };
      }

      return {
        success: true,
        data: business
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch business'
      };
    }
  }

  async getAllBusinesses(filters?: any): Promise<ApiResponse<Business[]>> {
    try {
      let businesses: Business[];
      
      if (filters) {
        businesses = await this.businessRepository.getBusinessesByFilters(filters);
      } else {
        businesses = await this.businessRepository.findAll();
      }

      return {
        success: true,
        data: businesses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch businesses'
      };
    }
  }

  async getActiveBusinesses(): Promise<ApiResponse<Business[]>> {
    try {
      const businesses = await this.businessRepository.findActiveBusinesses();
      
      return {
        success: true,
        data: businesses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch active businesses'
      };
    }
  }

  async searchBusinesses(searchTerm: string): Promise<ApiResponse<Business[]>> {
    try {
      const businesses = await this.businessRepository.searchBusinesses(searchTerm);
      
      return {
        success: true,
        data: businesses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search businesses'
      };
    }
  }

  async activateBusiness(id: string): Promise<ApiResponse<Business>> {
    try {
      const business = await this.businessRepository.activateBusiness(id);
      
      if (!business) {
        return {
          success: false,
          error: 'Business not found'
        };
      }

      return {
        success: true,
        data: business,
        message: 'Business activated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to activate business'
      };
    }
  }

  async deactivateBusiness(id: string): Promise<ApiResponse<Business>> {
    try {
      const business = await this.businessRepository.deactivateBusiness(id);
      
      if (!business) {
        return {
          success: false,
          error: 'Business not found'
        };
      }

      return {
        success: true,
        data: business,
        message: 'Business deactivated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to deactivate business'
      };
    }
  }

  async deleteBusiness(id: string, permanent: boolean = false): Promise<ApiResponse<boolean>> {
    try {
      let success: boolean;
      
      if (permanent) {
        success = await this.businessRepository.deleteById(id);
      } else {
        const business = await this.businessRepository.softDeleteBusiness(id);
        success = !!business;
      }

      if (!success) {
        return {
          success: false,
          error: 'Business not found'
        };
      }

      return {
        success: true,
        data: success,
        message: permanent ? 'Business deleted permanently' : 'Business deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete business'
      };
    }
  }

  async duplicateBusiness(id: string, newName: string, newSlug: string): Promise<ApiResponse<Business>> {
    try {
      const original = await this.businessRepository.findById(id);
      
      if (!original) {
        return {
          success: false,
          error: 'Original business not found'
        };
      }

      // Validate new slug uniqueness
      const sanitizedSlug = sanitizeSlug(newSlug);
      await this.businessRepository.validateSlugUniqueness(sanitizedSlug);

      // Create duplicate with new name and slug
      const { _id, createdAt, updatedAt, ...businessData } = original;
      const duplicatedBusiness = await this.businessRepository.create({
        ...businessData,
        name: newName,
        slug: sanitizedSlug,
        status: BUSINESS_STATUS.DRAFT,
      });

      return {
        success: true,
        data: duplicatedBusiness,
        message: 'Business duplicated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to duplicate business'
      };
    }
  }

  async getBusinessStats(): Promise<ApiResponse<any>> {
    try {
      const stats = await this.businessRepository.getBusinessStats();
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch business statistics'
      };
    }
  }

  async getBusinessesByTemplate(template: string): Promise<ApiResponse<Business[]>> {
    try {
      const businesses = await this.businessRepository.findByTemplate(template);
      
      return {
        success: true,
        data: businesses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch businesses by template'
      };
    }
  }

  async validateBusinessSlug(slug: string, excludeId?: string): Promise<ApiResponse<boolean>> {
    try {
      const sanitizedSlug = sanitizeSlug(slug);
      const isAvailable = await this.businessRepository.isSlugAvailable(sanitizedSlug, excludeId);
      
      return {
        success: true,
        data: isAvailable,
        message: isAvailable ? 'Slug is available' : 'Slug is already taken'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to validate slug'
      };
    }
  }

  async getRecentBusinesses(limit: number = 10): Promise<ApiResponse<Business[]>> {
    try {
      const businesses = await this.businessRepository.getRecentBusinesses(limit);
      
      return {
        success: true,
        data: businesses
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent businesses'
      };
    }
  }
}