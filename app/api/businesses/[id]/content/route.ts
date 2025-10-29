import { NextRequest, NextResponse } from 'next/server';
import { ContentRepository } from '@/lib/repositories/ContentRepository';
import { ContentSection } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let businessId = 'unknown';
  try {
    const { id } = await params;
    businessId = id;

    const repo = new ContentRepository();
    const contents = await repo.findActiveContentByBusiness(id);

    // Normalize to admin-friendly array shape
    const data = contents.map((c) => {
      const isHero = c.section === 'hero';
      const isServices = c.section === 'services';
      const contentOut = isHero
        ? {
            ...(c.content || {}),
            // Expose admin-friendly alias
            buttons: (c as any).content?.buttons ?? (c as any).content?.ctaButtons ?? [],
          }
        : isServices
        ? {
            ...(c.content || {}),
            services: Array.isArray((c as any).content?.services)
              ? (c as any).content.services.map((s: any) => ({
                  // Ensure admin editor controlled inputs
                  name: s?.name ?? s?.title ?? '',
                  title: s?.title ?? s?.name ?? '',
                  description: s?.description ?? '',
                  icon: s?.icon ?? '',
                  image: s?.image ?? '',
                  price: s?.price ?? '',
                  duration: s?.duration ?? '',
                  features: Array.isArray(s?.features) ? s.features : [],
                  category: s?.category ?? '',
                  pricing: s?.pricing ?? undefined,
                }))
              : [],
          }
        : c.content;

      return {
        id: c.section,
        type: c.section,
        title: typeof contentOut?.title === 'string' ? contentOut.title : c.section,
        isActive: c.isActive,
        content: contentOut,
      };
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Content retrieved successfully'
    });
  } catch (error) {
    console.error(`GET /api/businesses/${businessId}/content error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let businessId = 'unknown';
  try {
    const { id } = await params;
    businessId = id;
    const body = await request.json();

    const repo = new ContentRepository();

    // Support two shapes:
    // 1) { sections: [{ id/type, content }] }
    // 2) direct array [{ id/type, content }]
    const sections = Array.isArray(body) ? body : Array.isArray(body?.sections) ? body.sections : [];

    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No sections provided' },
        { status: 400 }
      );
    }

    const updates = await Promise.all(
      sections.map(async (s: any) => {
        const sectionKey: ContentSection = (s.type || s.id) as ContentSection;
        if (!sectionKey) throw new Error('Missing section id/type');
        const contentIn = { ...(s.content ?? {}) } as any;
        if (sectionKey === 'hero') {
          if (Array.isArray(contentIn.buttons) && !Array.isArray(contentIn.ctaButtons)) {
            contentIn.ctaButtons = contentIn.buttons;
          }
        } else if (sectionKey === 'services' && Array.isArray(contentIn.services)) {
          // Normalize services items for consistency across admin/template
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
        }
        return await repo.upsertContent(id, sectionKey, contentIn);
      })
    );

    return NextResponse.json({
      success: true,
      data: updates,
      message: 'Content created/updated successfully'
    });
  } catch (error) {
    console.error(`POST /api/businesses/${businessId}/content error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}