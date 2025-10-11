// Simple test script for our API
const API_BASE = 'http://localhost:3000/api';

async function testBusinessAPI() {
  console.log('🧪 Testing Business API...\n');

  // Test data for a gas station
  const testBusiness = {
    name: 'Shell Gas Station Downtown',
    slug: 'shell-gas-station-downtown',
    description: 'Premium fuel and convenience services in the heart of downtown',
    industry: 'petroleum',
    template: 'gas-station',
    status: 'active',
    branding: {
      primaryColor: '#FF6B35',
      secondaryColor: '#2E8B57',
      font: 'Inter'
    },
    seo: {
      metaTitle: 'Shell Gas Station Downtown - Premium Fuel Services',
      metaDescription: 'Quality fuel and convenience services in downtown. 24/7 access, competitive prices, clean facilities.',
      keywords: ['gas', 'fuel', 'petroleum', 'convenience', 'downtown'],
    },
    contact: {
      phone: '+1-555-SHELL',
      email: 'info@shell-downtown.com',
      address: '123 Main Street, Downtown District',
    },
    socialMedia: {
      facebook: 'https://facebook.com/shell-downtown',
      instagram: 'https://instagram.com/shell-downtown',
    }
  };

  try {
    // Test 1: Create a business
    console.log('1️⃣ Creating a test business...');
    const createResponse = await fetch(`${API_BASE}/businesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBusiness),
    });

    const createResult = await createResponse.json();
    console.log('Create Result:', createResult.success ? '✅ Success' : '❌ Failed');
    
    if (!createResult.success) {
      console.log('Error:', createResult.error);
      return;
    }

    const businessId = createResult.data._id;
    console.log('Business ID:', businessId);
    console.log('Business Slug:', createResult.data.slug);

    // Test 2: Get business by ID
    console.log('\n2️⃣ Getting business by ID...');
    const getResponse = await fetch(`${API_BASE}/businesses/${businessId}`);
    const getResult = await getResponse.json();
    console.log('Get by ID Result:', getResult.success ? '✅ Success' : '❌ Failed');

    // Test 3: Get business by slug
    console.log('\n3️⃣ Getting business by slug...');
    const slugResponse = await fetch(`${API_BASE}/businesses/slug/${testBusiness.slug}`);
    const slugResult = await slugResponse.json();
    console.log('Get by Slug Result:', slugResult.success ? '✅ Success' : '❌ Failed');

    // Test 4: List all businesses
    console.log('\n4️⃣ Listing all businesses...');
    const listResponse = await fetch(`${API_BASE}/businesses`);
    const listResult = await listResponse.json();
    console.log('List All Result:', listResult.success ? '✅ Success' : '❌ Failed');
    console.log('Total businesses:', listResult.data?.length || 0);

    console.log('\n🎉 All tests completed!');
    console.log('\nYou can now:');
    console.log(`- View the business page: http://localhost:3000/business/${testBusiness.slug}`);
    console.log(`- Test the API endpoints using Postman or curl`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. MongoDB is running');
    console.log('2. Next.js dev server is running (npm run dev)');
    console.log('3. .env.local has correct MongoDB connection string');
  }
}

// Run the test
testBusinessAPI();