import initCommand from '@foscia/cli/commands/initCommand';
import integrateCommand from '@foscia/cli/commands/integrateCommand';
import makeCommand from '@foscia/cli/commands/makeCommand';
import makeCommander from '@foscia/cli/utils/cli/makeCommander';
import makeUsageExamples from '@foscia/cli/utils/cli/makeUsageExamples';
import output from '@foscia/cli/utils/cli/output';
import { getVersion, resolveVersion } from '@foscia/cli/utils/context/version';
import CLIError from '@foscia/cli/utils/errors/cliError';
import process from 'node:process';
import pc from 'picocolors';
import terminalLink from 'terminal-link';

export default async function kernel(argv: string[]) {
  await resolveVersion();

  const readDocs = terminalLink('Documentation on foscia.dev', 'https://foscia.dev', {
    fallback: () => 'Documentation: https://foscia.dev',
  });
  const openIssue = terminalLink('Open an issue on GitHub', 'https://github.com/foscia-dev/foscia/issues/new/choose', {
    fallback: () => 'Open an issue: https://github.com/foscia-dev/foscia/issues/new/choose',
  });

  try {
    await makeCommander('foscia')
      .version(getVersion(), undefined, 'Output the version number')
      .addHelpText('beforeAll', pc.bold(pc.magenta(`Foscia v${getVersion()}`)))
      .addHelpText('afterAll', `\nHelp:\n  ${readDocs}\n  ${openIssue}\n`)
      .addHelpText('after', makeUsageExamples([
        ['Initializes Foscia in your project', pc.bold('init')],
        ['Creates a "Post" model', `${pc.bold('make model')} post`],
      ]))
      .addCommand(initCommand())
      .addCommand(makeCommand())
      .addCommand(integrateCommand())
      .parseAsync(argv);
  } catch (error) {
    if (error instanceof Error) {
      // FIXME: this should use an error instanceof.
      if (error.message.startsWith('User force closed the prompt')) {
        output.error('operation stopped, bye!');
        process.exit(1);
      }

      if (error instanceof CLIError) {
        output.error(`error: ${error.message}${error.instruction ? '' : '\n'}`);
        if (error.instruction) {
          output.instruct(error.instruction);
        }

        process.exit(1);
      }
    }

    output.error(`error: ${error}\n`);
    process.exit(1);
  }
}
