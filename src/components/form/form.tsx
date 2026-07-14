import { useContext, useEffect, useMemo } from 'react';
import type { Status } from '@krutoo/utils';
import { useLatestRef, useStableCallback } from '@krutoo/utils/react';
import { type Store, createStore } from '@krutoo/utils/store';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../context/behavior.ts';
import { FormContext, type FormContextValue } from '../../context/form.ts';
import type { FormProps } from './types.ts';

interface FormState {
  status: Status;
  error: string | null;
}

interface FieldEntry {
  id: string;
  name: string;
  store: Store<{ value: string }>;
}

/**
 * Form. Makes HTTP-request according to props by running `submit` action.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Form: CoreComponent<'Form', FormProps> = props => {
  const { id, children } = props;
  const propsRef = useLatestRef(props);
  const { elements, dependencies } = useContext(BehaviorContext);
  const { http } = dependencies;
  const { client } = http;
  const store = useMemo(() => createStore<FormState>({ status: 'initial', error: null }), []);
  const fields = useMemo(() => new Set<FieldEntry>(), []);

  const registerField = useStableCallback<FormContextValue['registerField']>(field => {
    const entry = {
      id: `${field.name}[${Math.random().toString(16).slice(2)}]`,
      ...field,
    };

    fields.add(entry);

    return () => {
      fields.delete(entry);
    };
  });

  const submit = useStableCallback(async () => {
    const { resource, method } = propsRef.current;

    if (!resource || store.get().status === 'pending') {
      return;
    }

    try {
      // @todo paramPath который имеет приоритет над name и в котором может быть `foo.bar[2].baz`
      const values = [...fields].reduce<Record<string, string>>((acc, field) => {
        acc[field.name] = String(field.store.get().value);

        return acc;
      }, {});

      store.set({
        status: 'pending',
        error: null,
      });

      const response = await client.request(resource, {
        method,
        body: JSON.stringify(values),
        headers: { 'content-type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Server respond with status ${response.status}`);
      }

      store.set({
        status: 'success',
        error: null,
      });

      const { onSubmitDone } = propsRef.current;

      if (onSubmitDone) {
        const action = elements.get(onSubmitDone);

        action?.actions?.run?.();
      }
    } catch (error) {
      const { onSubmitFail } = propsRef.current;

      store.set({
        status: 'failure',
        error: String(error),
      });

      if (onSubmitFail) {
        const action = elements.get(onSubmitFail);

        action?.actions?.run?.();
      }
    }
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      type: 'Form',
      id,
      store,
      actions: {
        submit,
      },
    });

    return () => {
      elements.delete(id);
    };
  }, [id, store, submit, elements]);

  return <FormContext value={{ registerField }}>{children}</FormContext>;
};

Form.displayName = 'Form';
