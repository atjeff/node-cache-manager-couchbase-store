export interface CouchbaseConnectionConfig {
    url: string;
    username?: string;
    password?: string;
    bucket: CouchbaseBucketConfig;
    sync?: boolean;
    options?: unknown;
    mock?: boolean;
}

export interface CouchbaseBucketConfig {
    name: string;
    password?: string;
}
