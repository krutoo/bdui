import { type ComponentType, Fragment } from 'react';
import { Action, type ActionProps } from './components/action/mod.ts';
import { Conditional, type ConditionalProps } from './components/conditional/mod.ts';
import { Deferred, type DeferredProps } from './components/deferred/mod.ts';
import { Display, type DisplayProps } from './components/display/mod.ts';
import { Each, type EachProps } from './components/each/mod.ts';
import { Form, type FormProps } from './components/form/mod.ts';
import { Query, type QueryProps } from './components/query/mod.ts';
import { State, type StateProps } from './components/state/mod.ts';
import type {
  Element,
  HttpClient,
  HttpRequest,
  HttpRequestInit,
  HttpResponse,
  Primitive,
} from './types.ts';

// types
export type {
  Element,
  HttpClient,
  HttpRequest,
  HttpRequestInit,
  HttpResponse,
  Primitive,
  ActionProps,
  ConditionalProps,
  DeferredProps,
  DisplayProps,
  EachProps,
  FormProps,
  QueryProps,
  StateProps,
};

// contexts
export { BehaviorContext } from './context/behavior.ts';
export { FormContext } from './context/form.ts';

// control components
export { BehaviorProvider } from './components/behavior-provider/mod.ts';
export { BehaviorRenderer } from './components/behavior-renderer/mod.ts';

// components
export { Action, Conditional, Deferred, Each, Form, Query, Display, State };

export interface CoreComponentsType {
  [key: string]: ComponentType<any> | undefined;
}

export const CoreComponents: CoreComponentsType = {
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

// hooks
export { useEvaluate } from './hooks/use-evaluate.ts';
export { useField } from './hooks/use-field.ts';

// utils
export { renderToJSON } from './utils/render-to-json.ts';
