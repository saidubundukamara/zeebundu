export * from './business';
export * from './content';
export * from './template';
export * from './media';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database operation types
export interface DatabaseQuery {
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
}

export interface UpdateOperation {
  $set?: Record<string, any>;
  $unset?: Record<string, any>;
  $push?: Record<string, any>;
  $pull?: Record<string, any>;
  $inc?: Record<string, any>;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}