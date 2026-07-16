import {
  type ComponentType,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useStableCallback } from '@krutoo/utils/react';
import { BehaviorContext } from '../../context/behavior.ts';
import { isExpressionNotation, useEvaluate } from '../../hooks/use-evaluate.ts';
import type { ExpressionInterceptorProps } from './types.ts';

interface UnknownProps extends Record<string, unknown> {}

interface State {
  actual?: boolean;
  computed: null | UnknownProps;
}

const initialState: State = {
  actual: false,
  computed: null,
};

/**
 * Automatically replaces all expressions in props to its evaluation results.
 * @param props Props.
 * @returns `ReactNode`.
 * @internal
 */
export const ExpressionInterceptor = <T extends ComponentType<object>>({
  component: Component,
  props,
}: ExpressionInterceptorProps<T>): ReactNode => {
  const { events } = useContext(BehaviorContext);
  const evaluate = useEvaluate();

  const [state, setState] = useState<State>(initialState);

  const expressionKeys = useMemo(
    () =>
      Object.keys(props).filter(propKey => isExpressionNotation((props as UnknownProps)[propKey])),
    [props],
  );

  const evaluateProps = useStableCallback(() => {
    const result: Record<string, unknown> = {};

    expressionKeys.forEach(propKey => {
      result[propKey] = evaluate((props as UnknownProps)[propKey] as string);
    });

    setState({
      actual: true,
      computed: result,
    });
  });

  useEffect(() => {
    return events.anyStoreChanged.subscribe(() => {
      setState(prev => ({
        ...prev,
        actual: false,
      }));
    });
  }, [events, evaluateProps]);

  useEffect(() => {
    if (!state.actual) {
      evaluateProps();
    }
  }, [state.actual, evaluateProps]);

  if (!state.computed) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Component {...props} {...(state.computed as any)} />;
};
