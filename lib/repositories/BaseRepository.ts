import { Collection, ObjectId, MongoError, Document } from "mongodb";
import { getCollection } from "../utils/mongodb";
import { DatabaseQuery, UpdateOperation } from "../types";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected collection!: Collection<T>;
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected async getCollection(): Promise<Collection<T>> {
    if (!this.collection) {
      this.collection = (await getCollection(
        this.collectionName
      )) as unknown as Collection<T>;
    }
    return this.collection;
  }

  getCollectionName(): string {
    return this.collectionName;
  }

  async create(data: Omit<T, "_id">): Promise<T> {
    try {
      const collection = await this.getCollection();
      const now = new Date();
      const document = {
        ...data,
        createdAt: now,
        updatedAt: now,
      } as unknown as T;

      const result = await collection.insertOne(document as any);
      return { ...document, _id: result.insertedId } as T;
    } catch (error) {
      throw this.handleError(error, "create");
    }
  }

  async createMany(data: Omit<T, "_id">[]): Promise<T[]> {
    try {
      const collection = await this.getCollection();
      const now = new Date();
      const documents = data.map((item) => ({
        ...item,
        createdAt: now,
        updatedAt: now,
      })) as unknown as T[];

      const result = await collection.insertMany(documents as any);
      return documents.map((doc, index) => ({
        ...doc,
        _id: result.insertedIds[index],
      })) as T[];
    } catch (error) {
      throw this.handleError(error, "createMany");
    }
  }

  async findById(id: string | ObjectId): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const objectId = typeof id === "string" ? new ObjectId(id) : id;
      return (await collection.findOne({ _id: objectId } as any)) as T | null;
    } catch (error) {
      throw this.handleError(error, "findById");
    }
  }

  async findOne(query: DatabaseQuery): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const { filter = {}, sort } = query;

      let cursor = collection.findOne(filter as any);
      if (sort) {
        cursor = collection.findOne(filter as any, { sort });
      }

      return (await cursor) as T | null;
    } catch (error) {
      throw this.handleError(error, "findOne");
    }
  }

  async findMany(query: DatabaseQuery = {}): Promise<T[]> {
    try {
      const collection = await this.getCollection();
      const { filter = {}, sort, limit, skip } = query;

      let cursor = collection.find(filter as any);

      if (sort) cursor = cursor.sort(sort);
      if (skip) cursor = cursor.skip(skip);
      if (limit) cursor = cursor.limit(limit);

      return (await cursor.toArray()) as T[];
    } catch (error) {
      throw this.handleError(error, "findMany");
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const collection = await this.getCollection();
      return (await collection.find({}).toArray()) as T[];
    } catch (error) {
      throw this.handleError(error, "findAll");
    }
  }

  async count(query: DatabaseQuery = {}): Promise<number> {
    try {
      const collection = await this.getCollection();
      const { filter = {} } = query;
      return await collection.countDocuments(filter as any);
    } catch (error) {
      throw this.handleError(error, "count");
    }
  }

  async exists(query: DatabaseQuery): Promise<boolean> {
    try {
      const count = await this.count(query);
      return count > 0;
    } catch (error) {
      throw this.handleError(error, "exists");
    }
  }

  async updateById(
    id: string | ObjectId,
    update: UpdateOperation
  ): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const objectId = typeof id === "string" ? new ObjectId(id) : id;

      const updateDoc = {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date(),
        },
      };

      const result = await collection.findOneAndUpdate(
        { _id: objectId } as any,
        updateDoc as any,
        { returnDocument: "after" }
      );

      return result?.value || null;
    } catch (error) {
      throw this.handleError(error, "updateById");
    }
  }

  async updateOne(
    query: DatabaseQuery,
    update: UpdateOperation
  ): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const { filter = {} } = query;

      const updateDoc = {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date(),
        },
      };

      const result = await collection.findOneAndUpdate(
        filter as any,
        updateDoc as any,
        { returnDocument: "after" }
      );

      return result?.value || null;
    } catch (error) {
      throw this.handleError(error, "updateOne");
    }
  }

  async updateMany(
    query: DatabaseQuery,
    update: UpdateOperation
  ): Promise<number> {
    try {
      const collection = await this.getCollection();
      const { filter = {} } = query;

      const updateDoc = {
        ...update,
        $set: {
          ...update.$set,
          updatedAt: new Date(),
        },
      };

      const result = await collection.updateMany(
        filter as any,
        updateDoc as any
      );
      return result.modifiedCount;
    } catch (error) {
      throw this.handleError(error, "updateMany");
    }
  }

  async deleteById(id: string | ObjectId): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const objectId = typeof id === "string" ? new ObjectId(id) : id;
      const result = await collection.deleteOne({ _id: objectId } as any);
      return result.deletedCount > 0;
    } catch (error) {
      throw this.handleError(error, "deleteById");
    }
  }

  async deleteOne(query: DatabaseQuery): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const { filter = {} } = query;
      const result = await collection.deleteOne(filter as any);
      return result.deletedCount > 0;
    } catch (error) {
      throw this.handleError(error, "deleteOne");
    }
  }

  async deleteMany(query: DatabaseQuery): Promise<number> {
    try {
      const collection = await this.getCollection();
      const { filter = {} } = query;
      const result = await collection.deleteMany(filter as any);
      return result.deletedCount;
    } catch (error) {
      throw this.handleError(error, "deleteMany");
    }
  }

  protected handleError(error: any, operation: string): Error {
    console.error(
      `Database error in ${this.collectionName}.${operation}:`,
      error
    );

    if (error instanceof MongoError) {
      if (error.code === 11000) {
        return new Error(
          "Duplicate key error: A document with this key already exists"
        );
      }
    }

    return new Error(`Database operation failed: ${error.message}`);
  }
}
