import { useContext, useEffect, useMemo } from 'react';
import type { CoreComponent } from '#types/core';
import { ActionSequenceContext, type ActionSequenceContextValue } from '../../context/action.ts';
import { BehaviorContext } from '../../mod.ts';
import type { ActionSequenceProps } from './types.ts';

interface ActionInfo {
  type: string;
  target: string;
}

/**
 * Declares a chain of actions. Renders nothing.
 * On run will run child actions in order they declared.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const ActionSequence: CoreComponent<'Action.Sequence', ActionSequenceProps> = ({
  id,
  children,
}) => {
  const { elements } = useContext(BehaviorContext);
  const actions = useMemo(() => new Set<ActionInfo>(), []);

  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      type: 'Action.Sequence',
      id,
      actions: {
        async run() {
          for (const action of actions) {
            await elements.get(action.target)?.actions[action.type]?.();
          }
        },
      },
    });

    return () => {
      elements.delete(id);
    };
  }, [id, actions, elements]);

  const context = useMemo<ActionSequenceContextValue>(() => {
    return {
      registerAction(action: ActionInfo) {
        actions.add(action);

        return () => {
          actions.delete(action);
        };
      },
    };
  }, [actions]);

  return <ActionSequenceContext value={context}>{children}</ActionSequenceContext>;
};

ActionSequence.displayName = 'Action.Sequence';
