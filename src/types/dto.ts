export type Primitive = string | number | boolean | null;

export interface Element<T extends string = string, P extends object = object> {
  type: T;
  props?: P;
  children?: Array<Element | Primitive>;
}

export type ParamType = 'int' | 'float' | 'bool' | 'string' | 'null';

export interface ParamDefinition {
  key?: string;
  type?: ParamType;
  value: string | null;
}
