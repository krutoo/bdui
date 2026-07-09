import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { fill } from './param.ts';

describe('fill', () => {
  test('works correctly with no initial value', () => {
    assert.deepEqual(
      //
      'hello',
      fill(undefined, [{ value: 'hello' }]),
    );

    assert.deepEqual(
      //
      { user: { age: 24 } },
      fill(undefined, [{ key: 'user.age', value: '24', type: 'int' }]),
    );

    assert.deepEqual(
      //
      { foo: 123, bar: { baz: 234.456 } },
      fill(undefined, [
        {
          key: 'foo',
          value: '123',
          type: 'int',
        },
        {
          key: 'bar.baz',
          value: '234.456',
          type: 'float',
        },
      ]),
    );
  });
});
