import { BusinessTemplate } from '../types';
import { COLLECTIONS } from '../utils/constants';
import { BaseRepository } from './BaseRepository';

export class TemplateRepository extends BaseRepository<BusinessTemplate> {
  constructor() {
    super(COLLECTIONS.BUSINESS_TEMPLATES);
  }

  async findBySlug(slug: string): Promise<BusinessTemplate | null> {
    return await this.findOne({ filter: { slug } });
  }

  async findByCategory(category: string): Promise<BusinessTemplate[]> {
    return await this.findMany({ 
      filter: { category, isActive: true },
      sort: { displayName: 1 }
    });
  }

  async findActiveTemplates(): Promise<BusinessTemplate[]> {
    return await this.findMany({ 
      filter: { isActive: true },
      sort: { displayName: 1 }
    });
  }

  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const filter: any = { slug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    
    const existing = await this.findOne({ filter });
    return !existing;
  }

  async getTemplatesByComponent(component: string): Promise<BusinessTemplate[]> {
    return await this.findMany({ 
      filter: { component, isActive: true }
    });
  }

  async getTemplateCategories(): Promise<string[]> {
    const collection = await this.getCollection();
    const categories = await collection.distinct('category', { isActive: true });
    return categories.sort();
  }

  async searchTemplates(searchTerm: string): Promise<BusinessTemplate[]> {
    const searchRegex = new RegExp(searchTerm, 'i');
    return await this.findMany({
      filter: {
        $or: [
          { name: { $regex: searchRegex } },
          { displayName: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { category: { $regex: searchRegex } }
        ],
        isActive: true
      },
      sort: { displayName: 1 }
    });
  }

  async activateTemplate(id: string): Promise<BusinessTemplate | null> {
    return await this.updateById(id, {
      $set: { isActive: true }
    });
  }

  async deactivateTemplate(id: string): Promise<BusinessTemplate | null> {
    return await this.updateById(id, {
      $set: { isActive: false }
    });
  }
}