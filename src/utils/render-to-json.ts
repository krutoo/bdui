import { Fragment, type ReactNode } from 'react';
import { isObject } from '@krutoo/utils';
import type { Element, Primitive } from '#types/dto';
import { isIterable } from '../shared/is-iterable.ts';

/**
 * Renders React-tree to Element.
 * For `type`, `displayName` or `name` of component will be used.
 * @param node `ReactNode`.
 * @returns Element or primitive.
 */
export function renderToJSON(node: ReactNode): Element | Primitive {
  if (isObject(node)) {
    // check iterable objects
    if (isIterable(node)) {
      return {
        type: 'Fragment',
        children: [...node].map(renderToJSON),
      };
    }

    // check promises
    if ('then' in node) {
      return null;
    }

    const { children, ...props } = (node.props || {}) as { children?: ReactNode };

    const result: Element = {
      type:
        node.type === Fragment
          ? 'Fragment'
          : typeof node.type === 'function'
            ? (node.type as { displayName?: string }).displayName || node.type.name
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
