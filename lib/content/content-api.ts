import { ObjectId } from 'mongodb';

export interface BusinessContentData {
  businessId: string;
  sections: ContentSectionData[];
  lastModified: Date;
  status: 'draft' | 'published' | 'archived';
  version: number;
}

export interface ContentSectionData {
  id: string;
  type: 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact';
  title: string;
  content: any;
  isActive: boolean;
  order: number;
  lastModified: Date;
}

// API endpoints for content management
export class ContentAPI {
  
  // Fetch business content
  static async getBusinessContent(businessId: string): Promise<BusinessContentData> {
    try {
      const response = await fetch(`/api/businesses/${businessId}/content`);
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching business content:', error);
      throw error;
    }
  }

  // Save business content
  static async saveBusinessContent(
    businessId: string, 
    content: BusinessContentData
  ): Promise<BusinessContentData> {
    try {
      const response = await fetch(`/api/businesses/${businessId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error(`Failed to save content: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving business content:', error);
      throw error;
    }
  }

  // Save individual section
  static async saveSection(
    businessId: string,
    sectionId: string,
    sectionData: Partial<ContentSectionData>
  ): Promise<ContentSectionData> {
    try {
      const response = await fetch(`/api/businesses/${businessId}/content/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save section: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving section:', error);
      throw error;
    }
  }

  // Publish business content
  static async publishContent(businessId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`/api/businesses/${businessId}/content/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to publish content: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error publishing content:', error);
      throw error;
    }
  }

  // Get content history/versions
  static async getContentHistory(businessId: string): Promise<BusinessContentData[]> {
    try {
      const response = await fetch(`/api/businesses/${businessId}/content/history`);
      if (!response.ok) {
        throw new Error(`Failed to fetch content history: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching content history:', error);
      throw error;
    }
  }

  // Validate content before publishing
  static async validateContent(businessId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const response = await fetch(`/api/businesses/${businessId}/content/validate`);
      if (!response.ok) {
        throw new Error(`Failed to validate content: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error validating content:', error);
      throw error;
    }
  }

  // Get content templates
  static async getContentTemplates(): Promise<any[]> {
    try {
      const response = await fetch('/api/content/templates');
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  // Apply template to business
  static async applyTemplate(
    businessId: string, 
    templateId: string
  ): Promise<BusinessContentData> {
    try {
      const response = await fetch(`/api/businesses/${businessId}/content/apply-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to apply template: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error applying template:', error);
      throw error;
    }
  }
}

// Utility functions for content management
export class ContentUtils {
  
  // Generate default content for a section type
  static generateDefaultContent(sectionType: string, businessInfo?: any) {
    switch (sectionType) {
      case 'hero':
        return {
          title: businessInfo?.name || 'Welcome to Our Business',
          subtitle: 'Professional services you can trust',
          description: 'Discover quality products and exceptional service tailored to meet your needs.',
          overlay: {
            enabled: true,
            color: '#000000',
            opacity: 50
          },
          textAlign: 'center',
          buttons: [
            {
              id: 'btn-1',
              text: 'Learn More',
              link: '#about',
              style: 'primary',
              isVisible: true
            }
          ],
          style: {
            titleSize: 'lg',
            titleColor: '#ffffff',
            descriptionColor: '#e5e7eb',
            backgroundColor: '#1f2937'
          }
        };

      case 'gallery':
        return {
          title: 'Gallery',
          description: 'Take a look at our work and facilities',
          layout: 'grid',
          columns: 3,
          images: []
        };

      case 'about':
        return {
          title: `About ${businessInfo?.name || 'Our Business'}`,
          description: 'Learn more about our company, mission, and values.',
          features: [
            'Quality Service',
            'Professional Team',
            'Customer Satisfaction',
            'Reliable Solutions'
          ],
          stats: [
            { label: 'Years Experience', value: '10+' },
            { label: 'Happy Customers', value: '1000+' },
            { label: 'Projects Completed', value: '500+' },
            { label: 'Team Members', value: '25+' }
          ]
        };

      case 'services':
        return {
          title: 'Our Services',
          description: 'Comprehensive solutions tailored to your needs',
          services: [
            {
              name: 'Service 1',
              description: 'Professional service description',
              icon: 'star',
              features: ['Feature 1', 'Feature 2', 'Feature 3']
            }
          ]
        };

      case 'contact':
        return {
          title: 'Contact Us',
          address: '123 Business St, City, State 12345',
          phone: '(555) 123-4567',
          email: 'contact@business.com',
          hours: {
            'Monday - Friday': '9:00 AM - 6:00 PM',
            'Saturday': '10:00 AM - 4:00 PM',
            'Sunday': 'Closed'
          }
        };

      case 'testimonials':
        return {
          title: 'What Our Customers Say',
          testimonials: []
        };

      default:
        return {};
    }
  }

  // Validate section content
  static validateSection(sectionType: string, content: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (sectionType) {
      case 'hero':
        if (!content.title || content.title.trim().length === 0) {
          errors.push('Hero title is required');
        }
        if (!content.description || content.description.trim().length === 0) {
          errors.push('Hero description is required');
        }
        if (content.title && content.title.length > 100) {
          warnings.push('Hero title is quite long - consider shortening for better impact');
        }
        break;

      case 'gallery':
        if (!content.images || content.images.length === 0) {
          warnings.push('Gallery has no images - consider adding some visual content');
        }
        break;

      case 'contact':
        if (!content.phone && !content.email) {
          errors.push('At least one contact method (phone or email) is required');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Calculate content completion percentage
  static calculateCompletionPercentage(sections: ContentSectionData[]): number {
    if (sections.length === 0) return 0;

    let totalScore = 0;
    let maxScore = 0;

    sections.forEach(section => {
      const validation = this.validateSection(section.type, section.content);
      maxScore += 100;
      
      if (validation.isValid) {
        totalScore += 100;
      } else {
        // Partial credit for sections with warnings only
        totalScore += validation.errors.length === 0 ? 75 : 25;
      }
    });

    return Math.round((totalScore / maxScore) * 100);
  }

  // Get SEO recommendations for content
  static getSEORecommendations(sections: ContentSectionData[]): string[] {
    const recommendations: string[] = [];

    const heroSection = sections.find(s => s.type === 'hero');
    if (heroSection) {
      if (!heroSection.content.title || heroSection.content.title.length < 10) {
        recommendations.push('Hero title should be descriptive and at least 10 characters long');
      }
      if (!heroSection.content.description || heroSection.content.description.length < 50) {
        recommendations.push('Hero description should be detailed and at least 50 characters long');
      }
    }

    const gallerySection = sections.find(s => s.type === 'gallery');
    if (gallerySection && gallerySection.content.images) {
      const imagesWithoutAlt = gallerySection.content.images.filter(
        (img: any) => !img.alt || img.alt.trim().length === 0
      );
      if (imagesWithoutAlt.length > 0) {
        recommendations.push(`${imagesWithoutAlt.length} gallery images missing alt text for accessibility`);
      }
    }

    return recommendations;
  }
}