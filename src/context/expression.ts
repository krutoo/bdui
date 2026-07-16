import { type Context, createContext } from 'react';

export interface ExpressionContextValue {
  extraContext: Record<string, any>;
}

export const ExpressionContext: Context<ExpressionContextValue> =
  createContext<ExpressionContextValue>({
    extraContext: {},
  });

ExpressionContext.displayName = 'ExpressionContext';
