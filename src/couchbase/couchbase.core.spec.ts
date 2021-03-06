import couchbase from 'couchbase';
import { CouchbaseClient, store } from './couchbase.core';

jest.mock('couchbase');

const collectionMock = jest.fn().mockImplementation(() => ({
    _conn: {
        _connected: null,
    },
    get: jest.fn(),
    insert: jest.fn(),
    remove: jest.fn(),
    upsert: jest.fn(),
}));

const bucketMock = jest.fn().mockImplementation(() => ({
    _conn: {
        _connected: null,
    },
    defaultCollection: collectionMock,
}));

const clusterMock = {
    bucket: bucketMock,
};

describe('CouchbaseClient', () => {
    let connectSpy: any;

    beforeEach(() => {
        connectSpy = jest.spyOn(couchbase, 'connect').mockResolvedValue(clusterMock as any);
    });

    afterEach(() => jest.clearAllMocks());

    describe('constructor', () => {
        it('should be defined', async () => {
            const couchbaseClient = new CouchbaseClient(undefined as any);

            expect(couchbaseClient).toBeDefined();
            expect(couchbaseClient).toBeInstanceOf(CouchbaseClient);
        });

        it('should set the config to the instance', async () => {
            const mockConfig: any = { test: 2 };

            const couchbaseClient = new CouchbaseClient(mockConfig as any);

            expect(couchbaseClient.config).toEqual(mockConfig);
        });

        it('should pass the name and config to connect', async () => {
            const mockConfig = {
                url: 'test',
                bucket: {
                    name: 'bucket',
                    password: 'bucketPassword',
                },
            };

            new CouchbaseClient(mockConfig as any);

            expect(connectSpy).toHaveBeenCalledWith(mockConfig.url, mockConfig);
        });

        it('should pass the bucket name and password to bucket', async () => {
            const mockConfig = {
                url: 'test',
                bucket: {
                    name: 'bucket',
                    password: 'bucketPassword',
                },
            };

            await new CouchbaseClient(mockConfig as any);

            expect(bucketMock).toHaveBeenCalledWith(mockConfig.bucket.name);
        });
    });

    describe('Couchbase Methods', () => {
        let couchbaseClient: CouchbaseClient;

        beforeEach(async () => {
            jest.spyOn(couchbase, 'connect').mockResolvedValue(clusterMock as any);
            couchbaseClient = await new CouchbaseClient({} as any);

            jest.spyOn(couchbaseClient, 'isConnected').mockReturnValue(true);
        });

        describe('get', () => {
            it('should call collection.get', async () => {
                const mockKey = 'test';

                couchbaseClient.get(mockKey);

                expect(couchbaseClient.collection.get).toMatchSnapshot();
            });

            it('should return the value', async () => {
                const mockReturnValue = { testObj: true };
                jest.spyOn(couchbaseClient.collection, 'get').mockResolvedValue({ content: mockReturnValue, cas: 2 });

                const result = await couchbaseClient.get('test');

                expect(result).toEqual(mockReturnValue);
            });

            it('should return null if an error is thrown', async () => {
                jest.spyOn(couchbaseClient.collection, 'get').mockRejectedValue(new Error('test error'));

                const result = await couchbaseClient.get('test');

                expect(result).toEqual(null);
            });

            it('should not call get if not connected', () => {
                jest.spyOn(couchbaseClient, 'isConnected').mockReturnValue(false);

                couchbaseClient.get('');

                expect(couchbaseClient.collection.get).not.toHaveBeenCalled();
            });
        });

        describe('set', () => {
            it('should call collection.set', async () => {
                const mockKey = 'test';
                const mockValue = { testObj: true };

                couchbaseClient.set(mockKey, mockValue);

                expect(couchbaseClient.collection.insert).toHaveBeenCalled();
            });

            it('should call getSetOptions with the passed in value and options', async () => {
                jest.spyOn(couchbaseClient, 'getSetOptions');
                const mockKey = 'test';
                const mockValue = { testObj: true };
                const mockOptions = { ttl: 5 };

                couchbaseClient.set(mockKey, mockValue, mockOptions);

                expect(couchbaseClient.getSetOptions).toMatchSnapshot();
            });

            it('should call collection.set with the result of getSetOptions', async () => {
                jest.spyOn(couchbaseClient, 'getSetOptions');
                const mockKey = 'test';
                const mockValue = { testObj: true };
                const mockOptions = { ttl: () => 5 };

                await couchbaseClient.set(mockKey, mockValue, mockOptions);

                expect(couchbaseClient.collection.insert).toMatchSnapshot();
            });

            it('should not call set if not connected', async () => {
                jest.spyOn(couchbaseClient, 'isConnected').mockReturnValue(false);
                const mockKey = 'test';
                const mockValue = { testObj: true };

                await couchbaseClient.set(mockKey, mockValue);

                expect(couchbaseClient.collection.insert).not.toHaveBeenCalled();
            });
        });

        describe('del', () => {
            it('should call collection.del', async () => {
                const mockKey = 'test';

                couchbaseClient.del(mockKey);

                expect(couchbaseClient.collection.remove).toMatchSnapshot();
            });

            it('should not call del if not connected', () => {
                jest.spyOn(couchbaseClient, 'isConnected').mockReturnValue(false);
                const mockKey = 'test';

                couchbaseClient.del(mockKey);

                expect(couchbaseClient.collection.remove).not.toHaveBeenCalled();
            });
        });

        describe('upsert', () => {
            it('should call collection.upsert', async () => {
                const mockKey = 'test';
                const mockValue = { testObj: true };

                couchbaseClient.upsert(mockKey, mockValue);

                expect(couchbaseClient.collection.upsert).toMatchSnapshot();
            });

            it('should call getSetOptions with the passed in value and options', async () => {
                jest.spyOn(couchbaseClient, 'getSetOptions');
                const mockKey = 'test';
                const mockValue = { testObj: true };
                const mockOptions = { ttl: 5 };

                couchbaseClient.upsert(mockKey, mockValue, mockOptions);

                expect(couchbaseClient.getSetOptions).toMatchSnapshot();
            });

            it('should call collection.upsert with the result of getSetOptions', async () => {
                jest.spyOn(couchbaseClient, 'getSetOptions');
                const mockKey = 'test';
                const mockValue = { testObj: true };
                const mockOptions = { ttl: () => 5 };

                couchbaseClient.upsert(mockKey, mockValue, mockOptions);

                expect(couchbaseClient.collection.upsert).toMatchSnapshot();
            });

            it('should not call upsert if not connected', () => {
                jest.spyOn(couchbaseClient, 'isConnected').mockReturnValue(false);
                const mockKey = 'test';
                const mockValue = { testObj: true };

                couchbaseClient.upsert(mockKey, mockValue);

                expect(couchbaseClient.collection.upsert).not.toHaveBeenCalled();
            });
        });
    });

    describe('isConnected', () => {
        it('should return the result of Array.some', async () => {
            jest.spyOn(couchbase, 'connect').mockResolvedValue(clusterMock as any);
            const couchbaseClient: CouchbaseClient = await new CouchbaseClient({} as any);

            [
                {
                    bucket: true,
                    collection: true,
                    result: true,
                },
                {
                    bucket: true,
                    collection: false,
                    result: false,
                },
                {
                    bucket: false,
                    collection: true,
                    result: false,
                },
                {
                    bucket: false,
                    collection: false,
                    result: false,
                },
                {
                    bucket: undefined,
                    collection: undefined,
                    result: false,
                },
            ].forEach(({ bucket, collection, result }) => {
                (couchbaseClient.bucket as any)._conn._connected = bucket;
                (couchbaseClient.collection as any)._conn._connected = collection;

                expect(couchbaseClient.isConnected()).toEqual(result);
            });
        });

        it('should default values to undefined if not connected', async () => {
            jest.spyOn(couchbase, 'connect').mockResolvedValue(clusterMock as any);
            const couchbaseClient: CouchbaseClient = await new CouchbaseClient({} as any);

            delete (couchbaseClient.bucket as any)._conn;
            delete (couchbaseClient.collection as any)._conn;

            expect(couchbaseClient.isConnected()).toEqual(false);
        });

        it('should default values if defaultCollection or bucket fails', async () => {
            collectionMock.mockReturnValue(undefined);
            jest.spyOn(couchbase, 'connect').mockResolvedValue(clusterMock as any);
            const couchbaseClient: CouchbaseClient = await new CouchbaseClient({} as any);

            expect(couchbaseClient.isConnected()).toEqual(false);
        });
    });

    describe('getSetOptions', () => {
        let couchbaseClient: CouchbaseClient;

        beforeEach(async () => {
            jest.spyOn(couchbase, 'connect').mockResolvedValue(clusterMock as any);
            couchbaseClient = await new CouchbaseClient({} as any);
        });

        it('should call the ttl function if it exists', () => {
            const mockTtl = jest.fn().mockReturnValue(5);

            couchbaseClient.getSetOptions(null, { ttl: mockTtl });

            expect(mockTtl).toHaveBeenCalled();
        });

        it('should set the ttl function result if it exists', () => {
            const mockTtl = jest.fn().mockReturnValue(5);

            const result = couchbaseClient.getSetOptions(null, { ttl: mockTtl });

            expect(result).toMatchSnapshot();
        });

        it('should set the ttl value if it exists', () => {
            const mockTtl = 12;

            const result = couchbaseClient.getSetOptions(null, { ttl: mockTtl });

            expect(result).toMatchSnapshot();
        });
    });

    describe('create', () => {
        it('should create a new CouchbaseClient with the passed in config', () => {
            jest.spyOn(couchbase, 'connect').mockResolvedValue(clusterMock as any);

            const couchbaseClient = store.create({} as any);

            expect(couchbaseClient).toBeDefined();
            expect(couchbaseClient).toBeInstanceOf(CouchbaseClient);
        });
    });
});
