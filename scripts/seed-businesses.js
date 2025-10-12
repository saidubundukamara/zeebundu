require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const sampleBusinesses = [
  {
    name: 'BlueFuel Gas Station',
    slug: 'bluefuel-gas-station',
    description: 'Premium fuel station with modern amenities, convenience store, and 24/7 service. Your one-stop destination for quality fuel and automotive essentials.',
    industry: 'Automotive',
    template: 'gas-station',
    status: 'active',
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#06B6D4',
      logo: '',
      favicon: '',
      font: 'Inter'
    },
    seo: {
      metaTitle: 'BlueFuel Gas Station - Premium Fuel & Automotive Services',
      metaDescription: 'Experience premium fuel quality and exceptional service at BlueFuel Gas Station. 24/7 convenience store, car wash, and automotive essentials.',
      keywords: ['gas station', 'fuel', 'automotive', 'convenience store', 'car wash', 'premium fuel'],
      ogImage: '',
      canonicalUrl: 'https://zeebundu.com/business/bluefuel-gas-station'
    },
    contact: {
      phone: '+1 (555) 123-FUEL',
      email: 'info@bluefuelstation.com',
      address: '123 Highway Blvd, Downtown District, CA 90210',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437
      }
    },
    socialMedia: {
      facebook: 'https://facebook.com/bluefuelstation',
      instagram: 'https://instagram.com/bluefuelstation',
      twitter: 'https://twitter.com/bluefuelstation'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Grand Resort & Spa',
    slug: 'grand-resort-spa',
    description: 'Luxury resort and spa offering world-class accommodations, fine dining, and rejuvenating wellness experiences in a breathtaking setting.',
    industry: 'Hospitality',
    template: 'hotel',
    status: 'active',
    branding: {
      primaryColor: '#059669',
      secondaryColor: '#0D9488',
      logo: '',
      favicon: '',
      font: 'Inter'
    },
    seo: {
      metaTitle: 'Grand Resort & Spa - Luxury Accommodations & Wellness',
      metaDescription: 'Experience luxury at Grand Resort & Spa. Premium accommodations, world-class spa services, fine dining, and exceptional hospitality.',
      keywords: ['luxury hotel', 'resort', 'spa', 'wellness', 'fine dining', 'accommodations'],
      ogImage: '',
      canonicalUrl: 'https://zeebundu.com/business/grand-resort-spa'
    },
    contact: {
      phone: '+1 (555) 456-LUXURY',
      email: 'reservations@grandresort.com',
      address: '456 Paradise Drive, Scenic Valley, CA 90211',
      coordinates: {
        lat: 34.0822,
        lng: -118.2637
      }
    },
    socialMedia: {
      facebook: 'https://facebook.com/grandresort',
      instagram: 'https://instagram.com/grandresort',
      twitter: 'https://twitter.com/grandresort'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Green Valley Organic Farm',
    slug: 'green-valley-organic-farm',
    description: 'Sustainable organic farming operation producing fresh, pesticide-free vegetables, fruits, and herbs using environmentally friendly practices.',
    industry: 'Agriculture',
    template: 'farming',
    status: 'active',
    branding: {
      primaryColor: '#16A34A',
      secondaryColor: '#059669',
      logo: '',
      favicon: '',
      font: 'Inter'
    },
    seo: {
      metaTitle: 'Green Valley Organic Farm - Sustainable Agriculture & Fresh Produce',
      metaDescription: 'Fresh organic produce from Green Valley Organic Farm. Sustainable farming practices, pesticide-free vegetables, fruits, and herbs.',
      keywords: ['organic farming', 'sustainable agriculture', 'fresh produce', 'vegetables', 'fruits', 'pesticide-free'],
      ogImage: '',
      canonicalUrl: 'https://zeebundu.com/business/green-valley-organic-farm'
    },
    contact: {
      phone: '+1 (555) 789-FARM',
      email: 'harvest@greenvalleyfarm.com',
      address: '789 Valley Road, Rural County, CA 90212',
      coordinates: {
        lat: 34.1522,
        lng: -118.3437
      }
    },
    socialMedia: {
      facebook: 'https://facebook.com/greenvalleyfarm',
      instagram: 'https://instagram.com/greenvalleyfarm',
      twitter: 'https://twitter.com/greenvalleyfarm'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'HealthCare Plus Pharmacy',
    slug: 'healthcare-plus-pharmacy',
    description: 'Full-service pharmacy providing prescription medications, health consultations, wellness products, and comprehensive healthcare services.',
    industry: 'Healthcare',
    template: 'pharmacy',
    status: 'active',
    branding: {
      primaryColor: '#DC2626',
      secondaryColor: '#EC4899',
      logo: '',
      favicon: '',
      font: 'Inter'
    },
    seo: {
      metaTitle: 'HealthCare Plus Pharmacy - Professional Pharmaceutical Services',
      metaDescription: 'Professional pharmacy services at HealthCare Plus. Prescription medications, health consultations, wellness products, and healthcare solutions.',
      keywords: ['pharmacy', 'healthcare', 'prescription medications', 'health consultations', 'wellness', 'medical'],
      ogImage: '',
      canonicalUrl: 'https://zeebundu.com/business/healthcare-plus-pharmacy'
    },
    contact: {
      phone: '+1 (555) 321-HEALTH',
      email: 'care@healthcareplus.com',
      address: '321 Medical Center Blvd, Health District, CA 90213',
      coordinates: {
        lat: 34.0722,
        lng: -118.2237
      }
    },
    socialMedia: {
      facebook: 'https://facebook.com/healthcareplus',
      instagram: 'https://instagram.com/healthcareplus',
      twitter: 'https://twitter.com/healthcareplus'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Metro Auto Services',
    slug: 'metro-auto-services',
    description: 'Complete automotive care center offering expert repairs, maintenance, diagnostics, and professional service for all vehicle makes and models.',
    industry: 'Automotive',
    template: 'gas-station',
    status: 'active',
    branding: {
      primaryColor: '#EA580C',
      secondaryColor: '#DC2626',
      logo: '',
      favicon: '',
      font: 'Inter'
    },
    seo: {
      metaTitle: 'Metro Auto Services - Expert Automotive Repair & Maintenance',
      metaDescription: 'Professional automotive services at Metro Auto. Expert repairs, maintenance, diagnostics, and quality service for all vehicle types.',
      keywords: ['auto repair', 'automotive service', 'car maintenance', 'vehicle diagnostics', 'auto care'],
      ogImage: '',
      canonicalUrl: 'https://zeebundu.com/business/metro-auto-services'
    },
    contact: {
      phone: '+1 (555) 654-AUTO',
      email: 'service@metroauto.com',
      address: '654 Auto Row, Industrial District, CA 90214',
      coordinates: {
        lat: 34.0422,
        lng: -118.2837
      }
    },
    socialMedia: {
      facebook: 'https://facebook.com/metroauto',
      instagram: 'https://instagram.com/metroauto',
      twitter: 'https://twitter.com/metroauto'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Taste of Italy Restaurant',
    slug: 'taste-of-italy-restaurant',
    description: 'Authentic Italian cuisine featuring traditional recipes, fresh ingredients, and warm hospitality in an elegant dining atmosphere.',
    industry: 'Food & Beverage',
    template: 'hotel', // Using hotel template as closest match for restaurant
    status: 'active',
    branding: {
      primaryColor: '#D97706',
      secondaryColor: '#EA580C',
      logo: '',
      favicon: '',
      font: 'Inter'
    },
    seo: {
      metaTitle: 'Taste of Italy Restaurant - Authentic Italian Cuisine',
      metaDescription: 'Experience authentic Italian cuisine at Taste of Italy. Traditional recipes, fresh ingredients, and warm hospitality in elegant surroundings.',
      keywords: ['Italian restaurant', 'authentic cuisine', 'traditional recipes', 'fine dining', 'Italian food'],
      ogImage: '',
      canonicalUrl: 'https://zeebundu.com/business/taste-of-italy-restaurant'
    },
    contact: {
      phone: '+1 (555) 987-PASTA',
      email: 'reservations@tasteofitaly.com',
      address: '987 Little Italy Street, Culinary District, CA 90215',
      coordinates: {
        lat: 34.0622,
        lng: -118.2537
      }
    },
    socialMedia: {
      facebook: 'https://facebook.com/tasteofitaly',
      instagram: 'https://instagram.com/tasteofitaly',
      twitter: 'https://twitter.com/tasteofitaly'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedBusinesses() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db('zeebundu');
    const collection = db.collection('businesses');
    
    // Check if businesses already exist
    const existingCount = await collection.countDocuments();
    console.log(`Found ${existingCount} existing businesses`);
    
    if (existingCount > 0) {
      console.log('Businesses already exist. Skipping seed...');
      console.log('Use --force flag to overwrite existing data');
      return;
    }
    
    // Insert sample businesses
    console.log('Inserting sample businesses...');
    const result = await collection.insertMany(sampleBusinesses);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} businesses:`);
    sampleBusinesses.forEach((business, index) => {
      console.log(`   ${index + 1}. ${business.name} (${business.template})`);
    });
    
    console.log('\n🎉 Business seeding completed successfully!');
    console.log('\nYou can now:');
    console.log('- Visit the homepage to see the businesses');
    console.log('- Navigate to individual business pages');
    console.log('- Browse businesses by category');
    
  } catch (error) {
    console.error('❌ Error seeding businesses:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the seeding script
if (require.main === module) {
  seedBusinesses().catch(console.error);
}

module.exports = { seedBusinesses, sampleBusinesses };