import { useContext, useEffect, useMemo } from 'react';
import type { Status } from '@krutoo/utils';
import { createStore } from '@krutoo/utils/store';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../context/behavior.ts';
import { FormContext } from '../../context/form.ts';
import type { FormProps } from './types.ts';

/**
 * Form. Makes HTTP-request according to props by running `submit` action.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Form: CoreComponent<'Form', FormProps> = ({
  id,
  resource,
  method,
  children,
  onSubmitDone,
  onSubmitFail,
}) => {
  const { elements, dependencies } = useContext(BehaviorContext);
  const { http } = dependencies;
  const { client } = http;
  const store = useMemo(() => createStore({ status: 'initial' as Status }), []);

  useEffect(() => {
    if (!id || !resource) {
      return;
    }

    elements.set(id, {
      type: 'Form',
      id,
      store,
      actions: {
        async submit() {
          if (store.get().status === 'pending') {
            return;
          }

          // @todo paramPath который имеет приоритет над name и в котором может быть `foo.bar[2].baz`
          const values = Object.fromEntries(
            [...elements.values()]
              .filter(item => (item as { formId?: string }).formId === id)
              .map(item => [
                (item as { name?: string }).name,
                (item.store?.get() as { value?: unknown } | undefined)?.value,
              ]),
          );

          await client
            .request(resource, {
              method,
              body: JSON.stringify(values),
              headers: { 'content-type': 'application/json' },
            })
            .then(res => {
              return res.ok ? Promise.resolve() : Promise.reject();
            })
            .then(() => {
              store.set({ status: 'success' });

              if (onSubmitDone) {
                const action = elements.get(onSubmitDone);

                action?.actions?.run?.();
              }
            })
            .catch(() => {
              store.set({ status: 'failure' });

              if (onSubmitFail) {
                const action = elements.get(onSubmitFail);

                action?.actions?.run?.();
              }
            });
        },
      },
    });

    return () => {
      elements.delete(id);
    };
  }, [id, resource, method, onSubmitDone, onSubmitFail, store, elements, client]);

  return <FormContext value={{ formId: id }}>{children}</FormContext>;
};

Form.displayName = 'Form';
