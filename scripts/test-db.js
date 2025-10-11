// Simple test script to verify database connection
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

async function testDatabaseConnection() {
  console.log('🔌 Testing MongoDB connection...\n');

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB = process.env.MONGODB_DB || 'zeebundu';

  console.log('MongoDB URI:', MONGODB_URI);
  console.log('Database Name:', MONGODB_DB);

  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in environment variables');
    return;
  }

  try {
    console.log('\n🔄 Attempting to connect...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    console.log('✅ Successfully accessed database:', MONGODB_DB);
    
    // Test collection access
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections in database:', collections.length);
    
    await client.close();
    console.log('✅ Connection closed successfully');
    
    console.log('\n🎉 Database connection test passed!');
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\nTo fix this issue:');
    console.log('1. Install MongoDB: brew install mongodb-community (on macOS)');
    console.log('2. Start MongoDB: brew services start mongodb-community');
    console.log('3. Or update .env.local with a MongoDB Atlas connection string');
  }
}

testDatabaseConnection();