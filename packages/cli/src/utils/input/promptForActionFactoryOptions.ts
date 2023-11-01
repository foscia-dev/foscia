import { renderModelsDefinition } from '@foscia/cli/templates/renderActionFactory';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { input, select } from '@inquirer/prompts';
import boxen from 'boxen';
import { highlight } from 'cli-highlight';

export type ActionFactoryOptions = {
  config: { [k: string]: unknown };
  automaticRegistration?: 'import.meta.glob';
};

export default async function promptForActionFactoryOptions(config: CLIConfig, usage: CLIConfig['usage']) {
  const options: ActionFactoryOptions = { config: {} };

  if (usage === 'http' || usage === 'jsonapi' || usage === 'jsonrest') {
    options.config.baseURL = await input({
      message: usage === 'http'
        ? 'What is the base URL of your HTTP target server?'
        : 'What is the base URL of your API?',
      default: {
        jsonapi: '/api/v1',
        jsonrest: '/api',
        http: '/',
      }[usage],
    });
  }

  if (usage === 'jsonapi' || usage === 'jsonrest') {
    const automaticRegistrationDescription = (
      automaticRegistration?: ActionFactoryOptions['automaticRegistration'],
    ) => {
      const registryRegisterData = {
        config, usage, options: { config: {}, automaticRegistration },
      };

      return boxen(
        highlight(renderModelsDefinition(registryRegisterData), { language: config.language }),
        { title: 'Example of registration', titleAlignment: 'center', padding: 1 },
      );
    };

    options.automaticRegistration = await select({
      message: 'Would you like to register models automatically?',
      choices: [
        {
          name: 'Using import.meta.glob (e.g. when using Vite)',
          value: 'import.meta.glob',
          disabled: config.modules !== 'esm',
          description: automaticRegistrationDescription('import.meta.glob'),
        },
        {
          name: 'No, register models manually',
          value: undefined,
          description: automaticRegistrationDescription(),
        },
      ] as const,
    });
  }

  return options;
}
