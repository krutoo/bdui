import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { isIterable } from '../is-iterable.ts';

describe('isIterable', () => {
  test('should create object correctly', () => {
    assert.equal(true, isIterable('...'));
    assert.equal(true, isIterable([]));
    assert.equal(true, isIterable((function* () {})()));

    assert.equal(false, isIterable(null));
    assert.equal(false, isIterable(undefined));
    assert.equal(false, isIterable({}));
    assert.equal(
      false,
      isIterable(() => {}),
    );
  });
});
