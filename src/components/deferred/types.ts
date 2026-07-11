import type { ReactNode } from 'react';
import type { RequestParamDefinition } from '#types/http';

export interface DeferredProps {
  id?: string;
  resource?: string;
  method?: string;
  params?: RequestParamDefinition[];
  children?: ReactNode;
}
