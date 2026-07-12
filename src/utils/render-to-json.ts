import { Fragment, type ReactElement, type ReactNode } from 'react';
import type { Element, Primitive } from '#types/dto';

/**
 * Renders React-tree to Element.
 * @param node React-node.
 * @returns Element or primitive.
 */
export function renderToJSON(node: ReactNode): Element | Primitive {
  if (typeof node === 'object' && node !== null) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    const { children, ...props } = element.props;

    const result: Element = {
      type:
        element.type === Fragment
          ? 'Fragment'
          : typeof element.type === 'function'
            ? (element.type as { displayName?: string }).displayName || element.type.name
            : 'unknown',
    };

    if (Object.keys(props).length > 0) {
      // @todo пропускать не-JSON значения но проверять toJSON либо добавить опцию для кастомизации
      result.props = props;
    }

    if (children) {
      result.children = Array.isArray(children)
        ? children.map(renderToJSON)
        : [renderToJSON(children)];
    }

    return result;
  }

  if (typeof node === 'bigint') {
    return String(node);
  }

  return node || null;
}
