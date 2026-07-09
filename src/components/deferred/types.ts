import type { ReactNode } from 'react';
import type { RequestParamDefinition } from '../../utils/build-request.ts';

export interface DeferredProps {
  id?: string;
  resource?: string;
  method?: string;
  params?: RequestParamDefinition[];
  children?: ReactNode;
}
