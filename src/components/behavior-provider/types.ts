import type { ComponentType, ReactNode } from 'react';
import type { HttpClient, ResponseReplacersRetriever } from '#types/http';

export interface BehaviorProviderProps {
  /**
   * Supported component map.
   * You need to extend `CoreComponents` to use core components.
   */
  components: Record<string, ComponentType<any> | undefined>;

  /**
   * Typically in children somewhere you need to render `BehaviorRenderer`.
   */
  children?: ReactNode;

  /**
   * HTTP-related options.
   */
  http?: {
    /**
     * Client for making all requests from any http-related components, such as `Defer`, `Form` etc.
     */
    client?: HttpClient;

    /**
     * Takes response and should define list of replacements.
     * Replacement defines `Defer` block and content that should be used instead it.
     */
    retrieveReplacers?: ResponseReplacersRetriever;
  };
}
