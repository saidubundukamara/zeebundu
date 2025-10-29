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
    // Get latest entries per section (not just active) for admin completeness
    const all = await repo.findByBusinessId(id);
    const latestBySection = new Map<string, any>();
    for (const item of all) {
      if (!latestBySection.has(item.section)) {
        latestBySection.set(item.section, item);
      }
    }

    const sectionOrder: ContentSection[] = [
      'hero',
      'about',
      'services',
      'gallery',
      'testimonials',
      'contact',
      'locations',
      'stats',
      'features',
    ];

    const defaults: Record<ContentSection, any> = {
      hero: {
        title: '',
        subtitle: '',
        description: '',
        backgroundImage: '',
        backgroundVideo: '',
        ctaButtons: [],
        buttons: [],
      },
      about: {
        title: '',
        description: '',
        features: [],
        stats: [],
      },
      services: {
        title: '',
        description: '',
        services: [],
      },
      gallery: {
        title: '',
        description: '',
        images: [],
      },
      testimonials: {
        title: '',
        description: '',
        testimonials: [],
      },
      contact: {
        title: '',
        description: '',
        phone: '',
        email: '',
        address: '',
        hours: '',
      },
      locations: {
        title: '',
        description: '',
        locations: [],
      },
      stats: {
        title: '',
        description: '',
        stats: [],
      },
      features: {
        title: '',
        description: '',
        features: [],
      },
    } as any;

    const normalizeServices = (content: any) => ({
      ...(content || {}),
      services: Array.isArray(content?.services)
        ? content.services.map((s: any) => ({
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
    });

    const data = sectionOrder.map((section) => {
      const found = latestBySection.get(section);
      const isHero = section === 'hero';
      const isServices = section === 'services';
      const rawContent = found?.content ?? defaults[section];
      const contentOut = isHero
        ? { ...(rawContent || {}), buttons: rawContent?.buttons ?? rawContent?.ctaButtons ?? [] }
        : isServices
        ? normalizeServices(rawContent)
        : rawContent;
      return {
        id: section,
        type: section,
        title: typeof contentOut?.title === 'string' ? contentOut.title : section,
        isActive: found?.isActive ?? true,
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