import { useContext, useEffect, useMemo } from 'react';
import { createStore } from '@krutoo/utils/store';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../context/behavior.ts';
import { buildRequest } from '../../utils/build-request.ts';
import type { QueryProps } from './types.ts';

/**
 * Declarative HTTP-query. Renders nothing.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Query: CoreComponent<'Query', QueryProps> = ({
  id,
  method,
  resource,
  params,
}: QueryProps) => {
  const { elements, dependencies } = useContext(BehaviorContext);
  const { http } = dependencies;
  const { client } = http;
  const store = useMemo(() => createStore({ status: 'initial', data: null as any }), []);

  useEffect(() => {
    if (!id || !resource) {
      return;
    }

    elements.set(id, {
      type: 'Query',
      id,
      store,
      actions: {
        invalidate() {
          // @todo реализовать
        },
      },
    });

    store.set({ status: 'pending', data: store.get().data });

    const request = buildRequest(resource, { method, params });

    client
      .request(request.url, request)
      .then(res => res.json())
      .then(data => store.set({ status: 'success', data }))
      .catch(() => store.set({ status: 'failure', data: null }));

    return () => {
      store.set({ status: 'initial', data: null });
      elements.delete(id);
    };
  }, [id, method, resource, params, store, elements, client]);

  return null;
};

Query.displayName = 'Query';
