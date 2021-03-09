import { CachingConfig } from 'cache-manager';

export type InsertOptions = Partial<{ expiry?: number }>;

export type UpsertOptions = Partial<{ expiry?: number }>;

export type SetOptions = CachingConfig & InsertOptions;

export type UpdateOptions = CachingConfig & UpsertOptions;
