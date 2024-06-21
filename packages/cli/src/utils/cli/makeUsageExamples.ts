import { symbols } from '@foscia/cli/utils/cli/output';
import c from 'ansi-colors';

export default function makeUsageExamples(
  examples: string[][],
) {
  return `\nExamples:\n${examples.map(
    ([description, command, ...options]) => `  ${c.bold(`foscia ${command}`)} ${options.join(' ')}\n  ${symbols.step} ${c.dim(description)}`,
  ).join('\n')}`;
}
