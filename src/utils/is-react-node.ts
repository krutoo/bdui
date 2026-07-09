import { type ReactNode, isValidElement } from 'react';
import { isPrimitive } from './is-primitive.ts';

/**
 * Checks that given value is valid `ReactNode`.
 * @param value Value.
 * @returns True if value is ReactNode, false otherwise.
 */
export function isReactNode(value: unknown): value is ReactNode {
  // @todo как быть если iterable?
  return isValidElement(value) || (isPrimitive(value) && typeof value !== 'symbol');
}
