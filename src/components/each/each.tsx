import { useContext, useEffect, useState } from 'react';
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
  const { extraContext } = useContext(ExpressionContext);
  const { events } = useContext(BehaviorContext);
  const [collection, setCollection] = useState<unknown[] | null>(null);

  const evaluate = useEvaluate();

  useEffect(() => {
    if (!expression) {
      return;
    }

    const sync = () => {
      try {
        const found = evaluate(expression);

        if (Array.isArray(found)) {
          setCollection(found);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    sync();

    return events.anyStoreChanged.subscribe(sync);
  }, [events, expression, evaluate]);

  return (
    <>
      {collection?.map((item, index) => (
        // @todo Надо подумать как быть с тем, что надо каждый раз не забывать докидывать extraContext
        <ExpressionContext
          key={index}
          value={{
            extraContext: {
              ...extraContext,
              [indexVarname]: index,
              [itemVarname]: item,
            },
          }}
        >
          {children}
        </ExpressionContext>
      ))}
    </>
  );
};

Each.displayName = 'Each';
Each.skipExpressionIntercept = true;
