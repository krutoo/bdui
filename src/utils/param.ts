import { set } from '#shared/set';
import type { ParamDefinition, ParamType } from '#types/dto';

export const parsers: Record<ParamType, (value: unknown) => any> = {
  int: value => parseInt(String(value), 10),
  float: value => parseFloat(String(value)),
  bool: value => value === 'true' || value === true,
  string: value => String(value),
  null: () => null,
};

/**
 * Fills given value according to param definition list. Mutates value.
 * @param value Value to fill.
 * @param params Param definition list.
 * @returns Given value.
 */
export function fill<T>(value: T, params: ParamDefinition[]): T {
  let result = value;

  for (let i = 0; i < params.length; i++) {
    const param = params[i]!;

    if (i === 0 && !param.key) {
      result = parsers[param.type ?? 'string']?.(param.value);
    } else if (param.key) {
      result = set(result, param.key, parsers[param.type ?? 'string']?.(param.value));
    }
  }

  return result;
}
