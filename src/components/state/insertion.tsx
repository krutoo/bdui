import { useContext, useEffect } from 'react';
import { set } from '#shared/set';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../mod.ts';
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
  to,
}) => {
  const { elements } = useContext(BehaviorContext);

  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      id,
      type: 'State.Insertion',
      actions: {
        run() {
          const element = elements.get(target);

          if (!element?.store) {
            return;
          }

          // @todo вынести structuredClone в зависимости
          element.store.set(set(structuredClone(element.store.get()), to, fill(undefined, value)));
        },
      },
    });

    return () => {
      elements.delete(id);
    };
  }, [id, target, value, to, elements]);

  return null;
};

StateInsertion.displayName = 'State.Insertion';
