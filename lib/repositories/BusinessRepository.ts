import { ObjectId } from 'mongodb';
import { Business } from '../types';
import { COLLECTIONS, BUSINESS_STATUS } from '../utils/constants';
import { BaseRepository } from './BaseRepository';
import { IBusinessRepository, BusinessFilters } from '../interfaces/IBusinessRepository';

export class BusinessRepository extends BaseRepository<Business> implements IBusinessRepository {
  constructor() {
    super(COLLECTIONS.BUSINESSES);
  }

  async findBySlug(slug: string): Promise<Business | null> {
    return await this.findOne({ filter: { slug } });
  }

  async findByTemplate(template: string): Promise<Business[]> {
    return await this.findMany({ filter: { template } });
  }

  async findByIndustry(industry: string): Promise<Business[]> {
    return await this.findMany({ filter: { industry } });
  }

  async findByStatus(status: string): Promise<Business[]> {
    return await this.findMany({ filter: { status } });
  }

  async findActiveBusinesses(): Promise<Business[]> {
    return await this.findMany({ 
      filter: { status: BUSINESS_STATUS.ACTIVE },
      sort: { createdAt: -1 }
    });
  }

  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    const filter: any = { slug };
    if (excludeId) {
      filter._id = { $ne: new ObjectId(excludeId) };
    }
    
    const existing = await this.findOne({ filter });
    return !existing;
  }

  async validateSlugUniqueness(slug: string, excludeId?: string): Promise<void> {
    const isAvailable = await this.isSlugAvailable(slug, excludeId);
    if (!isAvailable) {
      throw new Error(`Business with slug "${slug}" already exists`);
    }
  }

  async activateBusiness(id: string): Promise<Business | null> {
    return await this.updateById(id, {
      $set: { status: BUSINESS_STATUS.ACTIVE }
    });
  }

  async deactivateBusiness(id: string): Promise<Business | null> {
    return await this.updateById(id, {
      $set: { status: BUSINESS_STATUS.COMING_SOON }
    });
  }

  async softDeleteBusiness(id: string): Promise<Business | null> {
    return await this.updateById(id, {
      $set: { status: BUSINESS_STATUS.DELETED }
    });
  }

  async searchBusinesses(searchTerm: string): Promise<Business[]> {
    const searchRegex = new RegExp(searchTerm, 'i');
    return await this.findMany({
      filter: {
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { industry: { $regex: searchRegex } },
          { 'seo.keywords': { $in: [searchRegex] } }
        ],
        status: { $ne: BUSINESS_STATUS.DELETED }
      },
      sort: { updatedAt: -1 }
    });
  }

  async getBusinessesByFilters(filters: BusinessFilters): Promise<Business[]> {
    const query: any = {};

    if (filters.template) {
      query.template = filters.template;
    }

    if (filters.industry) {
      query.industry = filters.industry;
    }

    if (filters.status) {
      // Handle both string status and object status (e.g., { $in: [...] })
      if (typeof filters.status === 'object' && !Array.isArray(filters.status)) {
        // For object filters like { $in: [...] }, use it directly but exclude deleted
        if (filters.status.$in) {
          query.status = { 
            $in: filters.status.$in.filter((s: string) => s !== BUSINESS_STATUS.DELETED)
          };
        } else {
          query.status = filters.status;
        }
      } else {
        // String status
        query.status = filters.status;
      }
    } else {
      // If no status filter, exclude deleted by default
      query.status = { $ne: BUSINESS_STATUS.DELETED };
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { industry: { $regex: searchRegex } }
      ];
    }

    if (filters.createdAfter || filters.createdBefore) {
      query.createdAt = {};
      if (filters.createdAfter) {
        query.createdAt.$gte = filters.createdAfter;
      }
      if (filters.createdBefore) {
        query.createdAt.$lte = filters.createdBefore;
      }
    }

    return await this.findMany({
      filter: query,
      sort: { updatedAt: -1 }
    });
  }

  // Additional business-specific methods
  async getBusinessStats(): Promise<{
    total: number;
    active: number;
    drafts: number;
    byTemplate: Record<string, number>;
    byIndustry: Record<string, number>;
  }> {
    const collection = await this.getCollection();

    const [totalResult, statusStats, templateStats, industryStats] = await Promise.all([
      collection.countDocuments({ status: { $ne: BUSINESS_STATUS.DELETED } }),
      collection.aggregate([
        { $match: { status: { $ne: BUSINESS_STATUS.DELETED } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray(),
      collection.aggregate([
        { $match: { status: { $ne: BUSINESS_STATUS.DELETED } } },
        { $group: { _id: '$template', count: { $sum: 1 } } }
      ]).toArray(),
      collection.aggregate([
        { $match: { status: { $ne: BUSINESS_STATUS.DELETED } } },
        { $group: { _id: '$industry', count: { $sum: 1 } } }
      ]).toArray()
    ]);

    const statusMap = statusStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const templateMap = templateStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const industryMap = industryStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalResult,
      active: statusMap[BUSINESS_STATUS.ACTIVE] || 0,
      drafts: statusMap[BUSINESS_STATUS.DRAFT] || 0,
      byTemplate: templateMap,
      byIndustry: industryMap,
    };
  }

  async getRecentBusinesses(limit: number = 10): Promise<Business[]> {
    return await this.findMany({
      filter: { status: { $ne: BUSINESS_STATUS.DELETED } },
      sort: { createdAt: -1 },
      limit
    });
  }
}