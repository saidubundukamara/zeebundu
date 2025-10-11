require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  console.log('🔧 Creating admin user...\n');

  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB = 'zeebundu';

  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in environment variables');
    return;
  }

  try {
    console.log('🔌 Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const adminCollection = db.collection('admin_users');

    // Check if admin user already exists
    const existingAdmin = await adminCollection.findOne({ email: 'admin@zeebundu.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('📧 Email: admin@zeebundu.com');
      console.log('🔑 Password: admin123');
      await client.close();
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = {
      name: 'ZeeBundu Admin',
      email: 'admin@zeebundu.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('👤 Creating admin user...');
    const result = await adminCollection.insertOne(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@zeebundu.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 User ID:', result.insertedId.toString());
    
    await client.close();
    console.log('\n🎉 Setup complete! You can now login to /admin');
    
  } catch (error) {
    console.log('❌ Error creating admin user:', error.message);
  }
}

createAdminUser();