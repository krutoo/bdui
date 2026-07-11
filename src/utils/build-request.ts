import type { HttpRequest, RequestParamDefinition } from '#types/http';
import { fill } from './param.ts';

export interface HttpRequestDefinition {
  method?: string;
  params?: RequestParamDefinition[];
}

/**
 * Creates HTTP-request object.
 * @param resource URL.
 * @param definition HTTP-request definition.
 * @returns HTTP-request.
 */
export function buildRequest(
  resource: string,
  { method = 'GET', params }: HttpRequestDefinition = {},
): HttpRequest {
  const searchParams = new URLSearchParams();
  const headers = new Headers();
  let body: unknown;

  if (params) {
    for (const item of params) {
      if (!item.value) {
        continue;
      }

      switch (item.in) {
        case 'query': {
          if (item.key) {
            searchParams.append(item.key, item.value);
          }
          break;
        }

        case 'header': {
          if (item.key) {
            headers.set(item.key, item.value);
          }
          break;
        }

        case 'body': {
          if (item.key) {
            body = fill(body, [item]);
          }
          break;
        }
      }
    }
  }

  const url = searchParams.toString()
    ? `${resource}${resource.includes('?') ? '&' : '?'}${searchParams.toString()}`
    : resource;

  return {
    url,
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };
}
