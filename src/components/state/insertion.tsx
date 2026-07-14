import { useContext, useEffect } from 'react';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../context/behavior.ts';
import { useParamEval } from '../../hooks/use-param-eval.ts';
import { fill } from '../../utils/param.ts';
import type { StateInsertionProps } from './types.ts';

/**
 * Defines state insertion action.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const StateInsertion: CoreComponent<'State.Insertion', StateInsertionProps> = ({
  id,
  target,
  value,
}) => {
  const { elements } = useContext(BehaviorContext);
  const evaluateParam = useParamEval();

  // @todo также зарегистрироваться для Action.Sequence?
  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      id,
      type: 'State.Insertion',
      actions: {
        run() {
          if (!target || !value) {
            return;
          }

          const element = elements.get(target);

          if (element?.type !== 'State' || !element?.store) {
            return;
          }

          // @todo вынести structuredClone в зависимости
          element.store.set(fill(structuredClone(element.store.get()), value.map(evaluateParam)));
        },
      },
    });

    return () => {
      elements.delete(id);
    };
  }, [id, target, value, elements, evaluateParam]);

  return null;
};

StateInsertion.displayName = 'State.Insertion';
