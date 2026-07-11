import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { evaluate } from '../expression.ts';

describe('evaluate', () => {
  test('should correctly evaluate expressions', () => {
    // logic
    assert.equal(false, evaluate('true && false'));
    assert.equal(true, evaluate('true || false'));
    assert.equal(false, evaluate('!true'));
    assert.equal(true, evaluate('!false'));
    assert.equal(false, evaluate('!!false'));

    // equality
    assert.equal(true, evaluate('2 < 3'));
    assert.equal(true, evaluate('2 <= 3'));
    assert.equal(false, evaluate('10 <= 3'));
    assert.equal(false, evaluate('10 <= (3 + 2)'));
    assert.equal(true, evaluate('10 >= (3 + 2)'));
    assert.equal(true, evaluate('19 == 19'));
    assert.equal(false, evaluate('11 != 11'));

    // math
    assert.equal(5, evaluate('2 + 3'));
    assert.equal(17, evaluate('2 + 3 * 5'));
    assert.equal(25, evaluate('(2 + 3) * 5'));

    // strings
    assert.equal('jack', evaluate('"jack"'));

    // variables and functions
    assert.equal(
      144,
      evaluate('quad(age)', {
        age: 12,
        quad: (n: number) => n * n,
      }),
    );
  });
});
