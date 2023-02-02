import {createTRPCProxyClient, httpBatchLink, loggerLink} from '@trpc/client';
import type {AppRouter} from "../../server/router";
import {IpcRequest} from "../../api";
import superjson from 'superjson';

export function useTRPCProxyClient() {
  const trpc = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      loggerLink(),
      httpBatchLink({
        url: '/trpc',
  
        // custom fetch implementation that sends the request over IPC to Main process
        fetch: async (input, init) => {
          const req: IpcRequest = {
            url: input instanceof URL ? input.toString() : typeof input === 'string' ? input : input.url,
            method: input instanceof Request ? input.method : init?.method!,
            headers: input instanceof Request ? input.headers : init?.headers!,
            body: input instanceof Request ? input.body : init?.body!,
          };
  
          const resp = await window.appApi.trpc(req);
  
          return new Response(resp.body, {
            status: resp.status,
            headers: resp.headers,
          });
        }
      }),
    ],
  });

  return { trpc };
}