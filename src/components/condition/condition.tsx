import { useCallback, useContext, useEffect, useState } from 'react';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../context/behavior.ts';
import { useEvaluate } from '../../hooks/use-evaluate.ts';
import type { ConditionProps } from './types.ts';

/**
 * Renders own children only if expression in `if` prop is truthy.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Condition: CoreComponent<'Condition', ConditionProps> = ({
  if: expression = '',
  children,
}) => {
  const { events } = useContext(BehaviorContext);
  const [shown, setShown] = useState(false);

  const evaluate = useEvaluate();

  const sync = useCallback(() => {
    try {
      setShown(Boolean(evaluate(expression)));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [expression, evaluate]);

  useEffect(() => {
    sync();

    return events.anyStoreChanged.subscribe(sync);
  }, [sync, events]);

  if (!shown) {
    return;
  }

  return children;
};

Condition.displayName = 'Condition';
Condition.skipExpressionIntercept = true;
