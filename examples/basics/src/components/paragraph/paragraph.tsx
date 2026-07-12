import type { ReactNode } from 'react';

export function Paragraph({ children }: { children?: ReactNode }) {
  return <p>{children}</p>;
}

Paragraph.displayName = 'Paragraph';
