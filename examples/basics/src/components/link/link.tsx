import type { ReactNode } from 'react';

export interface LinkProps {
  href?: string;
  target?: string;
  children?: ReactNode;
}

export function Link({ href, target, children }: LinkProps) {
  return (
    <a href={href} target={target}>
      {children}
    </a>
  );
}

Link.displayName = 'Link';
