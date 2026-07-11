import type { ReactNode } from 'react';
import type { RequestParamDefinition } from '#types/http';

export interface DeferProps {
  id?: string;
  resource?: string;
  method?: string;
  params?: RequestParamDefinition[];
  children?: ReactNode;
}
