import { Bucket } from 'couchbase';
import { Promisify } from '../types/promisify.model';

export interface CouchbaseResponse<T> {
    cas: Bucket.CAS;
    value: T;
}

/**
 * CouchbaseRepository for a specific Entity
 *
 * @todo https://github.com/scalio/nest-couchbase/issues/9
 * @export
 * @interface CouchbaseRepository
 * @extends {Promisify<Bucket>}
 * @template T
 */
export interface CouchbaseRepository<T> extends Promisify<Bucket, CouchbaseResponse<T>> {
    new (): CouchbaseRepository<T>;

    entity: T;
}
