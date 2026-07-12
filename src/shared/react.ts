import { type ReactNode, isValidElement } from 'react';
import { isObject } from '@krutoo/utils';

/**
 * Checks that given value is valid `ReactNode` exclude promises/iterables.
 * @param value Value.
 * @returns True if value is single ReactNode, false otherwise.
 */
export function isSingleReactNode(
  value: unknown,
): value is Exclude<ReactNode, Promise<unknown> | Iterable<unknown>> {
  return isValidElement(value) || (!isObject(value) && typeof value !== 'symbol');
}
