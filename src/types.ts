import type { FC } from 'react';
import type { Store } from '@krutoo/utils/store';

// DTO
export type Primitive = string | number | boolean | null;

// DTO
export interface Element<T extends string = string, P extends Record<string, any> = any> {
  type: T;
  props?: P;
  children?: Array<Element | Primitive>;
}

export interface CoreComponent<N extends string, P = object> extends FC<P> {
  displayName: N;
  skipExpressionIntercept?: boolean;
}

export interface HttpRequest {
  method: string;
  url: string;
  headers: Headers;
  body: string | null;
}

export interface HttpRequestInit {
  method?: string;
  body?: string | null;
  headers?: HeadersInit;
}

export interface HttpResponse {
  ok: boolean;
  json: () => Promise<unknown>;
}

export interface HttpClient {
  request(input: string, init?: HttpRequestInit): Promise<HttpResponse>;
}

/** @internal */
export interface RegistryItem<T = unknown> {
  type: string;
  id: string;
  store?: Store<T>;
  actions: Record<string, ((...args: any[]) => any) | undefined>;
}

export type ParamType = 'int' | 'float' | 'bool' | 'string' | 'null';

export interface ParamDefinition {
  key?: string;
  type?: ParamType;
  value: string | null;
}
