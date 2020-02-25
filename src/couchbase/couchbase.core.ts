import { Store } from 'cache-manager';
import { Cluster } from 'couchbase';
import type { Bucket, InsertOptions } from 'couchbase';
import { Promisify } from '../types/promisify.model';
import { CouchbaseConnectionConfig } from './couchbase-connection.model';

export type Callback = (error: any, value: any) => unknown;

// https://issues.couchbase.com/browse/JSCBC-686
export class CouchbaseClient implements Store {
    cluster: Cluster;
    bucket: Promisify<Bucket, any>;
    collection: any;
    config: { ttl: number; [x: string]: any }

    constructor(config: CouchbaseConnectionConfig) {
        this.config = config as any;
        this.cluster = new Cluster(this.config?.url, this.config as any);

        this.bucket = (this.cluster as any).bucket(this.config?.bucket?.name, this.config?.bucket?.password);
        this.collection = (this.bucket as any).defaultCollection();
    }

    async get<T = any>(key: string): Promise<T> {
        if (this.isConnected()) {
            try {
                return (await this.collection.get(key)).value;
            } catch (e) {
                console.log(e);
                return null;
            }
        }
    }

    async set<T = any>(key: string, value: any, options): Promise<T> {
        if (this.isConnected()) {
            const insertOptions: InsertOptions = options;

            insertOptions.expiry = options.ttl || this.config.ttl;

            return this.collection.insert(key, value, insertOptions);
        }
    }

    async del<T = any>(key: string): Promise<T> {
        if (this.isConnected()) {
            return this.collection.remove(key);
        }
    }

    isConnected(): boolean {
        return [
            (this.bucket as any)?._conn?._connected,
            (this.collection as any)?._conn?._connected
        ].some(Boolean);
    }
}

export const store = {
    create: (config: CouchbaseConnectionConfig) => new CouchbaseClient(config)
};
