import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { isObject } from '../is-object.ts';

describe('isObject', () => {
  test('should detect object correctly', () => {
    // objects
    assert.equal(true, isObject({}));
    assert.equal(true, isObject([]));
    assert.equal(
      true,
      isObject(() => {}),
    );

    // primitives
    assert.equal(false, isObject(null));
    assert.equal(false, isObject(undefined));
    assert.equal(false, isObject(true));
    assert.equal(false, isObject(false));
    assert.equal(false, isObject(123));
    assert.equal(false, isObject(123.456));
    assert.equal(false, isObject(NaN));
    assert.equal(false, isObject(Infinity));
    assert.equal(false, isObject(345n));
    assert.equal(false, isObject('Hello, world!'));
    assert.equal(false, isObject(Symbol('foobar')));
  });
});
