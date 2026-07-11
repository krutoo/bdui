import { type ComponentType, type Context, createContext } from 'react';
import type { CoreDependencies, CoreEvents, ElementRegistry } from '#types/core';
import { createStubHttpClient } from '../utils/http-client.ts';
import { TaskQueue } from '../utils/task-queue.ts';

export interface BehaviorContextValue {
  readonly components: Record<string, ComponentType<any> | undefined>;
  readonly elements: ElementRegistry;
  readonly events: CoreEvents;
  readonly tasks: TaskQueue;
  readonly dependencies: CoreDependencies;
}

const stubHttpClient = createStubHttpClient();

export const BehaviorContext: Context<BehaviorContextValue> = createContext<BehaviorContextValue>({
  components: {},
  elements: {
    get() {},
    set() {},
    delete() {},
    *values() {},
  },
  tasks: new TaskQueue({
    http: {
      client: stubHttpClient,
    },
  }),
  events: {
    registryChanged: {
      subscribe() {
        return () => {};
      },
    },
    anyStoreChanged: {
      subscribe() {
        return () => {};
      },
    },
  },
  dependencies: {
    http: {
      client: stubHttpClient,
      retrieveReplacers: () => [],
    },
  },
});
