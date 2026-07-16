import { useContext, useEffect, useMemo, useState } from 'react';
import { isShallowEqual } from '@krutoo/utils';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../context/behavior.ts';
import { ExpressionContext } from '../../context/expression.ts';
import { useEvaluate } from '../../hooks/use-evaluate.ts';
import type { EachProps } from './types.ts';

/**
 * Renders children for each item of iterable collection from `of` expression.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Each: CoreComponent<'Each', EachProps> = ({
  of: expression,
  as: itemVarname = '$item',
  indexAs: indexVarname = '$index',
  children,
}) => {
  const { events } = useContext(BehaviorContext);
  const { extraContext } = useContext(ExpressionContext);
  const evaluate = useEvaluate();

  const [collection, setCollection] = useState<unknown[] | null>(null);

  const items = useMemo<Record<string, unknown>[] | undefined>(
    () =>
      collection?.map((item, index) => ({
        ...extraContext,
        [indexVarname]: index,
        [itemVarname]: item,
      })),
    [collection, extraContext, indexVarname, itemVarname],
  );

  useEffect(() => {
    if (!expression) {
      return;
    }

    const sync = () => {
      try {
        const next = evaluate(expression);

        if (Array.isArray(next)) {
          setCollection(prev => (isShallowEqual(prev, next) ? prev : next));
        } else {
          // eslint-disable-next-line no-console
          console.warn('[Each] non-iterable value received from expression:', next);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    sync();

    return events.anyStoreChanged.subscribe(sync);
  }, [events, expression, evaluate]);

  return items?.map((item, index) => (
    <ExpressionContext key={index} value={{ extraContext: item }}>
      {children}
    </ExpressionContext>
  ));
};

Each.displayName = 'Each';
Each.skipExpressionIntercept = true;
