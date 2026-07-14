# Backend-Driven UI SDK

SDK for rendering Backend-driven UI by declarative JSON-tree of elements.

Currently only React, Preact and React Native is supported for frontend.

## Usage

Installation:

```sh
# coming soon
npm add @krutoo/bdui
```

First of all you need to prepare you frontend:

```tsx
import { createRoot } from 'react-dom/client';
import { BehaviorProvider, CoreComponents } from '@krutoo/bdui';
import { App, Button, TextField, Typography } from '#components';

const components = {
  // core components:
  ...CoreComponents,

  // your custom components:
  Button,
  TextField,
  Typography,
};

createRoot(document.querySelector('#root')).render(
  // you need to wrap application to provider
  <BehaviorProvider components={components}>
    <App />
  </BehaviorProvider>,
);
```

Now anywhere inside provider you can use `BehaviorRenderer` to render BDUI trees:

```tsx
// components/app.tsx
import { BehaviorRenderer } from '@krutoo/bdui';
import { useFetch } from '#shared/react-fetch';

export function App() {
  const { data } = useFetch('/api/bdui/page');

  if (!data) {
    return <>Loading...</>;
  }

  return <BehaviorRenderer tree={data} />;
}
```

To make it work, your backend should return **element tree**, for example like this:

```json
{
  "type": "Fragment",
  "children": [
    {
      "type": "Heading",
      "props": { "level": "2" },
      "children": ["Some document"]
    },
    {
      "type": "Button",
      "props": { "action": "open", "actionTarget": "my_modal" },
      "children": ["Show modal"]
    },
    {
      "type": "Modal",
      "props": { "id": "my_modal" },
      "children": [
        {
          "type": "Heading",
          "props": { "level": "3" },
          "children": ["This is modal"]
        },
        {
          "type": "Button",
          "props": { "action": "close", "actionTarget": "my_modal" },
          "children": ["Got it"]
        }
      ]
    }
  ]
}
```

Yes, it looks **almost** exactly like Virtual DOM tree from React/Preact. But this is JSON, so there is no functions or any other JS values that cannot be serialized.

All elements implements basic `Element` interface:

```ts
type Primitive = string | number | boolean | null;

interface Element {
  // type can be any string
  type: string;

  // props is optional and can contain any object
  props?: object;

  // children is optional array and can contain element or primitive
  children?: Array<Element | Primitive>;
}
```

## Core components

Core components includes some useful entities that allows you to declare dynamic UI with complex logic.
Here is overview.

### `Action`

`Action` is element for attach some simple interaction to identifier and use it later.

To explain how to use actions, lets define some custom components to see how it works. For example lets create `Button` and `Modal`, using SDK for React.

Start from `Button`:

```tsx
import { BehaviorContext } from '@krutoo/bdui';

export function Button({ children, onClick }) {
  const { elements } = useContext(BehaviorContext);

  const handleClick = () => {
    // here we trying to find action in element registry
    const actionElement = elements.get(onClick);

    // action element has `run` action, so we trying to call it
    actionElement?.actions.run?.();
  };

  return <button onClick={handleClick}>{children}</button>;
}
```

Now declare our `Modal` component:

```tsx
function Modal({ id, children }) {
  const { elements } = useContext(BehaviorContext);

  // we need to define subscribable store of our element
  const store = useMemo(() => createStore({ open: false }), []);
  const state = useSyncExternalStore(store.subscribe, store.get);

  useEffect(() => {
    // register each modal in elements registry
    elements.set(id, {
      id,
      type: 'Modal',
      store,
      actions: {
        // we should define available actions here
        open: () => store.set({ open: true }),
        close: () => store.set({ open: false }),
      },
    });

    return () => {
      registry.delete(id);
    };
  }, [id, store, elements]);

  if (!state.open) {
    return null;
  }

  return <div className='modal'>{children}</div>;
}
```

Now we can declare **action to open modal** and button that will run this action:

```tsx
function App() {
  return (
    <>
      <Button onClick='open_modal'>Show modal</Button>

      <Action id='open_modal' type='open' target='my_modal' />

      <Modal id='my_modal'>Hello from Modal!</Modal>
    </>
  );
}
```

As you can see, button receives string in `onClick` prop. This string is an identifier and button tries to find element with this id in registry and then call `run` method on found element. This element is our action.

Action always has a `run` method so next it does almost same operation under the hood and calls `open` method on found modal element. So it works and modal opened!

Note that it is just an example and for simplicity you can rewrite `Button` for declaring action type and action target directly in `Button` props.

