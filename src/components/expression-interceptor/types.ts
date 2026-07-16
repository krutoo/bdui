import type { ComponentProps, ComponentType, ReactNode } from 'react';

export interface ExpressionInterceptorProps<T extends ComponentType<object>> {
  component: T;
  props: ComponentProps<T>;
}

export interface ExpressionInterceptorComponent {
  <T extends ComponentType<object>>(props: ExpressionInterceptorProps<T>): ReactNode;
  displayName: string;
}
