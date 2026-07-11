import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { set } from '../set.ts';

describe('set', () => {
  test('should create object correctly', () => {
    // root object
    assert.deepEqual({ foo: 'bar' }, set(undefined, 'foo', 'bar'));
    assert.deepEqual({ foo: { bar: 'baz' } }, set(undefined, 'foo.bar', 'baz'));
    assert.deepEqual({ foo: { bar: ['baz'] } }, set(undefined, 'foo.bar[0]', 'baz'));

    // root array
    assert.deepEqual([{ role: 'guest' }], set(undefined, '[0].role', 'guest'));
    assert.deepEqual([{ profile: { id: 123 } }], set(undefined, '[0].profile.id', 123));
  });

  test('should mutate object correctly', () => {
    const user = {
      id: 123,
      settings: [{ name: 'theme', value: 'dark' }],
    };

    const userExpected = {
      id: 123,
      settings: [{ name: 'theme', value: 'light' }],
    };

    const userReturned = set(user, 'settings[0].value', 'light');

    assert.equal(user, userReturned);
    assert.deepEqual(user, userExpected);
  });
});
