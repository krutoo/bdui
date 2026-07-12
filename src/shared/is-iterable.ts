type PossiblyIterable = Partial<Iterable<unknown>>;

/** */
export function isIterable(value: unknown): value is Iterable<unknown> {
  return (
    value !== null &&
    value !== undefined &&
    typeof (value as PossiblyIterable)[Symbol.iterator] === 'function'
  );
}
