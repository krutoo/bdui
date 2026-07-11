import { type ReactNode, useContext, useEffect, useState } from 'react';
import { isReactNode } from '#shared/react';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../context/behavior.ts';
import { useEvaluate } from '../../hooks/use-evaluate.ts';
import type { DisplayProps } from './types.ts';

/**
 * Renders result of expression if possible.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const Display: CoreComponent<'Display', DisplayProps> = ({ of: expression = '' }) => {
  const { events } = useContext(BehaviorContext);
  const evaluate = useEvaluate();
  const [content, setContent] = useState<ReactNode>(null);

  useEffect(() => {
    const sync = () => {
      try {
        const result = evaluate(expression);

        setContent(isReactNode(result) ? result : '{Non display value}');
      } catch (error) {
        // @todo logger
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    sync();

    return events.anyStoreChanged.subscribe(sync);
  }, [events, evaluate, expression]);

  return content;
};

Display.displayName = 'Display';
Display.skipExpressionIntercept = true;
