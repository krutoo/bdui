import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { unset } from '../unset.ts';

describe('unset', () => {
  test('should remove value correctly', () => {
    const user = {
      id: 234,
      settings: [
        {
          name: 'theme',
          value: 'dark',
        },
        {
          name: 'layout',
          value: 'mobile',
        },
      ],
    };

    const userExpected = {
      id: 234,
      settings: [
        {
          name: 'theme',
          value: 'dark',
        },
      ],
    };

    const userReturned = unset(user, 'settings[1]');

    assert.equal(user, userReturned);
    assert.deepEqual(user, userExpected);
  });
});
