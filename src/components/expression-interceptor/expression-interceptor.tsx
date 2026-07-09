import {
  type ComponentType,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BehaviorContext } from '../../context/behavior.ts';
import { isExpressionNotation, useEvaluate } from '../../hooks/use-evaluate.ts';
import type { ExpressionInterceptorProps } from './types.ts';

/**
 * Automatically replaces all expressions in props to its evaluation results.
 * @param props Props.
 * @returns `ReactNode`.
 * @internal
 */
export const ExpressionInterceptor = <T extends ComponentType<any>>({
  component: Component,
  props,
}: ExpressionInterceptorProps<T>): ReactNode => {
  const { events } = useContext(BehaviorContext);

  const expressionKeys = useMemo(
    () => Object.keys(props).filter(propKey => isExpressionNotation(props[propKey])),
    [props],
  );

  const [computedProps, setComputedProps] = useState<null | typeof props>(null);
  const evaluate = useEvaluate();

  useEffect(() => {
    const sync = () => {
      const resultProps = { ...props };

      expressionKeys.forEach(propKey => {
        resultProps[propKey] = evaluate(props[propKey]);
      });

      setComputedProps(resultProps);
    };

    sync();

    return events.anyStoreChanged.subscribe(sync);
  }, [expressionKeys, events, props, evaluate]);

  if (!computedProps) {
    return null;
  }

  return <Component {...computedProps} />;
};
