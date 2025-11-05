import { NextRequest, NextResponse } from 'next/server';
import { ContentRepository } from '@/lib/repositories/ContentRepository';
import { ContentSection } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  let businessId = 'unknown';
  let sectionId = 'unknown';
  try {
    const { id, sectionId: secId } = await params;
    businessId = id;
    sectionId = secId;
    const data = await request.json();

    const repo = new ContentRepository();
    const contentIn = { ...(data?.content ?? {}) } as any;
    if (sectionId === 'hero') {
      if (Array.isArray(contentIn.buttons) && !Array.isArray(contentIn.ctaButtons)) {
        contentIn.ctaButtons = contentIn.buttons;
      }
    } else if (sectionId === 'services' && Array.isArray(contentIn.services)) {
      contentIn.services = contentIn.services.map((item: any) => ({
        title: item?.title ?? item?.name ?? '',
        name: item?.name ?? item?.title ?? '',
        description: item?.description ?? '',
        icon: item?.icon ?? '',
        image: item?.image ?? '',
        price: item?.price ?? '',
        duration: item?.duration ?? '',
        features: Array.isArray(item?.features) ? item.features : [],
        category: item?.category ?? '',
        pricing: item?.pricing ?? undefined,
      }));
    } else if (sectionId === 'gallery' && Array.isArray(contentIn.images)) {
      // Normalize gallery images for template consumption
      contentIn.images = contentIn.images.map((img: any) => {
        // If it's a GalleryImage object from admin, extract just what the template needs
        if (img.media) {
          return {
            url: img.media.url || '',
            alt: img.alt || '',
            caption: img.caption || '',
          };
        }
        // Otherwise keep as-is
        return {
          url: img.url || img,
          alt: img.alt || '',
          caption: img.caption || '',
        };
      });
    }
    const updated = await repo.upsertContent(id, sectionId as ContentSection, contentIn);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Content section updated successfully'
    });
  } catch (error) {
    console.error(`PUT /api/businesses/${businessId}/content/${sectionId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  let businessId = 'unknown';
  let sectionId = 'unknown';
  try {
    const { id, sectionId: secId } = await params;
    businessId = id;
    sectionId = secId;
    const repo = new ContentRepository();
    const unpublished = await repo.unpublishContent(id, secId as ContentSection);

    return NextResponse.json({
      success: true,
      data: unpublished,
      message: 'Content section unpublished successfully'
    });
  } catch (error) {
    console.error(`DELETE /api/businesses/${businessId}/content/${sectionId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}