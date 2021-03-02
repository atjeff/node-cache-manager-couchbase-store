import { connect } from 'couchbase';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type Cluster = ThenArg<ReturnType<typeof connect>>;
