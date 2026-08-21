/**
 * Utility for parsing and evaluating mathematical expressions with fractions and PI (π).
 * Safely evaluates arithmetic expressions, fractions, and multiples of PI.
 */

// Greatest Common Divisor
export const gcd = (a: number, b: number): number => {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
};

/**
 * Finds the best fraction approximation a/b for a decimal ratio within tolerance
 */
export const approximateFraction = (val: number, maxDenominator = 360): { num: number; den: number } | null => {
  if (Math.abs(val) < 1e-7) return { num: 0, den: 1 };
  
  const sign = val < 0 ? -1 : 1;
  const target = Math.abs(val);

  for (let den = 1; den <= maxDenominator; den++) {
    const num = Math.round(target * den);
    if (Math.abs(num / den - target) < 1e-5) {
      const g = gcd(num, den);
      return { num: sign * (num / g), den: den / g };
    }
  }
  return null;
};

/**
 * Formats a radian value into a pretty simplified LaTeX string with \pi.
 * E.g. 2.356194... (3pi/4) -> "\\frac{3\\pi}{4}"
 */
export const formatRadianToPiLatex = (rad: number): string => {
  if (Math.abs(rad) < 1e-6) return '0\\text{ rad}';

  const piMultiple = rad / Math.PI;
  const frac = approximateFraction(piMultiple, 360);

  if (frac) {
    const { num, den } = frac;
    if (den === 1) {
      if (num === 1) return '\\pi\\text{ rad}';
      if (num === -1) return '-\\pi\\text{ rad}';
      return `${num}\\pi\\text{ rad}`;
    }
    if (num === 1) return `\\frac{\\pi}{${den}}\\text{ rad}`;
    if (num === -1) return `-\\frac{\\pi}{${den}}\\text{ rad}`;
    if (num < 0) return `-\\frac{${Math.abs(num)}\\pi}{${den}}\\text{ rad}`;
    return `\\frac{${num}\\pi}{${den}}\\text{ rad}`;
  }

  return `${rad.toFixed(4)}\\text{ rad}`;
};

/**
 * Formats a degree value into a simplified degree LaTeX string.
 */
export const formatDegreeToLatex = (deg: number): string => {
  const frac = approximateFraction(deg, 120);
  if (frac && frac.den !== 1) {
    return `\\frac{${frac.num}}{${frac.den}}^\\circ`;
  }
  return `${Number(deg.toFixed(2))}^\\circ`;
};

/**
 * Converts a raw user string (e.g. "3pi/4", "3*pi/2", "5/6", "135") to a pretty KaTeX string.
 */
export const inputToLatexPreview = (input: string, unit: 'deg' | 'rad'): string => {
  const cleaned = input.trim();
  if (!cleaned) return '';

  let str = cleaned
    .replace(/\\pi/gi, 'π')
    .replace(/PI/gi, 'π')
    .replace(/pi/gi, 'π');

  // If it contains a single division: e.g. "3π/4" or "5/6" or "3/4π"
  const fracMatch = str.match(/^([+-]?[\d\.\*π\s]+)\/([+-]?[\d\.\*π\s]+)$/);
  if (fracMatch) {
    let num = fracMatch[1].replace(/\*/g, ' ').trim();
    let den = fracMatch[2].replace(/\*/g, ' ').trim();
    num = num.replace(/π/g, '\\pi');
    den = den.replace(/π/g, '\\pi');
    return `\\frac{${num}}{${den}}${unit === 'deg' ? '^\\circ' : '\\text{ rad}'}`;
  }

  let display = str.replace(/π/g, '\\pi').replace(/\*/g, '\\cdot ');
  return `${display}${unit === 'deg' ? '^\\circ' : '\\text{ rad}'}`;
};

/**
 * Safe parser for mathematical expressions containing pi, fractions, +, -, *, /, decimals, parentheses.
 */
export const parseMathExpression = (raw: string): { value: number; isValid: boolean; error?: string } => {
  if (!raw || !raw.trim()) {
    return { value: 0, isValid: false, error: 'Entrada vacía' };
  }

  try {
    let sanitized = raw
      .replace(/,/g, '.')
      .replace(/\\pi/gi, 'π')
      .replace(/PI/gi, 'π')
      .replace(/pi/gi, 'π')
      .replace(/\s+/g, '');

    // Check for invalid characters
    if (/[^0-9\.\+\-\*\/\(\)\^π]/.test(sanitized)) {
      return { value: 0, isValid: false, error: 'Caracteres no válidos' };
    }

    // Replace implicit multiplications:
    // e.g., 3π -> 3 * π, π3 -> π * 3, 3(4) -> 3 * (4), (2)(3) -> (2) * (3), )π -> ) * π
    sanitized = sanitized
      .replace(/(\d+(?:\.\d+)?)(π|\()/g, '$1*$2')
      .replace(/(π|\))(\d+(?:\.\d+)?|π|\()/g, '$1*$2')
      .replace(/(π)(\()/g, '$1*$2')
      .replace(/(\))(π)/g, '$1*$2');

    // Replace π with Math.PI value placeholder
    const piVal = Math.PI.toString();
    sanitized = sanitized.replace(/π/g, `(${piVal})`);

    // Safe mathematical tokenizer and evaluator (Shunting-yard / Recursive Descent)
    const result = safeEvaluate(sanitized);

    if (isNaN(result) || !isFinite(result)) {
      return { value: 0, isValid: false, error: 'Resultado numérico no válido' };
    }

    return { value: result, isValid: true };
  } catch (err) {
    return { value: 0, isValid: false, error: 'Error de sintaxis en la expresión' };
  }
};

/**
 * Simple and secure expression evaluator using tokenizer & recursive descent.
 * Supports: +, -, *, /, unary -, parentheses, ^.
 */
function safeEvaluate(expr: string): number {
  let pos = 0;

  function peek(): string {
    return expr[pos] || '';
  }

  function get(): string {
    return expr[pos++] || '';
  }

  function parseNumber(): number {
    let start = pos;
    if (peek() === '(') {
      get(); // consume '('
      const val = parseExpression();
      if (peek() === ')') {
        get(); // consume ')'
      }
      return val;
    }

    let isNeg = false;
    if (peek() === '-') {
      isNeg = true;
      get();
    } else if (peek() === '+') {
      get();
    }

    if (peek() === '(') {
      const val = parseNumber();
      return isNeg ? -val : val;
    }

    while ((peek() >= '0' && peek() <= '9') || peek() === '.') {
      get();
    }

    const numStr = expr.substring(start, pos);
    const parsed = parseFloat(numStr);
    return isNaN(parsed) ? 0 : parsed;
  }

  function parseFactor(): number {
    let left = parseNumber();
    if (peek() === '^') {
      get();
      const right = parseFactor();
      left = Math.pow(left, right);
    }
    return left;
  }

  function parseTerm(): number {
    let left = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = get();
      const right = parseFactor();
      if (op === '*') {
        left *= right;
      } else if (op === '/') {
        if (right === 0) throw new Error('División entre cero');
        left /= right;
      }
    }
    return left;
  }

  function parseExpression(): number {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = get();
      const right = parseTerm();
      if (op === '+') {
        left += right;
      } else if (op === '-') {
        left -= right;
      }
    }
    return left;
  }

  const result = parseExpression();
  return result;
}
