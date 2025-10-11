import { MongoClient, Db, Collection } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'zeebundu';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getCollection(collectionName: string): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

export async function closeDatabaseConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

// Collection names constants
export const COLLECTIONS = {
  BUSINESSES: 'businesses',
  BUSINESS_CONTENT: 'business_content',
  BUSINESS_TEMPLATES: 'business_templates',
  MEDIA: 'media',
  ADMIN_USERS: 'admin_users',
} as const;

// Database indexing utility
export async function createIndexes(): Promise<void> {
  const { db } = await connectToDatabase();

  // Businesses collection indexes
  await db.collection(COLLECTIONS.BUSINESSES).createIndexes([
    { key: { slug: 1 }, unique: true },
    { key: { status: 1 } },
    { key: { template: 1 } },
    { key: { industry: 1 } },
    { key: { createdAt: -1 } },
  ]);

  // Business content collection indexes
  await db.collection(COLLECTIONS.BUSINESS_CONTENT).createIndexes([
    { key: { businessId: 1, section: 1 }, unique: true },
    { key: { businessId: 1 } },
    { key: { section: 1 } },
    { key: { isActive: 1 } },
    { key: { updatedAt: -1 } },
  ]);

  // Business templates collection indexes
  await db.collection(COLLECTIONS.BUSINESS_TEMPLATES).createIndexes([
    { key: { slug: 1 }, unique: true },
    { key: { category: 1 } },
    { key: { isActive: 1 } },
  ]);

  // Media collection indexes
  await db.collection(COLLECTIONS.MEDIA).createIndexes([
    { key: { businessId: 1 } },
    { key: { tags: 1 } },
    { key: { mimeType: 1 } },
    { key: { createdAt: -1 } },
  ]);

  console.log('Database indexes created successfully');
}