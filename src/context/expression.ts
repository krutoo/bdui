import { type Context, createContext } from 'react';

export interface ExpressionContextValue {
  extraContext: null | Record<string, unknown>;
}

export const ExpressionContext: Context<ExpressionContextValue> =
  createContext<ExpressionContextValue>({
    extraContext: null,
  });

ExpressionContext.displayName = 'ExpressionContext';
