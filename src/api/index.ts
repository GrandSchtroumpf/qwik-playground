import { mongo } from "./mongo";
import type { User, Video } from "./models";

export interface CollectionList {
  video: Video;
  user: User;
}

type API = typeof api;

export interface APIRequest<
  C extends Record<string, any> = CollectionList,
  M extends keyof API = keyof API,
> {
  collection: keyof C;
  method: M;
  params: Parameters<API[M]>
}

export const api = mongo<CollectionList>({
  uri: 'mongodb://localhost:27017',
  database: 'playground'
});