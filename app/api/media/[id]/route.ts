import { NextRequest, NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories/MediaRepository';
import { CloudinaryService } from '@/lib/cloudinary';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid media ID' },
        { status: 400 }
      );
    }

    const mediaRepository = new MediaRepository();
    const media = await mediaRepository.findById(id);

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: media,
    });

  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch media' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { alt, tags, metadata } = body;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid media ID' },
        { status: 400 }
      );
    }

    const mediaRepository = new MediaRepository();
    const existingMedia = await mediaRepository.findById(id);

    if (!existingMedia) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (alt !== undefined) updateData.alt = alt;
    if (tags !== undefined) updateData.tags = tags;
    if (metadata !== undefined) {
      updateData.metadata = { ...existingMedia.metadata, ...metadata };
    }

    const updatedMedia = await mediaRepository.updateById(id, {
      $set: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedMedia,
    });

  } catch (error) {
    console.error('Media update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update media' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid media ID' },
        { status: 400 }
      );
    }

    const mediaRepository = new MediaRepository();
    const media = await mediaRepository.findById(id);

    if (!media) {
      return NextResponse.json(
        { success: false, error: 'Media not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary if it has a public ID
    if (media.metadata?.cloudinaryPublicId) {
      try {
        await CloudinaryService.deleteFile(media.metadata.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion failed:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    await mediaRepository.deleteById(id);

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });

  } catch (error) {
    console.error('Media deletion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete media' 
      },
      { status: 500 }
    );
  }
}