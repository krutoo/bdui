import type { FC } from 'react';
import type { Store, Subscribable } from '@krutoo/utils/store';
import type { HttpClient, ResponseReplacersRetriever } from './http.ts';

export interface CoreComponent<Name extends string, Props = object> extends FC<Props> {
  displayName: Name;
  skipExpressionIntercept?: boolean;
}

export interface ElementRegistry {
  get(elementId: string): ElementRegistryItem | undefined;
  set(elementId: string, item: ElementRegistryItem): void;
  delete(elementId: string): void;
  values(): IterableIterator<ElementRegistryItem>;
}

export interface ElementRegistryItem<State = unknown> {
  type: string;
  id: string;
  store?: Store<State>;
  actions: Record<string, ((...args: any[]) => any) | undefined>;
}

export interface CoreEvents {
  readonly registryChanged: Subscribable;
  readonly anyStoreChanged: Subscribable;
}

export interface CoreDependencies {
  readonly http: {
    readonly client: HttpClient;
    readonly retrieveReplacers: ResponseReplacersRetriever;
  };
}
