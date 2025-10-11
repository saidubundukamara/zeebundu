import { NextRequest, NextResponse } from 'next/server';
import { CloudinaryService } from '@/lib/cloudinary';
import { MediaRepository } from '@/lib/repositories/MediaRepository';
import { MediaAsset } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const businessId = formData.get('businessId') as string;
    const alt = formData.get('alt') as string;
    const tags = formData.get('tags') as string;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images and videos are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64 for Cloudinary
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const cloudinaryResult = await CloudinaryService.uploadBusinessMedia(
      base64String,
      businessId || 'global',
      category
    );

    // Generate thumbnail URL
    const thumbnailUrl = CloudinaryService.generateThumbnail(
      cloudinaryResult.public_id,
      300,
      200
    );

    // Parse tags
    const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

    // Create media asset record
    const mediaAsset: Omit<MediaAsset, '_id'> = {
      filename: cloudinaryResult.public_id,
      originalName: file.name,
      url: cloudinaryResult.secure_url,
      thumbnailUrl,
      size: file.size,
      mimeType: file.type,
      dimensions: {
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
      },
      alt: alt || file.name,
      businessId: businessId ? new ObjectId(businessId) : undefined,
      tags: parsedTags,
      metadata: {
        category,
        description: alt || '',
        optimization: {
          quality: 80,
          format: cloudinaryResult.format as 'webp' | 'jpg' | 'png' | 'avif',
        },
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinaryUrl: cloudinaryResult.secure_url,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to database
    const mediaRepository = new MediaRepository();
    const savedMedia = await mediaRepository.create(mediaAsset);

    return NextResponse.json({
      success: true,
      data: {
        ...savedMedia,
        cloudinary: cloudinaryResult,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Media upload endpoint. Use POST to upload files.' },
    { status: 200 }
  );
}