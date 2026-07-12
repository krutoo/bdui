import type { ReactNode } from 'react';

export interface OptionProps {
  value: string;
  children?: ReactNode;
}

export function Option({ value, children }: OptionProps): ReactNode {
  return <option value={value}>{children}</option>;
}

Option.displayName = 'Option';
