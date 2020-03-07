# Node Cache Manager store for Couchbase

## Installation 
```
npm install node-cache-manager-store-couchbase --save
```

## Usage
```ts
import { store } from 'node-cache-manager-couchbase-store';

const cache = cacheManager.caching({ store, ttl: 10 });
```

## Methods
- get
- set
- del 
- upsert

## Status
I personally wouldn't use this in production yet - The types are hacked together, waiting on https://issues.couchbase.com/browse/JSCBC-686.

## Todo
- Try to support max keys
- Get real types from @types/couchbase