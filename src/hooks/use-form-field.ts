import { useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import { createStore } from '@krutoo/utils/store';
import { BehaviorContext } from '../context/behavior.ts';
import { FormContext } from '../context/form.ts';

export interface UseFieldOptions {
  id?: string;
  name?: string;
  defaultValue?: string;
}

export interface UseFieldReturn {
  value: string;
  handleChange: (event: { target: { value: string } }) => void;
}

/**
 * Returns interface to declare basic form field.
 * @param options Field options.
 * @returns Interface to declare basic form field.
 */
export function useFormField({ id, name, defaultValue }: UseFieldOptions): UseFieldReturn {
  const { elements } = useContext(BehaviorContext);
  const { registerField } = useContext(FormContext);

  const store = useMemo(
    () => createStore<{ value: string }>({ value: defaultValue ?? '' }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const state = useSyncExternalStore(store.subscribe, store.get, store.get);

  const handleChange = useCallback(
    (event: { target: { value: string } }): void => {
      store.set({ value: event.target.value });
    },
    [store],
  );

  // register form field if name is defined
  useEffect(() => {
    if (!name) {
      return;
    }

    return registerField({
      name,
      store,
    });
  }, [name, store, registerField]);

  // register element if id is defined
  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      type: 'Form.Field',
      id,
      store,
      actions: {},
    });

    return () => {
      elements.delete(id);
    };
  }, [id, store, elements]);

  return {
    value: state.value,
    handleChange,
  };
}
