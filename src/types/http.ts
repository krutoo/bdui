import type { Element, ParamDefinition, Primitive } from './dto.ts';

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
  status: number;
  json: () => Promise<unknown>;
}

export interface HttpClient {
  request(input: string, init?: HttpRequestInit): Promise<HttpResponse>;
}

export interface ReplacementDefinition {
  elementId: string;
  tree: Element | Primitive;
}

export interface ResponseReplacersRetriever {
  (response: HttpResponse): ReplacementDefinition[] | Promise<ReplacementDefinition[]>;
}

export interface RequestParamDefinition extends ParamDefinition {
  in: 'query' | 'header' | 'body';
}
