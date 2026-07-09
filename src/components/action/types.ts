import type { ReactNode } from 'react';
import type { CoreComponent } from '../../types.ts';

export interface ActionProps {
  id?: string;
  type?: string;
  target?: string;
}

export interface ActionSequenceProps {
  id?: string;
  children?: ReactNode;
}

export interface ActionComponent extends CoreComponent<'Action', ActionProps> {
  Sequence: CoreComponent<'Action.Sequence', ActionSequenceProps>;
}
