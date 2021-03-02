import { Store } from 'cache-manager';
import { connect } from 'couchbase';
import { InsertOptions, SetOptions, UpdateOptions } from './models/couchbase-operations.model';
import { CouchbaseStoreConfig } from './models/couchbase-store-config.model';
import { Cluster } from './types/cluster.model';

export class CouchbaseClient implements Store {
    cluster?: Cluster;
    bucket?: Bucket;
    collection!: Collection;
    config: CouchbaseStoreConfig;

    constructor(config: CouchbaseStoreConfig) {
        this.config = config;

        try {
            connect(this.config?.url, this.config).then((cluster) => {
                this.cluster = cluster;
                this.bucket = this.cluster.bucket(this.config?.bucket?.name);
                this.collection = this.bucket.defaultCollection();
            });
        } catch (e) {
            console.log('Unable to connect to couchbase. ', e);
        }
    }

    async get<T = any>(key: string): Promise<T | null | undefined> {
        if (this.isConnected()) {
            try {
                return (await this.collection.get(key)).content;
            } catch (e) {
                return null;
            }
        }
    }

    async set<T = any>(key: string, value: T, options?: SetOptions): Promise<MutationResult | void> {
        if (this.isConnected()) {
            const insertOptions: InsertOptions = this.getSetOptions(value, options);

            return await this.collection.insert(key, value, insertOptions);
        }
    }

    async del(key: string): Promise<RemoveResult | void> {
        if (this.isConnected()) {
            return await this.collection.remove(key);
        }
    }

    async upsert<T = any>(key: string, value: T, options?: UpdateOptions): Promise<MutationResult | void> {
        if (this.isConnected()) {
            const insertOptions: InsertOptions = this.getSetOptions(value, options);

            return this.collection.upsert(key, value, insertOptions);
        }
    }

    isConnected(): boolean {
        return [(this.bucket as any)?._conn?._connected, (this.collection as any)?._conn?._connected].every(Boolean);
    }

    getSetOptions<T = any>(value: T, options: SetOptions | undefined): InsertOptions {
        const insertOptions: InsertOptions = options || {};

        // We want to allow value of zero
        const ttlFactory = typeof options?.ttl !== 'undefined' ? options.ttl : this.config.ttl;

        insertOptions.timeout = typeof ttlFactory === 'function' ? ttlFactory(value) : ttlFactory;

        return insertOptions;
    }
}

export const store = {
    create: (config: CouchbaseStoreConfig) => new CouchbaseClient(config),
};
