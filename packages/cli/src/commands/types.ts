import { CommandModule } from 'yargs';

export type CommonCommandOptions = {
  config: string;
};

export type Command<O extends {} = {}> = {
  name: string;
} & CommandModule<CommonCommandOptions, CommonCommandOptions & O>;
