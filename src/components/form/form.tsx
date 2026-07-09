import { useContext, useEffect, useMemo } from 'react';
import type { Status } from '@krutoo/utils';
import { createStore } from '@krutoo/utils/store';
import { BehaviorContext } from '../../context/behavior.ts';
import { FormContext } from '../../context/form.ts';
import type { CoreComponent } from '../../types.ts';
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
  const { registry, dependencies } = useContext(BehaviorContext);
  const { http } = dependencies;
  const { client } = http;
  const store = useMemo(() => createStore({ status: 'initial' as Status }), []);

  useEffect(() => {
    if (!id || !resource) {
      return;
    }

    registry.set(id, {
      type: 'Form',
      id,
      store,
      actions: {
        async submit() {
          if (store.get().status === 'pending') {
            return;
          }

          const values = Object.fromEntries(
            [...registry.values()]
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
                const action = registry.get(onSubmitDone);

                action?.actions?.run?.();
              }
            })
            .catch(() => {
              store.set({ status: 'failure' });

              if (onSubmitFail) {
                const action = registry.get(onSubmitFail);

                action?.actions?.run?.();
              }
            });
        },
      },
    });

    return () => {
      registry.delete(id);
    };
  }, [id, resource, method, onSubmitDone, onSubmitFail, store, registry, client]);

  return <FormContext.Provider value={{ formId: id }}>{children}</FormContext.Provider>;
};

Form.displayName = 'Form';
