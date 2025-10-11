import { NextRequest, NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories/MediaRepository';
import { CloudinaryService } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const tags = searchParams.get('tags');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    if (!ObjectId.isValid(businessId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid business ID' },
        { status: 400 }
      );
    }

    const mediaRepository = new MediaRepository();
    
    const filters = {
      businessId,
      type: type || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
      limit,
      skip,
    };

    // Add category filter if specified
    let media;
    if (category) {
      // Filter by category in metadata
      const allBusinessMedia = await mediaRepository.findByBusinessId(businessId);
      media = allBusinessMedia
        .filter(m => m.metadata?.category === category)
        .slice(skip, skip + limit);
    } else {
      media = await mediaRepository.getMediaByFilters(filters);
    }

    // Get stats for this business
    const stats = await mediaRepository.getMediaStats(businessId);

    return NextResponse.json({
      success: true,
      data: media,
      stats,
      total: media.length,
      pagination: {
        limit,
        skip,
        hasMore: media.length === limit,
      },
    });

  } catch (error) {
    console.error('Business media fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch business media' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    
    if (!ObjectId.isValid(businessId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid business ID' },
        { status: 400 }
      );
    }

    const mediaRepository = new MediaRepository();
    
    // Get all media for this business
    const businessMedia = await mediaRepository.findByBusinessId(businessId);
    
    // Delete from Cloudinary
    const cloudinaryPublicIds = businessMedia
      .map(media => media.metadata?.cloudinaryPublicId)
      .filter(Boolean) as string[];
    
    if (cloudinaryPublicIds.length > 0) {
      try {
        await CloudinaryService.deleteFiles(cloudinaryPublicIds);
      } catch (cloudinaryError) {
        console.error('Cloudinary bulk deletion failed:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete folder from Cloudinary
    try {
      await CloudinaryService.deleteFolder(`zeebundu/businesses/${businessId}`);
    } catch (folderError) {
      console.error('Cloudinary folder deletion failed:', folderError);
    }

    // Delete from database
    const deletedCount = await mediaRepository.deleteByBusinessId(businessId);

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} media assets for business`,
      deletedCount,
    });

  } catch (error) {
    console.error('Business media deletion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete business media' 
      },
      { status: 500 }
    );
  }
}