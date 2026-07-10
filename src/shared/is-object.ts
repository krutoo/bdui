/**
 * Checks that given value is not primitive.
 * @param value Value.
 * @returns True if value is not primitive, false otherwise.
 */
export function isObject(value: unknown): value is object {
  return value === Object(value);
}
