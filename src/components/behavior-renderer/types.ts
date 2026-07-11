import type { ComponentType } from 'react';
import type { Element, Primitive } from '#types/dto';

export interface BehaviorRendererProps {
  components: Record<string, ComponentType | undefined>;
  tree: Element | Primitive;
}
