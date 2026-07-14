import { useStableCallback } from '@krutoo/utils/react';
import type { ParamDefinition } from '#types/dto';
import { isExpressionNotation, useEvaluate } from './use-evaluate.ts';

export interface ParamEvaluator {
  <T extends ParamDefinition>(param: T): T;
}

/**
 *
 */
export function useParamEval(): ParamEvaluator {
  const evaluate = useEvaluate();

  return useStableCallback(<T extends ParamDefinition>(param: T): T => ({
    ...param,
    value: isExpressionNotation(param.value) ? String(evaluate(param.value)) : param.value,
  })) as ParamEvaluator;
}
