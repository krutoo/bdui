import { type ComponentType, Fragment } from 'react';
import { Action } from './components/action/mod.ts';
import { Condition } from './components/condition/mod.ts';
import { Defer } from './components/defer/mod.ts';
import { Display } from './components/display/mod.ts';
import { Each } from './components/each/mod.ts';
import { Form } from './components/form/mod.ts';
import { Query } from './components/query/mod.ts';
import { State } from './components/state/mod.ts';

export interface CoreComponentsMap {
  [key: string]: ComponentType<object> | undefined;
}

export const CoreComponents: CoreComponentsMap = {
  Fragment,
  [Action.displayName]: Action,
  [Action.Sequence.displayName]: Action.Sequence,
  [Condition.displayName]: Condition,
  [Defer.displayName]: Defer,
  [Form.displayName]: Form,
  [Query.displayName]: Query,
  [Each.displayName]: Each,
  [Display.displayName]: Display,
  [State.displayName]: State,
  [State.Insertion.displayName]: State.Insertion,
  [State.Removal.displayName]: State.Removal,
};
