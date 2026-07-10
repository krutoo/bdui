import { useCallback, useContext } from 'react';
import { evaluate } from '#shared/expression';
import { BehaviorContext } from '../context/behavior.ts';
import { ExpressionContext } from '../context/expression.ts';

/**
 * Checks that value is in expression notation like `{{...}}`.
 * @param value Value.
 * @returns True if value is string in expression notation, false otherwise.
 */
export function isExpressionNotation(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}');
}

/**
 * Returns evaluate function.
 * @returns Evaluate function.
 */
export function useEvaluate<T>(): (expression: string) => T {
  const { registry } = useContext(BehaviorContext);
  const { extraContext } = useContext(ExpressionContext);

  return useCallback(
    (expression: string) => {
      const cleanExpression = expression.replace(/^{{(.+)}}$/, '$1');

      const basicContext = {
        valueOf: (targetId: string) => {
          const state = registry.get(targetId)?.store?.get();

          return (state as { value: string })?.value;
        },

        dataOf: (targetId: string) => {
          const state = registry.get(targetId)?.store?.get();

          return (state as { data: unknown })?.data;
        },

        statusOf: (targetId: string) => {
          const state = registry.get(targetId)?.store?.get();

          return `${(state as { status?: unknown })?.status}`;
        },

        stateOf: (targetId: string) => {
          const state = registry.get(targetId)?.store?.get();

          return state;
        },

        concat: (...rest: string[]): string => {
          return rest.join('');
        },
      };

      const result = evaluate(cleanExpression, {
        ...extraContext,
        ...basicContext,
      });

      return result as T;
    },
    [registry, extraContext],
  );
}
