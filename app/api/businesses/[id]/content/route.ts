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

    const defaults: Record<ContentSection | 'exchangeRates', any> = {
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
      exchangeRates: {
        title: '',
        description: '',
        currencies: [],
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
      const rawContent = found?.content ?? defaults[section as keyof typeof defaults];
      
      let contentOut;
      if (isHero) {
        contentOut = { ...(rawContent || {}), buttons: rawContent?.buttons ?? rawContent?.ctaButtons ?? [] };
      } else if (isServices) {
        contentOut = normalizeServices(rawContent);
      } else {
        // Gallery needs special handling for admin editor compatibility
        if (section === 'gallery') {
          contentOut = {
            ...rawContent,
            layout: rawContent?.layout ?? 'grid',
            columns: rawContent?.columns ?? 3,
            images: Array.isArray(rawContent?.images)
              ? rawContent.images.map((img: any) => {
                  // Convert simple URL strings to MediaAsset format if needed
                  if (typeof img === 'string') {
                    return {
                      id: `${Date.now()}-${Math.random()}`,
                      media: {
                        url: img,
                        originalName: `Image ${Date.now()}`,
                      },
                      caption: '',
                      alt: '',
                      isVisible: true,
                      order: 0,
                    };
                  }
                  // If it's already a proper GalleryImage object, ensure it has all required fields
                  return {
                    id: img.id || `${Date.now()}-${Math.random()}`,
                    media: img.media || { url: img.url || '', originalName: img.caption || 'Image' },
                    caption: img.caption || '',
                    alt: img.alt || '',
                    isVisible: img.isVisible !== undefined ? img.isVisible : true,
                    order: img.order || 0,
                  };
                })
              : [],
          };
        } else {
          contentOut = rawContent;
        }
      }
      
      return {
        id: section,
        type: section,
        title: typeof contentOut?.title === 'string' ? contentOut.title : section,
        isActive: found?.isActive ?? true,
        content: contentOut,
      };
    });

    // Also include any custom sections like exchangeRates that aren't in the standard sectionOrder
    const customSections = Array.from(latestBySection.keys()).filter(
      (section) => !sectionOrder.includes(section as ContentSection)
    );
    
    const customData = customSections.map((section) => {
      const found = latestBySection.get(section);
      return {
        id: section,
        type: section,
        title: typeof found?.content?.title === 'string' ? found.content.title : section,
        isActive: found?.isActive ?? true,
        content: found?.content ?? {},
      };
    });

    return NextResponse.json({
      success: true,
      data: [...data, ...customData],
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
        } else if (sectionKey === 'gallery' && Array.isArray(contentIn.images)) {
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
        } else if (sectionKey === 'exchangeRates' && Array.isArray(contentIn.currencies)) {
          // Normalize exchange rates currencies for Foreign Exchange template
          contentIn.currencies = contentIn.currencies.map((currency: any) => ({
            currency: currency?.currency || currency?.name || '',
            code: currency?.code || '',
            flag: currency?.flag || '',
            buyRate: currency?.buyRate || currency?.buy || '',
            sellRate: currency?.sellRate || currency?.sell || '',
            change: currency?.change || '',
          }));
        }
        return await repo.upsertContent(id, sectionKey as any, contentIn);
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