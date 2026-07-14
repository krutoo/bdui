import { type ReactNode, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import { createStore } from '@krutoo/utils/store';
import type { Element, Primitive } from '#types/dto';
import { BehaviorContext } from '../../context/behavior.ts';
import { useParamEval } from '../../hooks/use-param-eval.ts';
import type { CoreComponent } from '../../types/core.ts';
import { buildRequest } from '../../utils/build-request.ts';
import { BehaviorRenderer } from '../behavior-renderer/mod.ts';
import type { DeferProps } from './types.ts';

/**
 * Deferred markup. After mount make request and renders BDUI from response.
 * Renders children as stub until request will be resolved/rejected.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Defer: CoreComponent<'Defer', DeferProps> = ({
  id,
  resource,
  method,
  params,
  children,
}: DeferProps) => {
  const { elements, tasks, dependencies } = useContext(BehaviorContext);
  const evaluateParam = useParamEval();
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
          params: [
            {
              in: 'header',
              key: 'content-type',
              value: 'application/json',
            },
            ...(params?.map(evaluateParam) ?? []),
          ],
        }),
        async callback({ response }) {
          if (!response.ok) {
            // @todo status в store
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
            content: <BehaviorRenderer tree={tree} />,
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
  }, [id, resource, method, params, elements, tasks, store, retrieveReplacers, evaluateParam]);

  return <>{state.content ?? children}</>;
};

Defer.displayName = 'Defer';
Defer.skipExpressionIntercept = true;
