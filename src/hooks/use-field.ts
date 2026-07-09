import { useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { createStore } from '@krutoo/utils/store';
import { BehaviorContext } from '../context/behavior.ts';
import { FormContext } from '../context/form.ts';
import type { RegistryItem } from '../types.ts';

export interface UseFieldReturn {
  value: string;
  handleChange: (event: { target: { value: string } }) => void;
}

/**
 * Returns interface to declare basic form field.
 * @param options Field options.
 * @returns Interface to declare basic form field.
 */
export function useField({
  id,
  name,
  defaultValue,
}: {
  id?: string;
  name?: string;
  defaultValue?: string;
}): UseFieldReturn {
  const { formId } = useContext(FormContext);
  const { registry } = useContext(BehaviorContext);
  const defaultValueRef = useRef(defaultValue);
  const store = useMemo(
    () => createStore({ value: defaultValueRef.current ?? '' }),
    [defaultValueRef],
  );
  const state = useSyncExternalStore(store.subscribe, store.get, store.get);

  const handleChange = useCallback(
    (event: { target: { value: string } }): void => {
      store.set({ value: event.target.value });
    },
    [store],
  );

  useEffect(() => {
    if (!id) {
      return;
    }

    registry.set(id, {
      type: 'field',
      id,
      store,

      name,
      formId,
    } as RegistryItem & { name?: string; formId?: string });

    return () => {
      registry.delete(id);
    };
  }, [id, name, registry, store, formId]);

  return {
    value: state.value,
    handleChange,
  };
}
