import type { HttpClient } from '#types/http';

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
        status: response.status,
        json: () => response.clone().json(),
      };
    },
  };
}

/**
 * Creates new stub HTTP-Client.
 * @returns Client.
 */
export function createStubHttpClient(): HttpClient {
  return {
    async request() {
      return {
        ok: false,
        status: 0,
        json: () => Promise.reject(new Error('No body')),
      };
    },
  };
}
