import { type Context, createContext } from 'react';

export interface ActionSequenceContextValue {
  registerAction: (action: { type: string; target: string }) => () => void;
}

export const ActionSequenceContext: Context<ActionSequenceContextValue> =
  createContext<ActionSequenceContextValue>({
    registerAction: () => () => {},
  });

ActionSequenceContext.displayName = 'ActionSequenceContext';
