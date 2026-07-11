import { type FC, useContext, useMemo } from 'react';
import { BehaviorContext } from '../../context/behavior.ts';
import type { BehaviorRendererProps } from './types.ts';
import { toReactNode } from './utils.tsx';

/**
 * Renders given BDUI-tree.
 * @param props Props.
 * @returns `ReactNode`.
 */
export const BehaviorRenderer: FC<BehaviorRendererProps> = ({ tree }) => {
  const { components } = useContext(BehaviorContext);

  return useMemo(() => toReactNode(components, tree), [components, tree]);
};
