const COMPARISON_OPERATORS = ['==', '!=', '>', '<', '>=', '<='];

/**
 * Evaluates expression.
 *
 * Supported features:
 * - logical operators: &&, ||, !, ();
 * - math operators: ==, !=, >, <, >=, <=;
 * - js compatible variable names;
 * - js function call syntax;
 * - js property access syntax (dots and brackets).
 *
 * @param expression Expression string.
 * @param context Context object including all available variables/functions.
 * @returns Evaluation result.
 *
 * @example
 * ```js
 * const result = evaluate('user.role || stubRole()', {
 *   user: { role: null },
 *   stubRole: () => 'guest',
 * });
 *
 * console.log(result); // 'guest'
 * ```
 */
export function evaluate(expression: string, context: Record<string, any> = {}): any {
  const tokens = tokenize(expression);
  let index = 0;

  const peek = () => tokens[index];
  const consume = () => tokens[index++];

  // 1. Логическое ИЛИ (||)
  const parseOr = (): any => {
    let result = parseAnd();

    while (peek() === '||') {
      consume();

      result = result || parseAnd();
    }

    return result;
  };

  // 2. Логическое И (&&)
  const parseAnd = (): any => {
    let result = parseComparison();

    while (peek() === '&&') {
      consume();

      result = result && parseComparison();
    }

    return result;
  };

  // 3. Сравнение (==, !=, >, <, >=, <=)
  const parseComparison = (): any => {
    let result = parseSum();

    while (COMPARISON_OPERATORS.includes(peek()!)) {
      const op = consume();
      const right = parseSum();

      if (op === '==') {
        result = result === right;
      } else if (op === '!=') {
        result = result !== right;
      } else if (op === '>') {
        result = result > right;
      } else if (op === '<') {
        result = result < right;
      } else if (op === '>=') {
        result = result >= right;
      } else if (op === '<=') {
        result = result <= right;
      }
    }

    return result;
  };

  // 4. Математика: Сложение и Вычитание (+, -)
  const parseSum = (): any => {
    let result = parseProduct();

    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseProduct();

      if (op === '+') {
        result = result + right;
      }
      if (op === '-') {
        result = result - right;
      }
    }

    return result;
  };

  // 5. Математика: Умножение и Деление (*, /)
  const parseProduct = (): any => {
    let result = parsePrimary();

    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parsePrimary();

      if (op === '*') {
        result = result * right;
      }
      if (op === '/') {
        result = result / right;
      }
    }

    return result;
  };

  // Вспомогательная функция для парсинга аргументов корневой функции
  const parseArguments = (): any => {
    consume(); // Пропускаем '('

    const args = [];

    if (peek() !== ')') {
      args.push(parseOr());

      while (peek() === ',') {
        consume(); // Пропускаем ','
        args.push(parseOr());
      }
    }

    consume(); // Пропускаем ')'

    return args;
  };

  // 6. Базовые элементы
  const parsePrimary = (): any => {
    const token = peek();

    if (!token) {
      throw new Error('Неожиданный конец выражения');
    }

    if (token === '!') {
      consume();

      return !parsePrimary();
    }

    if (token === '(') {
      consume();

      const result = parseOr();

      consume();

      return result;
    }

    if (token.startsWith('"') && token.endsWith('"')) {
      consume();

      return token.slice(1, -1);
    }

    if (/^\d+(?:\.\d+)?$/.test(token)) {
      consume();

      return Number(token);
    }

    if (token === 'true') {
      consume();

      return true;
    }
    if (token === 'false') {
      consume();

      return false;
    }

    // Обработка идентификаторов (Функции и свойства объектов)
    if (/^[a-zA-Z_$]\w*$/.test(token)) {
      consume(); // Забираем имя корневого элемента

      let currentResult;

      // Ситуация А: Это вызов корневой функции (следом идет скобка)
      if (peek() === '(') {
        const args = parseArguments();
        const fn = context[token];

        if (typeof fn !== 'function') {
          throw new Error(`Функция ${token} не найдена`);
        }

        currentResult = fn(...args);
      }

      // Ситуация Б: Это обычная переменная или объект
      else {
        if (!(token in context)) {
          throw new Error(`Переменная ${token} не найдена`);
        }

        currentResult = context[token];
      }

      // После получения стартового значения (из функции или переменной)
      // мы можем читать его свойства через точку, если они есть
      while (peek() === '.') {
        consume(); // Пропускаем '.'
        const property = consume()!; // Забираем имя свойства

        if (!/^[a-zA-Z_]\w*$/.test(property)) {
          throw new Error(`Невалидное имя свойства: ${property}`);
        }

        if (currentResult === null || currentResult === undefined) {
          throw new Error(`Невозможно прочитать свойство ${property} у null/undefined`);
        }

        currentResult = currentResult[property];
      }

      return currentResult;
    }

    throw new Error(`Неожиданный токен: ${token}`);
  };

  return parseOr();
}

/**
 * Expression tokenizer.
 * @param expression Expression string.
 * @returns Token array.
 */
function tokenize(expression: string): string[] {
  const regex =
    /"[^"\\]*(\\.[^"\\]*)*"|\d+(?:\.\d+)?|&&|\|\||==|!=|>=|<=|[!(),><+\-*/.]|[a-zA-Z_$]\w*/g;

  return expression.match(regex) || [];
}
