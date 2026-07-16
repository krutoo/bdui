import { useRef } from 'react';
import { isShallowEqual } from '@krutoo/utils';

/**
 * Returns memoized given value.
 * Updates only if value from previous render is not shallow equal to actual value.
 * @param value Value.
 * @returns Same value.
 */
export function useShallowEqual<T>(value: T): T {
  const ref = useRef(value);

  if (!isShallowEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
