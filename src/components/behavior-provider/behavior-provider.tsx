import { type FC, useEffect, useMemo } from 'react';
import { useLatestRef, useStableCallback } from '@krutoo/utils/react';
import type { CoreDependencies } from '#types/core';
import type { ResponseReplacersRetriever } from '#types/http';
import { BehaviorContext, type BehaviorContextValue } from '../../context/behavior.ts';
import { createFetchHttpClient } from '../../utils/http-client.ts';
import { TaskQueue } from '../../utils/task-queue.ts';
import type { BehaviorProviderProps } from './types.ts';
import { ElementRegistryImpl } from './utils.ts';

const defaults = {
  http: {
    retrieveReplacers: (() => []) satisfies ResponseReplacersRetriever,
  },
};

/**
 * Behavior provider for any BDUI-components.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const BehaviorProvider: FC<BehaviorProviderProps> = props => {
  const { children, components, http } = props;

  const client = useMemo(() => {
    return http?.client ?? createFetchHttpClient();
  }, [http?.client]);

  const clientRef = useLatestRef(client);

  const retrieveReplacers = useStableCallback(
    http?.retrieveReplacers ?? defaults.http.retrieveReplacers,
  );

  const elements: ElementRegistryImpl = useMemo(() => {
    return new ElementRegistryImpl();
  }, []);

  const tasks: TaskQueue = useMemo(() => {
    return new TaskQueue({
      http: {
        client: () => clientRef.current,
      },
    });
  }, [clientRef]);

  const dependencies: CoreDependencies = useMemo(() => {
    return {
      http: {
        client,
        retrieveReplacers,
      },
    };
  }, [client, retrieveReplacers]);

  const context = useMemo<BehaviorContextValue>(() => {
    return {
      components,
      elements,
      events: elements.events,
      tasks,
      dependencies,
    };
  }, [components, elements, tasks, dependencies]);

  useEffect(() => {
    return tasks.init();
  }, [tasks]);

  return <BehaviorContext value={context}>{children}</BehaviorContext>;
};
