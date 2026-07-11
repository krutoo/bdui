import type { RequestParamDefinition } from '#types/http';

export interface QueryProps {
  id?: string;
  method?: string;
  resource?: string;
  params?: RequestParamDefinition[];
}
