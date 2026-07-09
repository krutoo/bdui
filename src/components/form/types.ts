import type { ReactNode } from 'react';

export interface FormProps {
  id?: string;
  resource?: string;
  method?: string;
  children?: ReactNode;
  onSubmitDone?: string;
  onSubmitFail?: string;
}
