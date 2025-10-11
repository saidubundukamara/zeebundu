import { ObjectId } from 'mongodb';
import { MediaAsset } from '../types';
import { COLLECTIONS } from '../utils/constants';
import { BaseRepository } from './BaseRepository';

export class MediaRepository extends BaseRepository<MediaAsset> {
  constructor() {
    super(COLLECTIONS.MEDIA);
  }

  async findByBusinessId(businessId: string | ObjectId): Promise<MediaAsset[]> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    return await this.findMany({ 
      filter: { businessId: id },
      sort: { createdAt: -1 }
    });
  }

  async findByType(type: string): Promise<MediaAsset[]> {
    return await this.findMany({ 
      filter: { mimeType: { $regex: `^${type}/` } },
      sort: { createdAt: -1 }
    });
  }

  async findByTags(tags: string[]): Promise<MediaAsset[]> {
    return await this.findMany({ 
      filter: { tags: { $in: tags } },
      sort: { createdAt: -1 }
    });
  }

  async findByFilename(filename: string): Promise<MediaAsset | null> {
    return await this.findOne({ filter: { filename } });
  }

  async searchMedia(searchTerm: string, businessId?: string | ObjectId): Promise<MediaAsset[]> {
    const searchRegex = new RegExp(searchTerm, 'i');
    const filter: any = {
      $or: [
        { filename: { $regex: searchRegex } },
        { originalName: { $regex: searchRegex } },
        { alt: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } }
      ]
    };

    if (businessId) {
      const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
      filter.businessId = id;
    }

    return await this.findMany({
      filter,
      sort: { createdAt: -1 }
    });
  }

  async getMediaByFilters(filters: MediaFilters): Promise<MediaAsset[]> {
    const filter: any = {};

    if (filters.businessId) {
      const id = typeof filters.businessId === 'string' ? new ObjectId(filters.businessId) : filters.businessId;
      filter.businessId = id;
    }

    if (filters.type) {
      filter.mimeType = { $regex: `^${filters.type}/` };
    }

    if (filters.tags && filters.tags.length > 0) {
      filter.tags = { $in: filters.tags };
    }

    if (filters.minSize || filters.maxSize) {
      filter.size = {};
      if (filters.minSize) filter.size.$gte = filters.minSize;
      if (filters.maxSize) filter.size.$lte = filters.maxSize;
    }

    if (filters.uploadedAfter || filters.uploadedBefore) {
      filter.createdAt = {};
      if (filters.uploadedAfter) filter.createdAt.$gte = filters.uploadedAfter;
      if (filters.uploadedBefore) filter.createdAt.$lte = filters.uploadedBefore;
    }

    return await this.findMany({
      filter,
      sort: { createdAt: -1 },
      limit: filters.limit,
      skip: filters.skip
    });
  }

  async deleteByBusinessId(businessId: string | ObjectId): Promise<number> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    return await this.deleteMany({ filter: { businessId: id } });
  }

  async updateTags(id: string | ObjectId, tags: string[]): Promise<MediaAsset | null> {
    return await this.updateById(id, {
      $set: { tags }
    });
  }

  async addTags(id: string | ObjectId, tags: string[]): Promise<MediaAsset | null> {
    return await this.updateById(id, {
      $addToSet: { tags: { $each: tags } }
    });
  }

  async removeTags(id: string | ObjectId, tags: string[]): Promise<MediaAsset | null> {
    return await this.updateById(id, {
      $pull: { tags: { $in: tags } }
    });
  }

  async updateAltText(id: string | ObjectId, alt: string): Promise<MediaAsset | null> {
    return await this.updateById(id, {
      $set: { alt }
    });
  }

  async getMediaStats(businessId?: string | ObjectId): Promise<{
    totalFiles: number;
    totalSize: number;
    averageSize: number;
    typeBreakdown: Record<string, number>;
    tagCounts: Record<string, number>;
  }> {
    const collection = await this.getCollection();
    const matchStage: any = {};

    if (businessId) {
      const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
      matchStage.businessId = id;
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$size' },
          averageSize: { $avg: '$size' },
          files: { $push: '$$ROOT' }
        }
      }
    ];

    const [stats] = await collection.aggregate(pipeline).toArray();

    if (!stats) {
      return {
        totalFiles: 0,
        totalSize: 0,
        averageSize: 0,
        typeBreakdown: {},
        tagCounts: {}
      };
    }

    // Calculate type breakdown
    const typeBreakdown: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};

    stats.files.forEach((file: MediaAsset) => {
      const type = file.mimeType.split('/')[0];
      typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;

      file.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      totalFiles: stats.totalFiles,
      totalSize: stats.totalSize,
      averageSize: Math.round(stats.averageSize),
      typeBreakdown,
      tagCounts
    };
  }

  async getRecentMedia(businessId?: string | ObjectId, limit: number = 20): Promise<MediaAsset[]> {
    const filter: any = {};
    
    if (businessId) {
      const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
      filter.businessId = id;
    }

    return await this.findMany({
      filter,
      sort: { createdAt: -1 },
      limit
    });
  }

  async getPopularTags(businessId?: string | ObjectId, limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
    const collection = await this.getCollection();
    const matchStage: any = {};

    if (businessId) {
      const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
      matchStage.businessId = id;
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { tag: '$_id', count: 1, _id: 0 } }
    ];

    return await collection.aggregate(pipeline).toArray();
  }
}

export interface MediaFilters {
  businessId?: string | ObjectId;
  type?: string;
  tags?: string[];
  minSize?: number;
  maxSize?: number;
  uploadedAfter?: Date;
  uploadedBefore?: Date;
  limit?: number;
  skip?: number;
}