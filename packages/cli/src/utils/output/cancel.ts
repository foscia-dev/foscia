import logSymbols from '@foscia/cli/utils/output/logSymbols';
import process from 'node:process';

export default function cancel(message?: string): never {
  console.info(`${logSymbols.info} ${message ?? 'Operation cancelled.'}`);
  process.exit(0);
}
