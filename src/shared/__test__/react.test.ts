import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createElement } from 'react';
import { isSingleReactNode } from '../react.ts';

describe('isSingleReactNode', () => {
  test('should create object correctly', () => {
    assert.equal(true, isSingleReactNode(null));
    assert.equal(true, isSingleReactNode(undefined));
    assert.equal(true, isSingleReactNode(true));
    assert.equal(true, isSingleReactNode(false));
    assert.equal(true, isSingleReactNode(123));
    assert.equal(true, isSingleReactNode(234n));
    assert.equal(true, isSingleReactNode('Hello, world!'));
    assert.equal(true, isSingleReactNode(createElement('div')));

    // iterables
    assert.equal(false, isSingleReactNode([createElement('div')]));
  });
});
