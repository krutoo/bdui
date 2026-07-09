import { useContext, useEffect } from 'react';
import { ActionSequenceContext } from '../../context/action.ts';
import { BehaviorContext } from '../../context/behavior.ts';
import { ActionSequence } from './sequence.tsx';
import type { ActionComponent } from './types.ts';

/**
 * Action component. Renders nothing.
 * "Actions" is way to interact with elements.
 *
 * @param props Props.
 * @returns `ReactNode`.
 *
 * For example if you have Button and Modal componentd,
 * you can define `open` action for Modal and click action for Button.
 * Than you can say that when button clicks, modal should be opened.
 *
 * In markup it can be look like this:
 * ```jsx
 * <>
 *  <Button onClick='openMyModal'>Open</Button>
 *  <Modal id='myModal'>Hello</Modal>
 *  <Action id='openMyModal' type='open' for='myModal' />
 * </>
 * ```
 */
export const Action: ActionComponent = ({ id, type, target: target }) => {
  const { registry } = useContext(BehaviorContext);
  const { registerAction } = useContext(ActionSequenceContext);

  useEffect(() => {
    if (!id || !target || !type) {
      return;
    }

    registry.set(id, {
      type: 'Action',
      id,
      actions: {
        run() {
          const item = registry.get(target);

          item?.actions?.[type]?.();
        },
      },
    });
  }, [id, type, target, registry]);

  useEffect(() => {
    if (!id) {
      return;
    }

    return registerAction(id);
  }, [id, registerAction]);

  return null;
};

Action.displayName = 'Action';
Action.Sequence = ActionSequence;
