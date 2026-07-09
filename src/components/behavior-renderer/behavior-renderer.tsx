import { type FC, useMemo } from 'react';
import type { BehaviorRendererProps } from './types.ts';
import { toReactNode } from './utils.tsx';

/**
 * Renders given BDUI-tree.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const BehaviorRenderer: FC<BehaviorRendererProps> = ({ components, tree }) => {
  return useMemo(() => toReactNode(components, tree), [components, tree]);
};
