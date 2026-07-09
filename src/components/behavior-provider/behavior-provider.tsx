import { type FC, useEffect, useMemo } from 'react';
import { BehaviorContext, type BehaviorContextValue } from '../../context/behavior.ts';
import type { RegistryItem } from '../../types.ts';
import { createFetchHttpClient } from '../../utils/http-client.ts';
import { TaskQueue } from '../../utils/task-queue.ts';
import type { BehaviorProviderProps } from './types.ts';

/**
 * Behavior provider for any BDUI-components.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const BehaviorProvider: FC<BehaviorProviderProps> = props => {
  const { children, components, http } = props;
  const { retrieveReplacersFromResponse } = http ?? {};
  const client = useMemo(() => http?.client ?? createFetchHttpClient(), [http?.client]);

  const context = useMemo<BehaviorContextValue>(() => {
    const map = new Map<string, RegistryItem>();
    const registryListeners = new Set<VoidFunction>();
    const anyStoreListeners = new Set<VoidFunction>();
    const anyStoreFlushers = new Map<string, VoidFunction>();

    const handleAnyStoreChange = () => {
      anyStoreListeners.forEach(fn => fn());
    };

    return {
      components,
      registry: {
        get(elementId) {
          return map.get(elementId);
        },
        set(elementId, item) {
          map.set(elementId, item);

          if (item.store) {
            anyStoreFlushers.set(elementId, item.store.subscribe(handleAnyStoreChange));
          }

          registryListeners.forEach(fn => fn());
        },
        delete(elementId) {
          map.delete(elementId);
          anyStoreFlushers.get(elementId)?.();
          anyStoreFlushers.delete(elementId);
          registryListeners.forEach(fn => fn());
        },
        subscribe(listener) {
          registryListeners.add(listener);

          return () => {
            registryListeners.delete(listener);
          };
        },
        values() {
          return map.values();
        },
      },
      tasks: new TaskQueue({
        http: {
          client,
        },
      }),
      dependencies: {
        http: {
          client,
          retrieveReplacers: retrieveReplacersFromResponse ?? (() => []),
        },
      },
      events: {
        anyStoreChanged: {
          subscribe(fn) {
            anyStoreListeners.add(fn);

            return () => {
              anyStoreListeners.delete(fn);
            };
          },
        },
      },
    };
  }, [components, client, retrieveReplacersFromResponse]);

  useEffect(() => {
    return context.tasks.init();
  }, [context]);

  return <BehaviorContext.Provider value={context}>{children}</BehaviorContext.Provider>;
};
