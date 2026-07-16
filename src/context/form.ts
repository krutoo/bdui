import { type Context, createContext } from 'react';
import type { Store } from '@krutoo/utils/store';

export interface FormContextValue {
  registerField: (fieldInfo: { name: string; store: Store<{ value: string }> }) => () => void;
}

export const FormContext: Context<FormContextValue> = createContext<FormContextValue>({
  registerField: () => () => {},
});

FormContext.displayName = 'FormContext';
