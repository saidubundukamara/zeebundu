import { ObjectId } from 'mongodb';
import { BusinessContent, ContentSection } from '../types';
import { IBaseRepository } from './IBaseRepository';

export interface IContentRepository extends IBaseRepository<BusinessContent> {
  // Content-specific operations
  findByBusinessId(businessId: string | ObjectId): Promise<BusinessContent[]>;
  findByBusinessAndSection(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent | null>;
  findActiveContentByBusiness(businessId: string | ObjectId): Promise<BusinessContent[]>;
  
  // Content management
  upsertContent(businessId: string | ObjectId, section: ContentSection, content: any): Promise<BusinessContent>;
  publishContent(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent | null>;
  unpublishContent(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent | null>;
  
  // Versioning
  createContentVersion(businessId: string | ObjectId, section: ContentSection, content: any): Promise<BusinessContent>;
  getContentVersions(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent[]>;
  getLatestContentVersion(businessId: string | ObjectId, section: ContentSection): Promise<BusinessContent | null>;
  rollbackToVersion(businessId: string | ObjectId, section: ContentSection, version: number): Promise<BusinessContent | null>;
  
  // Bulk operations
  getBusinessContentStructure(businessId: string | ObjectId): Promise<Record<string, any>>;
  updateMultipleSections(businessId: string | ObjectId, updates: ContentUpdate[]): Promise<BusinessContent[]>;
  deleteBusinessContent(businessId: string | ObjectId): Promise<number>;
}

export interface ContentUpdate {
  section: ContentSection;
  content: any;
}