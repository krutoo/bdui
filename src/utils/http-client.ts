import type { HttpClient } from '../types.ts';

export interface FetchHttpClientConfig {
  /** Fetch implementation. */
  fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
}

/**
 * Creates new fetch-based HTTP-Client.
 * @param config Config.
 * @returns Client.
 */
export function createFetchHttpClient({
  fetch = globalThis.fetch,
}: FetchHttpClientConfig = {}): HttpClient {
  return {
    async request(input, init) {
      const response = await fetch(input, init);

      return {
        ok: response.ok,
        json: () => response.clone().json(),
      };
    },
  };
}
