import { Command, Help, HelpConfiguration } from 'commander';
import pc from 'picocolors';

const defaultHelp = new Help();

const flattenCommands = (cmd: Command): Command[] => (
  cmd.parent ? [...flattenCommands(cmd.parent), cmd] : [cmd]
);

const formatCommandFullTitle = (cmd: Command, program: boolean) => {
  if (cmd.name() === 'help') {
    return 'help';
  }

  const names = flattenCommands(cmd).map((c) => c.name());
  if (!program) {
    names.shift();
  }

  return names.join(' ');
};

const formatHelp = (value: string, transformer: (value: string) => string) => (
  value ? transformer(value) : value
);

export default {
  commandUsage: (cmd) => `${pc.bold(formatCommandFullTitle(cmd, true))} ${cmd.usage()}`,
  commandDescription: (cmd) => formatHelp(defaultHelp.commandDescription(cmd), pc.dim),
  subcommandTerm: (cmd) => formatCommandFullTitle(cmd, false),
  subcommandDescription: (cmd) => formatHelp(defaultHelp.subcommandDescription(cmd), pc.dim),
  argumentDescription: (arg) => formatHelp(defaultHelp.argumentDescription(arg), pc.dim),
  optionDescription: (option) => formatHelp(defaultHelp.optionDescription(option), pc.dim),
} as HelpConfiguration;
