import { useContext, useEffect } from 'react';
import { BehaviorContext } from '../../mod.ts';
import type { CoreComponent } from '../../types.ts';
import { fill } from '../../utils/param.ts';
import { set } from '../../utils/set.ts';
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
  const { registry } = useContext(BehaviorContext);

  useEffect(() => {
    if (!id) {
      return;
    }

    registry.set(id, {
      id,
      type: 'State.Insertion',
      actions: {
        run() {
          const element = registry.get(target);

          if (!element?.store) {
            return;
          }

          // @todo вынести structuredClone в зависимости
          element.store.set(set(structuredClone(element.store.get()), to, fill(undefined, value)));
        },
      },
    });

    return () => {
      registry.delete(id);
    };
  }, [id, target, value, to, registry]);

  return null;
};

StateInsertion.displayName = 'State.Insertion';
