import { useCallback, useContext, useEffect, useState } from 'react';
import { BehaviorContext } from '../../context/behavior.ts';
import { useEvaluate } from '../../hooks/use-evaluate.ts';
import type { CoreComponent } from '../../types.ts';
import type { ConditionalProps } from './types.ts';

/**
 * Renders own children only if expression in `if` prop is truthy.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Conditional: CoreComponent<'Conditional', ConditionalProps> = ({
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

Conditional.displayName = 'Conditional';
Conditional.skipExpressionIntercept = true;
