import c from 'ansi-colors';
import { Command, Help, HelpConfiguration } from 'commander';

const defaultHelp = new Help();

const flattenCommands = (cmd: Command): Command[] => (
  cmd.parent ? [...flattenCommands(cmd.parent), cmd] : [cmd]
);

const formatCommandFullTitle = (cmd: Command, program: boolean) => {
  if (cmd.name() === 'help') {
    return 'help';
  }

  const names = flattenCommands(cmd).map((i) => i.name());
  if (!program) {
    names.shift();
  }

  return names.join(' ');
};

const formatHelp = (value: string, transformer: (value: string) => string) => (
  value ? transformer(value) : value
);

export default {
  commandUsage: (cmd) => `${c.bold(formatCommandFullTitle(cmd, true))} ${cmd.usage()}`,
  commandDescription: (cmd) => formatHelp(defaultHelp.commandDescription(cmd), c.dim),
  subcommandTerm: (cmd) => formatCommandFullTitle(cmd, false),
  subcommandDescription: (cmd) => formatHelp(defaultHelp.subcommandDescription(cmd), c.dim),
  argumentDescription: (arg) => formatHelp(defaultHelp.argumentDescription(arg), c.dim),
  optionDescription: (option) => formatHelp(defaultHelp.optionDescription(option), c.dim),
} as HelpConfiguration;
