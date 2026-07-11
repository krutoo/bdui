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
export function useEvaluate(): (expression: string) => unknown {
  const { elements } = useContext(BehaviorContext);
  const { extraContext } = useContext(ExpressionContext);

  return useCallback(
    (expression: string) => {
      const cleanExpression = expression.replace(/^{{(.+)}}$/, '$1');

      const getState = <S = unknown>(targetId: string): S | undefined => {
        return elements.get(targetId)?.store?.get() as S | undefined;
      };

      const basicContext = {
        valueOf: (targetId: string) => {
          return String(getState<{ value: string }>(targetId)?.value);
        },

        dataOf: (targetId: string) => {
          return getState<{ data: unknown }>(targetId)?.data;
        },

        statusOf: (targetId: string) => {
          return String(getState<{ status: unknown }>(targetId)?.status);
        },

        stateOf: (targetId: string) => {
          return getState(targetId);
        },

        concat: (...rest: unknown[]): string => {
          return rest.join('');
        },
      };

      const result = evaluate(cleanExpression, {
        ...extraContext,
        ...basicContext,
      });

      return result;
    },
    [elements, extraContext],
  );
}
