import { indexFromArrayKey, isArrayNotationKey, keyToPath } from './set.ts';

/**
 * Removes value from object/array. Mutates given object.
 * @param target Target value to remove from.
 * @param path Path.
 * @returns Target value.
 */
export function unset<T>(target: T, path: string): T {
  if (!target) {
    return target;
  }

  const pathArray = keyToPath(path);

  if (!pathArray) {
    return target;
  }

  let current: any = target;

  for (let i = 0; i < pathArray?.length - 1; i++) {
    const key = pathArray[i]!;

    current = isArrayNotationKey(key) ? current[parseInt(key.slice(1, -1))] : current[key];
  }

  const lastKey = pathArray[pathArray.length - 1]!;

  if (isArrayNotationKey(lastKey) && Array.isArray(current)) {
    current.splice(indexFromArrayKey(lastKey), 1);
  } else {
    delete current[lastKey];
  }

  return target;
}
