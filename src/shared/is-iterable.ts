type PossiblyIterable = Partial<Iterable<unknown>>;

/**
 * Checks that value is iterable (string, array, map, set etc).
 * @param value Value to check.
 * @returns True if value is iterable, false otherwise.
 */
export function isIterable(value: unknown): value is Iterable<unknown> {
  return (
    value !== null &&
    value !== undefined &&
    typeof (value as PossiblyIterable)[Symbol.iterator] === 'function'
  );
}
