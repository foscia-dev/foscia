import { symbols } from '@foscia/cli/utils/cli/output';
import pc from 'picocolors';

export default function makeUsageExamples(examples: [string, string][]) {
  return `\nExamples:\n${examples.map(
    ([description, example]) => `  ${pc.bold('foscia')} ${example}\n  ${symbols.step} ${pc.dim(description)}`,
  ).join('\n')}`;
}
