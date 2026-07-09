import { type ComponentType, type Context, createContext } from 'react';
import type { Subscribable } from '@krutoo/utils/store';
import type { HttpClient, HttpResponse, RegistryItem } from '../types.ts';
import { TaskQueue } from '../utils/task-queue.ts';

export interface BehaviorRegistry {
  get(elementId: string): RegistryItem | undefined;
  set(elementId: string, item: RegistryItem): void;
  delete(elementId: string): void;
  values(): IterableIterator<RegistryItem>;
  subscribe(listener: VoidFunction): VoidFunction;
}

export interface ReplacementDefinition {
  elementId: string;
  tree: Element | null;
}

export interface ResponseReplacersRetriever {
  (response: HttpResponse): ReplacementDefinition[] | Promise<ReplacementDefinition[]>;
}

export interface BehaviorDependencies {
  readonly http: {
    readonly client: HttpClient;
    readonly retrieveReplacers: ResponseReplacersRetriever;
  };
}

export interface BehaviorEvents {
  readonly anyStoreChanged: Subscribable;
}

export interface BehaviorContextValue {
  readonly components: Record<string, ComponentType<any> | undefined>;
  readonly registry: BehaviorRegistry;
  readonly tasks: TaskQueue;
  readonly dependencies: BehaviorDependencies;
  readonly events: BehaviorEvents;
}

const stubHttpClient: HttpClient = {
  async request() {
    return {
      ok: false,
      json: () => Promise.reject(new Error('No body')),
    };
  },
};

export const BehaviorContext: Context<BehaviorContextValue> = createContext<BehaviorContextValue>({
  components: {},
  registry: {
    get() {},
    set() {},
    delete() {},
    *values() {},
    subscribe() {
      return () => {};
    },
  },
  tasks: new TaskQueue({
    http: {
      client: stubHttpClient,
    },
  }),
  dependencies: {
    http: {
      client: stubHttpClient,
      retrieveReplacers: () => [],
    },
  },
  events: {
    anyStoreChanged: {
      subscribe() {
        return () => {};
      },
    },
  },
});
