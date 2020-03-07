# Node Cache Manager store for Couchbase

[![npm version](https://img.shields.io/npm/v/node-cache-manager-couchbase-store.svg?style=flat-square)](https://www.npmjs.com/package/node-cache-manager-couchbase-store)
[![npm downloads](https://img.shields.io/npm/dm/node-cache-manager-couchbase-store.svg?style=flat-square)](https://www.npmjs.com/package/node-cache-manager-couchbase-store)
![npm bundle size](https://img.shields.io/bundlephobia/min/node-cache-manager-couchbase-store)
![Codecov branch](https://img.shields.io/codecov/c/github/atjeff/node-cache-manager-couchbase-store/master)

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