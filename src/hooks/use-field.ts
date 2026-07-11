import { useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { createStore } from '@krutoo/utils/store';
import type { ElementRegistryItem } from '#types/core';
import { BehaviorContext } from '../context/behavior.ts';
import { FormContext } from '../context/form.ts';

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
  const { elements } = useContext(BehaviorContext);
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

    elements.set(id, {
      type: 'field',
      id,
      store,

      name,
      formId,
    } as ElementRegistryItem & { name?: string; formId?: string });

    return () => {
      elements.delete(id);
    };
  }, [id, name, elements, store, formId]);

  return {
    value: state.value,
    handleChange,
  };
}
