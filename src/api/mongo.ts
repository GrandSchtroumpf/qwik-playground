import { MongoClient, ServerApiVersion } from "mongodb";
import type { Filter, FindOptions, WithId, OptionalId, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb';
import { randomUUID } from 'crypto';

interface CacheDoc {
  ttl: Date;
  value: any
}
interface CacheQuery {
  ttl: Date;
  value: string[]
}



interface DatabaseConfig {
  uri: string;
  database: string;
}

type CollectionName<Collections extends Record<string, any>> = Extract<keyof Collections, string>;


export function mongo<C extends Record<string, any> = {}>(config: DatabaseConfig) {
  const cacheDoc = new Map<string, CacheDoc>();
  const cacheQuery = new Map<string, CacheQuery>();
  let client: MongoClient;

  function db() {
    if (!client) {
      client = new MongoClient(config.uri,  {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    }
    return client.db(config.database);
  }

  function collection<N extends CollectionName<C>>(name: N) {
    return db().collection<C[N]>(name);
  }


  async function get<N extends CollectionName<C>>(name: N, id: string) {
    const key = `${collection}/${id}`;
    const cache = cacheDoc.get(key);
    if (!cache || cache.ttl < new Date()) {
      const value = await collection(name).findOne({ _id: id } as any);
      if (value) cacheDoc.set(key, { ttl: new Date(), value });
    }
    return cacheDoc.get(key)?.value as WithId<C[N]>;
    
  }


  /**
   * Query multiple document from a collection
   * @param name The collection name
   * @param filter Filter used for the query
   * @param options options to sort or limit
   * @returns 
   */
  async function query<N extends CollectionName<C>>(
    name: N,
    filter: Filter<C[N]> = {},
    options?: FindOptions<C[N]>
  ) {
    const key = JSON.stringify({ collection, filter, options });
    const cache = cacheQuery.get(key);
    if (!cache || cache.ttl < new Date()) {
      const ids: string[] = [];
      const cursor = collection(name).find(filter, options);
      await cursor.forEach(value => {
        const docKey = `${collection}/${value._id}`;
        ids.push(docKey);
        cacheDoc.set(docKey, { ttl: new Date(), value });
      });
      cacheQuery.set(key, { ttl: new Date(), value: ids });
    }
    return cacheQuery.get(key)?.value
      .map(key => cacheDoc.get(key)?.value as WithId<C[N]>);
  }
  
  /**
   * Insert a document into the collection
   * @param name collection name
   * @param doc the document to insert
   * @returns 
   */
  async function add<N extends CollectionName<C>>(
    name: N,
    doc: OptionalId<C[N]>
  ) {
    // TODO: add rules
    if (!doc['_id']) doc['_id'] = randomUUID();
    return collection(name).insertOne(doc as OptionalUnlessRequiredId<C[N]>);
  }

  async function update<N extends CollectionName<C>>(
    name: N,
    id: string,
    doc: UpdateFilter<C[N]> | Partial<C[N]>,
  ) {
    // TODO: add rules
    return collection(name).updateOne({ _id: id } as any, doc);
  }
  

  function watch<N extends CollectionName<C>>(name: N, pipeline?: Document[]) {
    return collection(name).watch(pipeline).stream();
  }

  return { collection, add, update, query, get, watch }
}
