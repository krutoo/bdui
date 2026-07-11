import { type ReactNode, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import { createStore } from '@krutoo/utils/store';
import type { Element, Primitive } from '#types/dto';
import { BehaviorContext } from '../../context/behavior.ts';
import type { CoreComponent } from '../../mod.ts';
import { buildRequest } from '../../utils/build-request.ts';
import { BehaviorRenderer } from '../behavior-renderer/mod.ts';
import type { DeferredProps } from './types.ts';

/**
 * Deferred tree. After mount make requests and renders BDUI from response.
 * Renders stub before request will be resolved/rejected.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Deferred: CoreComponent<'Deferred', DeferredProps> = ({
  id,
  resource,
  method,
  params,
  children,
}: DeferredProps) => {
  const { components, elements, tasks, dependencies } = useContext(BehaviorContext);
  const { http } = dependencies;
  const { retrieveReplacers } = http;
  const store = useMemo(() => createStore({ content: null as ReactNode }), []);
  const state = useSyncExternalStore(store.subscribe, store.get, store.get);

  useEffect(() => {
    if (!id || !resource) {
      return;
    }

    const query = () => {
      tasks.enqueue({
        type: 'fetch',
        request: buildRequest(resource, {
          method,
          params,
        }),
        async callback({ response }) {
          if (!response.ok) {
            // @todo status в store?
            return;
          }

          const replacers = await retrieveReplacers(response);

          for (const { elementId, tree } of replacers) {
            elements.get(elementId)?.actions?.fill?.(tree);
          }
        },
      });
    };

    elements.set(id, {
      type: 'Deferred',
      id,
      store,
      actions: {
        fill(tree: Element | Primitive) {
          store.set({
            content: <BehaviorRenderer components={components} tree={tree} />,
          });
        },
        invalidate() {
          store.set({
            content: null,
          });
          query();
        },
      },
    });

    query();

    return () => {
      elements.delete(id);
    };
  }, [id, resource, method, params, elements, components, tasks, store, retrieveReplacers]);

  return <>{state.content ?? children}</>;
};

Deferred.displayName = 'Deferred';
Deferred.skipExpressionIntercept = true;
