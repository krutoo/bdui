import { useContext, useEffect, useMemo } from 'react';
import { createStore } from '@krutoo/utils/store';
import { BehaviorContext } from '../../context/behavior.ts';
import { useParamEval } from '../../hooks/use-param-eval.ts';
import { fill } from '../../utils/param.ts';
import { StateInsertion } from './insertion.tsx';
import { StateRemoval } from './removal.tsx';
import type { StateComponent } from './types.ts';

export const State: StateComponent = ({ id, init: initialParams }) => {
  const { elements } = useContext(BehaviorContext);
  const evaluateParam = useParamEval();

  const store = useMemo(() => {
    return createStore(fill(undefined, initialParams?.map(evaluateParam) ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }

    elements.set(id, {
      type: 'State',
      id,
      store,
      actions: {},
    });

    return () => {
      elements.delete(id);
    };
  }, [id, elements, store]);

  return null;
};

State.displayName = 'State';
State.Insertion = StateInsertion;
State.Removal = StateRemoval;
