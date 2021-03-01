import { CachingConfig } from 'cache-manager';

export type InsertOptions = Partial<{ timeout?: number }>;

export type UpsertOptions = Partial<{ timeout?: number }>;

export type SetOptions = CachingConfig & InsertOptions;

export type UpdateOptions = CachingConfig & UpsertOptions;
