import { type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { BehaviorProvider, CoreComponents, type Element, type Primitive } from '@krutoo/bdui';
import { Accordion } from '#components/accordion/mod.ts';
import { App } from '#components/app/mod.ts';
import { Button } from '#components/button/mod.ts';
import { Flex } from '#components/flex/mod.ts';
import { Heading } from '#components/heading/mod.ts';
import { Input } from '#components/input/mod.ts';
import { Layout } from '#components/layout/mod.ts';
import { Link } from '#components/link/mod.ts';
import { Modal } from '#components/modal/mod.ts';
import { Option } from '#components/option/mod.ts';
import { Paragraph } from '#components/paragraph/mod.ts';
import { Select } from '#components/select/mod.ts';
import { Skeleton } from '#components/skeleton/mod.ts';
import { Table } from '#components/table/mod.ts';
import { Text } from '#components/text/mod.ts';
import { Widget } from '#components/widget/mod.ts';
import './index.css';

const components: Record<string, ComponentType<any> | undefined> = {
  // core:
  ...CoreComponents,

  // custom ui:
  [Layout.displayName]: Layout,
  [Layout.Main.displayName]: Layout.Main,
  [Layout.Aside.displayName]: Layout.Aside,
  [Widget.displayName]: Widget,
  [Heading.displayName]: Heading,
  [Text.displayName]: Text,
  [Link.displayName]: Link,
  [Paragraph.displayName]: Paragraph,
  [Button.displayName]: Button,
  [Input.displayName]: Input,
  [Select.displayName]: Select,
  [Option.displayName]: Option,
  [Modal.displayName]: Modal,
  [Skeleton.displayName]: Skeleton,
  [Accordion.displayName]: Accordion,
  [Accordion.Summary.displayName]: Accordion.Summary,
  [Accordion.Content.displayName]: Accordion.Content,
  [Table.displayName]: Table,
  [Table.Head.displayName]: Table.Head,
  [Table.Body.displayName]: Table.Body,
  [Table.Row.displayName]: Table.Row,
  [Table.Cell.displayName]: Table.Cell,
  [Flex.displayName]: Flex,
};

createRoot(document.querySelector('#root')!).render(
  <BehaviorProvider
    components={components}
    http={{
      retrieveReplacers: res =>
        res.json().then(data =>
          (data as any)?.ui?.replacers
            ? Object.entries((data as any).ui.replacers).map(entry => ({
                elementId: entry[0],
                tree: entry[1] as Element | Primitive,
              }))
            : [],
        ),
    }}
  >
    <App />
  </BehaviorProvider>,
);
