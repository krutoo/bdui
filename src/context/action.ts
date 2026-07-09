import { type Context, createContext } from 'react';

export interface ActionSequenceContextValue {
  registerAction: (actionId: string) => () => void;
}

export const ActionSequenceContext: Context<ActionSequenceContextValue> =
  createContext<ActionSequenceContextValue>({
    registerAction() {
      return () => {};
    },
  });
