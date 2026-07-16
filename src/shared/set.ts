/**
 * Splits key to path array.
 * @param key Key.
 * @returns Parts array.
 */
export function keyToPath(key: string): null | string[] {
  return key.match(/[a-zA-Z_$][a-zA-Z0-9_$]*|\[\d+\]/g);
}

/**
 * Checks that key part is in array notation.
 * @param key Key.
 * @returns True if key is in array notation, false otherwise.
 */
export function isArrayNotationKey(key: string): boolean {
  return key[0] === '[' && key[key.length - 1] === ']';
}

/**
 * Parses index from key in array key notation.
 * @param key Key.
 * @returns Index.
 */
export function indexFromArrayKey(key: string): number {
  return parseInt(key.slice(1, -1), 10);
}

/**
 * Sets the value at path of object. If a portion of path doesn't exist, it's created. Arrays are created for missing index properties while objects are created for all other missing properties.
 * @param target Target to set in.
 * @param path Path to set.
 * @param value Value to set.
 * @returns Target object or new created object if target is nullish.
 */
export function set<T, V>(target: T, path: string, value: V): T {
  let result: T = target;
  const pathArray = keyToPath(path);

  if (!result) {
    const firstKey = pathArray?.[0];

    result = (firstKey && isArrayNotationKey(firstKey) ? [] : {}) as T;
  }

  if (!pathArray) {
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = result;

  for (let i = 0; i < pathArray.length - 1; i++) {
    let item: string | number = pathArray[i]!;

    if (isArrayNotationKey(item)) {
      item = indexFromArrayKey(item);
    }

    const nextItem = pathArray[i + 1]!;
    const isNextKeyArray = isArrayNotationKey(nextItem);

    if (current[item] === undefined) {
      current[item] = isNextKeyArray ? [] : {};
    }

    current = current[item];
  }

  let lastItem: string | number = pathArray[pathArray.length - 1]!;

  if (isArrayNotationKey(lastItem)) {
    lastItem = indexFromArrayKey(lastItem);
  }

  current[lastItem] = value;

  return result;
}
