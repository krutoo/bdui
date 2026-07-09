import { type ComponentType, type Key, type ReactNode, createElement } from 'react';
import { isExpressionNotation } from '../../hooks/use-evaluate.ts';
import type { CoreComponent, Element, Primitive } from '../../types.ts';
import { ExpressionInterceptor } from '../expression-interceptor/expression-interceptor.tsx';

/**
 * Creates valid `ReactNode` from given element.
 * @param components Component map.
 * @param element Element.
 * @param key React key.
 * @returns `ReactNode`.
 */
export function toReactNode(
  components: Record<string, ComponentType | undefined>,
  element: Element | Primitive,
  key?: Key,
): ReactNode {
  if (!element) {
    return null;
  }

  if (!(typeof element === 'object' && element !== null)) {
    if (typeof element === 'string' && /^{{.+}}$/.test(element)) {
      // @todo Заменять на `<Value of={element} />` прямо тут?
      return element;
    }

    return element;
  }

  if (!element.type) {
    return null;
  }

  // @todo Дать возможность управлять тем можно ли использовать html-теги?
  // if (element.type[0] === element.type[0]!.toLowerCase()) {
  //   return createElement(
  //     element.type,
  //     element.props,
  //     element.children?.map((item, index) => toReactNode(components, item, index)),
  //   );
  // }

  const Component = components[element.type];

  if (!Component) {
    return null;
  }

  if (
    !(Component as CoreComponent<string>).skipExpressionIntercept &&
    element.props &&
    Object.values(element.props).some(isExpressionNotation)
  ) {
    return (
      <ExpressionInterceptor
        key={key}
        component={Component}
        props={
          element.children
            ? {
                ...element.props,
                children: element.children?.map((item, index) =>
                  toReactNode(components, item, index),
                ),
              }
            : element.props
        }
      />
    );
  }

  return createElement(
    Component,
    {
      key,
      ...(element.props ?? {}),
    },
    element.children?.map((item, index) => toReactNode(components, item, index)),
  );
}
