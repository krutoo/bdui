import { useContext, useEffect, useMemo } from 'react';
import { createStore } from '@krutoo/utils/store';
import { BehaviorContext } from '../../context/behavior.ts';
import { fill } from '../../utils/param.ts';
import { StateInsertion } from './insertion.tsx';
import { StateRemoval } from './removal.tsx';
import type { StateComponent } from './types.ts';

export const State: StateComponent = ({ id, init: initialParams }) => {
  const { registry } = useContext(BehaviorContext);

  const store = useMemo(() => {
    return createStore(fill(undefined, initialParams ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }

    registry.set(id, {
      type: 'State',
      id,
      store,
      actions: {},
    });

    return () => {
      registry.delete(id);
    };
  }, [id, registry, store]);

  return null;
};

State.displayName = 'State';
State.Insertion = StateInsertion;
State.Removal = StateRemoval;
