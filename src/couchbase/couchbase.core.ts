import { Store } from 'cache-manager';
import { Bucket, Cluster, InsertOptions } from 'couchbase';
import { Promisify } from '../types/promisify.model';
import { SetOptions, UpdateOptions } from './models/couchbase-operations.model';
import { CouchbaseStoreConfig } from './models/couchbase-store-config.model';

// https://issues.couchbase.com/browse/JSCBC-686
export class CouchbaseClient implements Store {
    cluster?: Cluster;
    bucket?: Promisify<Bucket, any>;
    collection: any;
    config: CouchbaseStoreConfig;

    constructor(config: CouchbaseStoreConfig) {
        this.config = config;

        try {
            this.cluster = new Cluster(this.config?.url, this.config as any);

            this.bucket = (this.cluster as any).bucket(this.config?.bucket?.name, this.config?.bucket?.password);
            this.collection = (this.bucket as any).defaultCollection();
        } catch (e) {
            console.log('Unable to connect to couchbase. ', e);
        }
    }

    async get<T = any>(key: string): Promise<T | null | undefined> {
        if (this.isConnected()) {
            try {
                return (await this.collection.get(key)).value;
            } catch (e) {
                return null;
            }
        }
    }

    async set<T = any>(key: string, value: T, options?: SetOptions): Promise<T | undefined> {
        if (this.isConnected()) {
            const insertOptions: InsertOptions = this.getSetOptions(value, options);

            return await this.collection.insert(key, value, insertOptions);
        }
    }

    async del<T = any>(key: string): Promise<T | undefined> {
        if (this.isConnected()) {
            return await this.collection.remove(key);
        }
    }

    async upsert<T = any>(key: string, value: T, options?: UpdateOptions): Promise<T | undefined> {
        if (this.isConnected()) {
            const insertOptions: InsertOptions = this.getSetOptions(value, options);

            return await this.collection.upsert(key, value, insertOptions);
        }
    }

    isConnected(): boolean {
        return [(this.bucket as any)?._conn?._connected, this.collection?._conn?._connected].every(Boolean);
    }

    getSetOptions<T = any>(value: T, options: SetOptions | undefined): InsertOptions {
        const insertOptions: InsertOptions = options || {};
        const ttlFactory = options?.ttl || this.config.ttl;

        insertOptions.expiry = typeof ttlFactory === 'function' ? ttlFactory(value) : ttlFactory;

        return insertOptions;
    }
}

export const store = {
    create: (config: CouchbaseStoreConfig) => new CouchbaseClient(config),
};
