import { CouchbaseConnectionConfig } from './couchbase-connection.model';

export interface CouchbaseStoreConfig extends CouchbaseConnectionConfig {
    ttl: number;
    max: number;
}
