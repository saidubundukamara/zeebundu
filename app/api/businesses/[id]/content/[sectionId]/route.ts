import { NextRequest, NextResponse } from 'next/server';

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
    
    // TODO: Implement content section update in database
    // This would update a specific content section for the business
    
    console.log(`PUT /api/businesses/${id}/content/${secId} - Request data:`, JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      success: true,
      data: data,
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
    
    // TODO: Implement content section deletion in database
    // This would delete a specific content section for the business
    
    console.log(`DELETE /api/businesses/${id}/content/${secId}`);
    
    return NextResponse.json({
      success: true,
      message: 'Content section deleted successfully'
    });
  } catch (error) {
    console.error(`DELETE /api/businesses/${businessId}/content/${sectionId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}