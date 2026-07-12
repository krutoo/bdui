import type { ReactNode } from 'react';

export interface HeadingProps {
  level?: '1' | '2' | '3' | '4' | '5' | '6';
  children?: ReactNode;
}

export function Heading({ level = '1', children }: HeadingProps) {
  const Tag: `h${NonNullable<HeadingProps['level']>}` = `h${level}`;

  return <Tag>{children}</Tag>;
}

Heading.displayName = 'Heading';
