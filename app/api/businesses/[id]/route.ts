import { NextRequest, NextResponse } from 'next/server';
import { BusinessService } from '@/lib/services/BusinessService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let businessId = 'unknown';
  try {
    const { id } = await params;
    businessId = id;
    const businessService = new BusinessService();
    const result = await businessService.getBusinessById(id);

    if (!result.success) {
      return NextResponse.json(result, { 
        status: result.error === 'Business not found' ? 404 : 500 
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`GET /api/businesses/${businessId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let businessId = 'unknown';
  try {
    const { id } = await params;
    businessId = id;
    const businessService = new BusinessService();
    const data = await request.json();
    const result = await businessService.updateBusiness(id, data);

    if (!result.success) {
      return NextResponse.json(result, { 
        status: result.error === 'Business not found' ? 404 : 400 
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`PUT /api/businesses/${businessId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let businessId = 'unknown';
  try {
    const { id } = await params;
    businessId = id;
    const businessService = new BusinessService();
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get('permanent') === 'true';
    
    const result = await businessService.deleteBusiness(id, permanent);

    if (!result.success) {
      return NextResponse.json(result, { 
        status: result.error === 'Business not found' ? 404 : 500 
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`DELETE /api/businesses/${businessId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}