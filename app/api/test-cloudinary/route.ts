import { NextResponse } from 'next/server';
import { CloudinaryService } from '@/lib/cloudinary';

export async function GET() {
  try {
    console.log('Environment variables check:');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set');
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

    // Test basic Cloudinary connection
    const folders = await CloudinaryService.listFolders();
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      folders,
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set',
      }
    });
    
  } catch (error) {
    console.error('Cloudinary test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set',
      }
    }, { status: 500 });
  }
}