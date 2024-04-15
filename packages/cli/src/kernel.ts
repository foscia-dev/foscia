import initCommand from '@foscia/cli/commands/initCommand';
import makeActionFactoryCommand from '@foscia/cli/commands/makeActionFactoryCommand';
import makeComposableCommand from '@foscia/cli/commands/makeComposableCommand';
import makeModelCommand from '@foscia/cli/commands/makeModelCommand';
import makeTransformerCommand from '@foscia/cli/commands/makeTransformerCommand';
import { AUTO_DETECT_CONFIG } from '@foscia/cli/utils/config/parseConfig';
import CLIError from '@foscia/cli/utils/errors/cliError';
import cancel from '@foscia/cli/utils/output/cancel';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import boxen from 'boxen';
import process from 'node:process';
import pc from 'picocolors';
import terminalLink from 'terminal-link';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

export default async function kernel(args: string[]) {
  const yargsArgs = hideBin(args);
  const yargsInstance = yargs(yargsArgs);
  const target = yargsArgs[0];
  const commands = [
    initCommand,
    makeModelCommand,
    makeComposableCommand,
    makeActionFactoryCommand,
    makeTransformerCommand,
  ];

  const headerDescription = 'Type safe, modular and intuitive API/data client for JS/TS.';
  const headerLink = terminalLink('Read the docs at foscia.dev', 'https://foscia.dev', {
    fallback: () => 'Read the docs at https://foscia.dev',
  });

  yargsInstance
    .usage([
      boxen(`${headerDescription}\n${headerLink}`, {
        title: pc.bold(pc.magenta(`${logSymbols.foscia} foscia`)),
        titleAlignment: 'center',
        textAlignment: 'center',
        borderColor: 'magenta',
        padding: 1,
      }),
      `Usage: ${pc.magenta('foscia')} ${pc.bold('<command>')} [options]`,
    ].join('\n'))
    .scriptName('')
    .fail((message, error) => {
      if (error && error.message.startsWith('User force closed the prompt')) {
        cancel();
      }

      const errorMessage = error instanceof CLIError ? error.message : message;
      const instructionMessage = error instanceof CLIError ? error.instruction : undefined;
      if (errorMessage) {
        console.error(`${logSymbols.error} ${errorMessage}`);
        if (instructionMessage) {
          console.info(`${logSymbols.instruction} ${instructionMessage}`);
        }
      } else if (error) {
        throw error;
      }

      process.exit(1);
    })
    .help()
    .describe('version', pc.dim('Show version number.'))
    .describe('help', pc.dim('Show help.'))
    .option('config', {
      alias: 'c',
      type: 'string',
      description: pc.dim('Path to configuration file.'),
      default: AUTO_DETECT_CONFIG,
      defaultDescription: 'detect automatically',
    })
    .command(commands as any[]);

  if (target === undefined) {
    yargsInstance.showHelp();
  } else if (!commands.some((c) => c.name === target) && ['--version', '--help'].indexOf(target) === -1) {
    console.error(`${logSymbols.error} Command ${target} does not exists.`);
    process.exit(1);
  }

  yargsInstance.parse();
}