WIP docs about `Action.Sequence`

### `Condition`

`Condition` component lets you render some markup only if _expression_ passed to `if` prop is truthy:

```tsx
import { Condition } from '@krutoo/bdui';
import { Typography } from '#components';

const markup = (
  <Condition if='{{ valueOf("comment").length >= 120 }}'>
    <Typography intent='danger'>Comment is too large</Typography>
  </Condition>
);
```

Here is what features supported in expressions:

- Logical operators: `&&`, `||`, `!`, `(...)`;
- Math operators: `==`, `!=`, `>`, `<`, `>=`, `<=`;
- Literals for boolean, numbers and strings;
- JS compatible variable names;
- JS function call syntax (like `hello()` and `foobar(123, "string")`);
- JS property access syntax (dots and brackets like `user.settings[1]`).

Also there is some builtin functions:

- WIP docs about builtin functions and `ExpressionContext`

### `Defer`

`Defer` allows you to declare tree part that should be fetched after mount. It will render children until response is done. Think about `Defer` as an `img` but instead image file it will load and render markup.

```tsx
import { Defer } from '@krutoo/bdui';
import { Skeleton } from '#components';

const markup = (
  <Defer resource='/api/bdui/some-widget'>
    <Skeleton />
  </Defer>
);
```

It runs HTTP requests and trying to get BDUI structures from response. You can control how to get BDUI from responses by `http.retrieveReplacers` option of provider.

Supported `Defer` actions:

- `invalidate` - triggers refetch.

### `Form`

`Form` works almost like html forms but sends values from fields as JSON:

```tsx
import { Form } from '@krutoo/bdui';
import { Button, TextField } from '#components';

const markup = (
  <Form resource='/api/comments' method='POST'>
    <TextField name='comment' placeholder='Say something...' />
    <Button>Submit</Button>
  </Form>
);
```

Supported `Form` actions:

- `submit` - triggers form submit.

Core components not include any fields but you can declare your custom field component using `useField` hook.

### `Display`

`Display` just allows you to render result of some expression (if possible):

```tsx
import { Display } from '@krutoo/bdui';

const markup = (
  <>
    <Display of='{{ concat("Your score is ", timeSpent * 1.125, " points") }}' />
  </>
);
```

Next you will see when it can be useful.

### `Query`

`Query` allows you to declarative fetch any JSON after mount. With `Display` you can render data from query.

```tsx
import { Display, Query } from '@krutoo/bdui';
import { Heading, Spinner } from '#components';

const markup = (
  <>
    <Query id='profile_query' resource='/api/user/profile' />

    <Condition if='{{ isPending("profile_query") }}'>
      <Spinner />
    </Condition>

    <Heading>
      <Display of='{{ dataOf("profile_query").user_nickname }}' />
    </Heading>
  </>
);
```

Supported `Query` actions:

- `invalidate` - triggers refetch.

### `Each`

`Each` allows you to render markup for each item of array. For example if your query returns array you can render markup for each item:

```tsx
import { Display, Each, Query } from '@krutoo/bdui';
import { Heading, Image, Typography } from '#components';

const markup = (
  <>
    <Query id='posts_query' resource='/api/posts' />

    <Each of='{{ dataOf("posts_query") }}' as='$post' indexAs='$index'>
      <Image src='{{ $post.image_url }}' />

      <Heading>
        <Display of='{{ concat("Post №", $index + 1) }}' />
      </Heading>

      <Typography>
        <Display of='{{ $post.summary }}' />
      </Typography>
    </Each>
  </>
);
```

### `State`

`State` allows you to just store any JSON-value.
It renders nothing but you can render value from it by `Display` and also use it in expressions.

To define initial state you need to use _param definition_ list.

You also can change state by `State.Insertion` and `State.Removal` actions.

```tsx
import { Display, State } from '@krutoo/bdui';
import { Button, Heading } from '#components';

const markup = (
  <>
    <State id='counter' init={[{ key: 'count', type: 'int', value: '0' }]} />

    <Heading>
      <Display of='{{ stateOf("counter").count }}' />
    </Heading>

    <State.Insertion
      id='counter_inc'
      value={[{ key: 'count', type: 'int', value: '{{ stateOf("counter").count + 1 }}' }]}
    />

    <Button onClick='counter_inc'>Add</Button>
  </>
);
```

## Q&A

### My OpenAPI linter is too strict for trees like this, how to be?

WIP docs about _mediator-objects_

WIP docs about normalizing tree from response

WIP docs about avoiding primitives in `children`
