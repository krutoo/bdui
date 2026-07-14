import { useContext, useEffect } from 'react';
import { unset } from '#shared/unset';
import type { CoreComponent } from '#types/core';
import { BehaviorContext } from '../../context/behavior.ts';
import type { StateRemovalProps } from './types.ts';

/**
 * Defines state removal action.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const StateRemoval: CoreComponent<'State.Removal', StateRemovalProps> = ({
  id,
  target,
  from,
}) => {
  const { elements } = useContext(BehaviorContext);

  // @todo также зарегистрироваться для Action.Sequence?
  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      id,
      type: 'State.Removal',
      actions: {
        run() {
          if (!target || !from) {
            return;
          }

          const element = elements.get(target);

          if (!element?.store) {
            return;
          }

          // @todo вынести structuredClone в зависимости
          element.store.set(unset(structuredClone(element.store.get()), from));
        },
      },
    });

    return () => {
      elements.delete(id);
    };
  }, [id, target, from, elements]);

  return null;
};

StateRemoval.displayName = 'State.Removal';
