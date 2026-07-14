import type { ReactNode } from 'react';
import type { RequestParamDefinition } from '#types/http';

export interface FormProps {
  id?: string;

  /** Content. */
  children?: ReactNode;

  /** Valid URL, can be without origin. */
  resource?: string;

  /** Valid HTTP method, for example "GET". */
  method?: string;

  /** Id of runnable element (action) to run after successful response. */
  onSubmitDone?: string;

  /** Id of runnable element (action) to run after response failure. */
  onSubmitFail?: string;

  // @todo поддержать
  /** Extra params for request. */
  params?: RequestParamDefinition[];
}
