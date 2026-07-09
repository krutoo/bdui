/**
 * Checks that given value is primitive.
 * @param value Value.
 * @returns True if value is primitive, false otherwise.
 */
export function isPrimitive(
  value: unknown,
): value is boolean | number | string | bigint | symbol | null | undefined {
  return value !== Object(value);
}
