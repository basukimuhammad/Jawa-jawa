export function translate(source) {
  let code = String(source ?? '');

  // Protect strings and comments so keywords inside them are not translated.
  const protectedParts = [];
  code = code.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (part) => {
    const token = `__JAWA_PART_${protectedParts.length}__`;
    protectedParts.push(part);
    return token;
  });

  const rules = [
    [/\bliyane\s+yen\b/g, 'else if'],
    [/\byen\s+ora\b/g, 'else'],
    [/\bnalika\b/g, 'while'],
    [/\bkanggo\b/g, 'for'],
    [/\bfungsi\b/g, 'function'],
    [/\bbali\b/g, 'return'],
    [/\bmandheg\b/g, 'break'],
    [/\bterus\b/g, 'continue'],
    [/\btampilno\b/g, 'console.log'],
    [/\btetep\b/g, 'const'],
    [/\bono\b/g, 'let'],
    [/\banyar\b/g, 'new'],
    [/\bbener\b/g, 'true'],
    [/\bsalah\b/g, 'false'],
    [/\bkosong\b/g, 'null'],
    [/\blan\b/g, '&&'],
    [/\butawa\b/g, '||'],
    [/\byen\b/g, 'if'],
    [/\bora\b/g, '!']
  ];

  for (const [pattern, replacement] of rules) {
    code = code.replace(pattern, replacement);
  }

  return code.replace(/__JAWA_PART_(\d+)__/g, (_, i) => protectedParts[Number(i)]);
}
