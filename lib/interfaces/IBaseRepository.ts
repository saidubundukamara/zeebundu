import { ObjectId } from 'mongodb';
import { DatabaseQuery, UpdateOperation } from '../types';

export interface IBaseRepository<T> {
  // Create operations
  create(data: Omit<T, '_id'>): Promise<T>;
  createMany(data: Omit<T, '_id'>[]): Promise<T[]>;

  // Read operations
  findById(id: string | ObjectId): Promise<T | null>;
  findOne(query: DatabaseQuery): Promise<T | null>;
  findMany(query?: DatabaseQuery): Promise<T[]>;
  findAll(): Promise<T[]>;
  count(query?: DatabaseQuery): Promise<number>;
  exists(query: DatabaseQuery): Promise<boolean>;

  // Update operations
  updateById(id: string | ObjectId, update: UpdateOperation): Promise<T | null>;
  updateOne(query: DatabaseQuery, update: UpdateOperation): Promise<T | null>;
  updateMany(query: DatabaseQuery, update: UpdateOperation): Promise<number>;

  // Delete operations
  deleteById(id: string | ObjectId): Promise<boolean>;
  deleteOne(query: DatabaseQuery): Promise<boolean>;
  deleteMany(query: DatabaseQuery): Promise<number>;

  // Utility operations
  getCollectionName(): string;
}