import { useContext, useEffect, useMemo } from 'react';
import { ActionSequenceContext, type ActionSequenceContextValue } from '../../context/action.ts';
import { BehaviorContext } from '../../mod.ts';
import type { CoreComponent } from '../../types.ts';
import type { ActionSequenceProps } from './types.ts';

/**
 * Declares a chain of actions. Renders nothing.
 * Will run each child actions in order they declared.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const ActionSequence: CoreComponent<'Action.Sequence', ActionSequenceProps> = ({
  id,
  children,
}) => {
  const { registry } = useContext(BehaviorContext);
  const order = useMemo(() => new Set<string>(), []);

  useEffect(() => {
    if (!id) {
      return;
    }

    registry.set(id, {
      type: 'Action.Sequence',
      id,
      actions: {
        async run() {
          const actions = [...order].map(actionId => registry.get(actionId));

          for (const action of actions) {
            if (action?.type === 'action') {
              await action?.actions?.run?.();
            }
          }
        },
      },
    });

    return () => {
      registry.delete(id);
    };
  }, [id, order, registry]);

  const context = useMemo<ActionSequenceContextValue>(() => {
    return {
      registerAction(actionId: string) {
        order.add(actionId);

        return () => {
          order.delete(actionId);
        };
      },
    };
  }, [order]);

  return <ActionSequenceContext value={context}>{children}</ActionSequenceContext>;
};

ActionSequence.displayName = 'Action.Sequence';
