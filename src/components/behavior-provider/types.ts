import type { ComponentType, ReactNode } from 'react';
import type { ResponseReplacersRetriever } from '../../context/behavior.ts';
import type { HttpClient } from '../../types.ts';

export interface BehaviorProviderProps {
  components: Record<string, ComponentType<any> | undefined>;
  children?: ReactNode;
  http?: {
    client?: HttpClient;
    retrieveReplacersFromResponse?: ResponseReplacersRetriever;
  };
}
