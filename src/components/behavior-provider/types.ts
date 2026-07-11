import type { ComponentType, ReactNode } from 'react';
import type { HttpClient, ResponseReplacersRetriever } from '#types/http';

export interface BehaviorProviderProps {
  components: Record<string, ComponentType<any> | undefined>;
  children?: ReactNode;
  http?: {
    client?: HttpClient;
    retrieveReplacers?: ResponseReplacersRetriever;
  };
}
