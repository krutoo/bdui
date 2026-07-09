import type { ComponentProps, ComponentType } from 'react';

export interface ExpressionInterceptorProps<T extends ComponentType<any>> {
  component: T;
  props: ComponentProps<T>;
}
