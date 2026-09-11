import createClient from "openapi-fetch";
import type { paths } from "~/types/yuuko-api";

const clients = new Map<string, ReturnType<typeof createClient<paths>>>();

function getApiClient(baseUrl: string) {
  if (clients.has(baseUrl)) return clients.get(baseUrl)!;

  const client = createClient<paths>({ baseUrl });

  client.use({
    onRequest({ request }) {
      const user = unref(useUser());
      if (user?.discordId) {
        request.headers.set("Authorization", user.discordId);
      }
      return request;
    },
  });

  clients.set(baseUrl, client);
  return client;
}

type ExtractContent<T> = T extends { content: { "application/json": infer J } }
  ? J
  : T extends { content: { "text/plain": infer Txt } }
  ? Txt
  : never;

type ExtractSuccess<Op> = Op extends { responses: infer R }
  ? {
    [K in keyof R]: K extends 200 | 201 | 202 | "200" | "201" | "202"
    ? ExtractContent<R[K]>
    : never;
  }[keyof R]
  : never;

type ResponseFor<P extends keyof paths> = paths[P] extends { post: infer Op }
  ? ExtractSuccess<Op>
  : paths[P] extends { get: infer Op }
  ? ExtractSuccess<Op>
  : never;

type BodyFor<P extends keyof paths> = paths[P] extends {
  post: { requestBody: { content: { "application/json": infer B } } };
}
  ? B
  : paths[P] extends {
    post: { requestBody?: { content: { "application/json": infer B } } };
  }
  ? B
  : undefined;

export async function useYuukoAPI<P extends keyof paths>(
  path: P,
  body?: BodyFor<P>
): Promise<ResponseFor<P>> {
  const config = useRuntimeConfig();
  const api = getApiClient(config.public.yuukoApiUrl);

  const user = unref(useUser());
  if (!user) throw new Error("User not logged in");

  const options = {
    body,
    params: {
      header: {
        authorization: user.discordId,
      },
    },
  } as any;

  const isPost =
    body !== undefined || path.includes("/trigger/") || path.includes("/register");

  const { data, error } = isPost
    ? await api.POST(path as any, options)
    : await api.GET(path as any, options);

  if (error) throw error;
  return data as ResponseFor<P>;
}