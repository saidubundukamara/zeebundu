const { CloudinaryService } = require('../lib/cloudinary.ts');

async function testCloudinaryConnection() {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Test listing folders (should work if credentials are correct)
    const folders = await CloudinaryService.listFolders();
    console.log('✅ Cloudinary connection successful!');
    console.log('Existing folders:', folders);
    
    // Test creating a folder structure for zeebundu
    await CloudinaryService.createFolder('zeebundu/businesses');
    console.log('✅ Created folder structure');
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

testCloudinaryConnection();