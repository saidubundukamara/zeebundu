import { ObjectId } from 'mongodb';

export interface MediaAsset {
  _id?: ObjectId;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  dimensions?: MediaDimensions;
  alt?: string;
  businessId?: ObjectId;
  tags: string[];
  metadata?: MediaMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaDimensions {
  width: number;
  height: number;
}

export interface MediaMetadata {
  uploadedBy?: string;
  description?: string;
  category?: string;
  optimization?: OptimizationSettings;
}

export interface OptimizationSettings {
  quality: number;
  format: 'webp' | 'jpg' | 'png' | 'avif';
  sizes?: ImageSize[];
}

export interface ImageSize {
  width: number;
  height?: number;
  suffix: string;
}

export interface UploadRequest {
  file: File;
  businessId?: string;
  alt?: string;
  tags?: string[];
  category?: string;
}

export interface UploadResponse {
  success: boolean;
  data?: MediaAsset;
  error?: string;
}