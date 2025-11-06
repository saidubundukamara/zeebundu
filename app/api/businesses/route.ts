import { NextRequest, NextResponse } from 'next/server';
import { BusinessService } from '@/lib/services/BusinessService';

export async function GET(request: NextRequest) {
  try {
    const businessService = new BusinessService();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const template = searchParams.get('template');
    const status = searchParams.get('status');

    let result;
    
    if (search) {
      result = await businessService.searchBusinesses(search);
    } else {
      // Handle special case: status=active should also include coming-soon for public display
      let filters: any = {};
      if (template) {
        filters.template = template;
      }
      if (status === 'active') {
        // For public display, include both active and coming-soon businesses
        filters.status = { $in: ['active', 'coming-soon'] };
      } else if (status) {
        filters.status = status;
      }
      
      result = await businessService.getAllBusinesses(Object.keys(filters).length > 0 ? filters : undefined);
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/businesses error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const businessService = new BusinessService();
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug || !data.template || !data.industry) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, slug, template, industry' },
        { status: 400 }
      );
    }

    const result = await businessService.createBusiness(data);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST /api/businesses error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}