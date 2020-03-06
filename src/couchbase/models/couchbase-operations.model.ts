import { CachingConfig } from 'cache-manager';
import { InsertOptions, UpsertOptions } from 'couchbase';

export type SetOptions = CachingConfig & InsertOptions;

export type UpdateOptions = CachingConfig & UpsertOptions;
