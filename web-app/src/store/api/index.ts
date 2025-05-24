// This file is now deprecated. Please use baseApi.ts instead.
// The API configuration has been moved to baseApi.ts to avoid circular dependencies.

export * from './baseApi';

// All API services should import from their respective files directly, not from this file.
// This helps prevent circular dependencies in the application.
