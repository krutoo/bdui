import { type ComponentType, Fragment } from 'react';
import { Action } from './components/action/mod.ts';
import { Conditional } from './components/conditional/mod.ts';
import { Deferred } from './components/deferred/mod.ts';
import { Display } from './components/display/mod.ts';
import { Each } from './components/each/mod.ts';
import { Form } from './components/form/mod.ts';
import { Query } from './components/query/mod.ts';
import { State } from './components/state/mod.ts';

export interface CoreComponentsMap {
  [key: string]: ComponentType<any> | undefined;
}

export const CoreComponents: CoreComponentsMap = {
  Fragment,
  [Action.displayName]: Action,
  [Action.Sequence.displayName]: Action.Sequence,
  [Conditional.displayName]: Conditional,
  [Deferred.displayName]: Deferred,
  [Form.displayName]: Form,
  [Query.displayName]: Query,
  [Each.displayName]: Each,
  [Display.displayName]: Display,
  [State.displayName]: State,
  [State.Insertion.displayName]: State.Insertion,
  [State.Removal.displayName]: State.Removal,
};
