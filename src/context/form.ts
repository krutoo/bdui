import { type Context, createContext } from 'react';

export interface FormContextValue {
  formId?: string;
}

export const FormContext: Context<FormContextValue> = createContext<FormContextValue>({
  formId: undefined,
});
