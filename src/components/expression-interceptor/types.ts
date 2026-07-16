import type { ComponentProps, ComponentType } from 'react';

export interface ExpressionInterceptorProps<T extends ComponentType<object>> {
  component: T;
  props: ComponentProps<T>;
}
