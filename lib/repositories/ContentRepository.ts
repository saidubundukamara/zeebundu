import { ObjectId } from 'mongodb';
import { BusinessContent, ContentSection } from '../types';
import { COLLECTIONS } from '../utils/constants';
import { BaseRepository } from './BaseRepository';
import { IContentRepository, ContentUpdate } from '../interfaces/IContentRepository';

export class ContentRepository extends BaseRepository<BusinessContent> implements IContentRepository {
  constructor() {
    super(COLLECTIONS.BUSINESS_CONTENT);
  }

  async findByBusinessId(businessId: string | ObjectId): Promise<BusinessContent[]> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    return await this.findMany({ 
      filter: { businessId: id },
      sort: { section: 1, version: -1 }
    });
  }

  async findByBusinessAndSection(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent | null> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    return await this.findOne({
      filter: { businessId: id, section },
      sort: { version: -1 }
    });
  }

  async findActiveContentByBusiness(businessId: string | ObjectId): Promise<BusinessContent[]> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    return await this.findMany({
      filter: { businessId: id, isActive: true },
      sort: { section: 1 }
    });
  }

  async upsertContent(businessId: string | ObjectId, section: ContentSection, content: any): Promise<BusinessContent> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    
    // Find existing content
    const existing = await this.findByBusinessAndSection(id, section);
    
    if (existing) {
      // Update existing content
      const updated = await this.updateById(existing._id!, {
        $set: {
          content,
          isActive: true
        }
      });
      return updated!;
    } else {
      // Create new content
      return await this.create({
        businessId: id,
        section,
        content,
        isActive: true,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  async publishContent(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent | null> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    const content = await this.findByBusinessAndSection(id, section);
    
    if (!content) {
      throw new Error(`Content not found for section ${section}`);
    }

    return await this.updateById(content._id!, {
      $set: { isActive: true }
    });
  }

  async unpublishContent(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent | null> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    const content = await this.findByBusinessAndSection(id, section);
    
    if (!content) {
      throw new Error(`Content not found for section ${section}`);
    }

    return await this.updateById(content._id!, {
      $set: { isActive: false }
    });
  }

  async createContentVersion(businessId: string | ObjectId, section: ContentSection, content: any): Promise<BusinessContent> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    
    // Get the highest version number
    const latestVersion = await this.getLatestContentVersion(id, section);
    const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

    return await this.create({
      businessId: id,
      section,
      content,
      isActive: true,
      version: nextVersion,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async getContentVersions(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent[]> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    return await this.findMany({
      filter: { businessId: id, section },
      sort: { version: -1 }
    });
  }

  async getLatestContentVersion(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent | null> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    return await this.findOne({
      filter: { businessId: id, section },
      sort: { version: -1 }
    });
  }

  async rollbackToVersion(businessId: string | ObjectId, section: ContentSection, version: number): Promise<BusinessContent | null> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    
    // Find the specific version
    const versionContent = await this.findOne({
      filter: { businessId: id, section, version }
    });

    if (!versionContent) {
      throw new Error(`Version ${version} not found for section ${section}`);
    }

    // Create a new version with the content from the specified version
    return await this.createContentVersion(id, section, versionContent.content);
  }

  async getBusinessContentStructure(businessId: string | ObjectId): Promise<Record<string, any>> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    const activeContent = await this.findActiveContentByBusiness(id);
    
    return activeContent.reduce((acc, item) => {
      acc[item.section] = item.content;
      return acc;
    }, {} as Record<string, any>);
  }

  async updateMultipleSections(businessId: string | ObjectId, updates: ContentUpdate[]): Promise<BusinessContent[]> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    const results: BusinessContent[] = [];

    for (const update of updates) {
      const result = await this.upsertContent(id, update.section, update.content);
      results.push(result);
    }

    return results;
  }

  async deleteBusinessContent(businessId: string | ObjectId): Promise<number> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    return await this.deleteMany({ filter: { businessId: id } });
  }

  // Additional utility methods
  async getContentSummary(businessId: string | ObjectId): Promise<{
    totalSections: number;
    activeSections: number;
    lastUpdated: Date;
    sections: { section: ContentSection; isActive: boolean; version: number; updatedAt: Date }[];
  }> {
    const id = typeof businessId === 'string' ? new ObjectId(businessId) : businessId;
    const collection = await this.getCollection();

    const pipeline = [
      { $match: { businessId: id } },
      { $sort: { section: 1, version: -1 } },
      {
        $group: {
          _id: '$section',
          latestVersion: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$latestVersion' } },
      { $sort: { section: 1 } }
    ];

    const sections = await collection.aggregate(pipeline).toArray();
    const activeSections = sections.filter(s => s.isActive);
    const lastUpdated = sections.length > 0 
      ? new Date(Math.max(...sections.map(s => s.updatedAt.getTime())))
      : new Date();

    return {
      totalSections: sections.length,
      activeSections: activeSections.length,
      lastUpdated,
      sections: sections.map(s => ({
        section: s.section,
        isActive: s.isActive,
        version: s.version,
        updatedAt: s.updatedAt
      }))
    };
  }

  async duplicateBusinessContent(sourceBusinessId: string | ObjectId, targetBusinessId: string | ObjectId): Promise<BusinessContent[]> {
    const sourceId = typeof sourceBusinessId === 'string' ? new ObjectId(sourceBusinessId) : sourceBusinessId;
    const targetId = typeof targetBusinessId === 'string' ? new ObjectId(targetBusinessId) : targetBusinessId;
    
    const sourceContent = await this.findActiveContentByBusiness(sourceId);
    const results: BusinessContent[] = [];

    for (const content of sourceContent) {
      const duplicated = await this.create({
        businessId: targetId,
        section: content.section,
        content: content.content,
        isActive: content.isActive,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      results.push(duplicated);
    }

    return results;
  }
}