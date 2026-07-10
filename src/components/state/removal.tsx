import { useContext, useEffect } from 'react';
import { unset } from '#shared/unset';
import { BehaviorContext } from '../../mod.ts';
import type { CoreComponent } from '../../types.ts';
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
  const { registry } = useContext(BehaviorContext);

  useEffect(() => {
    if (!id) {
      return;
    }

    registry.set(id, {
      id,
      type: 'State.Removal',
      actions: {
        run() {
          const element = registry.get(target);

          if (!element?.store) {
            return;
          }

          // @todo вынести structuredClone в зависимости
          element.store.set(unset(structuredClone(element.store.get()), from));
        },
      },
    });

    return () => {
      registry.delete(id);
    };
  }, [id, target, from, registry]);

  return null;
};

StateRemoval.displayName = 'State.Removal';
