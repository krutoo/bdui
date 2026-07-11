import type { CoreComponent } from '#types/core';
import type { ParamDefinition } from '#types/dto';

export interface StateProps {
  id?: string;
  init?: ParamDefinition[];
}

export interface StateRemovalProps {
  id?: string;
  target?: string;
  from?: string;
}

export interface StateInsertionProps {
  id?: string;
  target?: string;
  to?: string;
  value?: ParamDefinition[];
}

export interface StateComponent extends CoreComponent<'State', StateProps> {
  Insertion: CoreComponent<'State.Insertion', StateInsertionProps>;
  Removal: CoreComponent<'State.Removal', StateRemovalProps>;
}
