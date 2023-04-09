import type { RequestHandler } from '@builder.io/qwik-city';
import type { APIRequest } from '~/api';


export const onPost: RequestHandler = async (req) => {
  const body = await req.parseBody() as APIRequest;
  const { method } = body;
  if (method === 'watch') {
    // FIX: The $changeStream stage is only supported on replica sets
    // const writableStream = req.getWritableStream();
    // const writer = writableStream.getWriter();
    // const changeStream = api.watch(collection, ...params as any);
    // for await (const next of changeStream) {
    //   console.log(next);
    // }
  }
}