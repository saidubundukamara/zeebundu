import { NextRequest, NextResponse } from 'next/server';
import { BusinessService } from '@/lib/services/BusinessService';
import { ContentRepository } from '@/lib/repositories/ContentRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  let businessSlug = 'unknown';
  try {
    const { slug } = await params;
    businessSlug = slug;
    const businessService = new BusinessService();
    const contentRepository = new ContentRepository();
    
    // Get business by slug (only active businesses for public access)
    const businessResult = await businessService.getBusinessBySlug(slug);

    if (!businessResult.success) {
      return NextResponse.json(businessResult, { 
        status: businessResult.error === 'Business not found' || businessResult.error === 'Business not available' ? 404 : 500 
      });
    }

    const business = businessResult.data!;

    // Get business content
    const contentStructure = await contentRepository.getBusinessContentStructure(business._id!);

    // Return business data with content
    return NextResponse.json({
      success: true,
      data: {
        business,
        content: contentStructure
      }
    });
  } catch (error) {
    console.error(`GET /api/businesses/slug/${businessSlug} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}