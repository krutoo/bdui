import type { RequestParamDefinition } from '../../utils/build-request.ts';

export interface QueryProps {
  id?: string;
  method?: string;
  resource?: string;
  params?: RequestParamDefinition[];
}
