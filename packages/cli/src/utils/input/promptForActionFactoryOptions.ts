import { renderModelsRegistration } from '@foscia/cli/templates/renderActionFactory';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import { input, select } from '@inquirer/prompts';
import boxen from 'boxen';
import { highlight } from 'cli-highlight';

export type ActionFactoryDependency = {
  name: string;
  options?: { [K: string]: unknown };
};

export type ActionFactoryModelRegistration = 'import.meta.glob' | 'require.context' | 'array';

export type ActionFactoryOptions = {
  cache?: boolean;
  registry?: ActionFactoryModelRegistration;
  deserializer?: ActionFactoryDependency;
  serializer?: ActionFactoryDependency;
  adapter?: ActionFactoryDependency;
};

async function promptForHttpAdapterConfig(usage: CLIConfig['usage']) {
  const defaultBaseURL = {
    jsonapi: '/api/v1',
    jsonrest: '/api',
    http: '/',
  }[usage];
  const baseURL = await input({
    message: usage === 'http'
      ? 'What is the base URL of your HTTP target server?'
      : 'What is the base URL of your API?',
    default: defaultBaseURL,
  });

  return { baseURL };
}

async function promptForRegistry(
  config: CLIConfig,
  imports: ImportsList,
) {
  const automaticRegistrationDescription = (
    registry: ActionFactoryModelRegistration,
  ) => boxen(
    highlight(renderModelsRegistration({ config, registry }), { language: config.language }),
    { title: 'Registration code', titleAlignment: 'center', padding: 1 },
  );

  const registry = await select({
    message: 'Would you like to register models?',
    choices: [
      {
        name: 'No.',
        value: undefined,
        description: 'Registering models is optional if your models relations do not contains circular references.',
      },
      {
        name: 'Using import.meta.glob (when using Vite)',
        value: 'import.meta.glob',
        disabled: config.modules !== 'esm',
        description: automaticRegistrationDescription('import.meta.glob'),
      },
      {
        name: 'Using require.context (when using Webpack)',
        value: 'require.context',
        description: automaticRegistrationDescription('require.context'),
      },
      {
        name: 'Using manually imported models',
        value: 'array',
        description: automaticRegistrationDescription('array'),
      },
    ] as const,
  });
  if (registry) {
    imports.add('makeRegistry', '@foscia/core');

    if (config.language === 'ts' && (
      registry === 'import.meta.glob' || registry === 'require.context'
    )) {
      imports.add('Model', '@foscia/core');
    }
  }

  return registry;
}

export default async function promptForActionFactoryOptions(
  config: CLIConfig,
  imports: ImportsList,
  usage: CLIConfig['usage'],
) {
  // TODO Support testable action factories.
  imports.add('makeActionFactory', '@foscia/core');

  if (usage === 'http') {
    imports.add('makeHttpAdapter', '@foscia/http');

    return {
      adapter: {
        name: 'makeHttpAdapter',
        options: await promptForHttpAdapterConfig(usage),
      },
    };
  }

  if (usage === 'jsonapi') {
    imports.add('makeCache', '@foscia/core');
    imports.add('makeJsonApiDeserializer', '@foscia/jsonapi');
    imports.add('makeJsonApiSerializer', '@foscia/jsonapi');
    imports.add('makeJsonApiAdapter', '@foscia/jsonapi');

    return {
      cache: true,
      registry: await promptForRegistry(config, imports),
      deserializer: { name: 'makeJsonApiDeserializer' },
      serializer: { name: 'makeJsonApiSerializer' },
      adapter: {
        name: 'makeJsonApiAdapter',
        options: await promptForHttpAdapterConfig(usage),
      },
    };
  }

  if (usage === 'jsonrest') {
    imports.add('makeCache', '@foscia/core');
    imports.add('makeJsonRestDeserializer', '@foscia/rest');
    imports.add('makeJsonRestSerializer', '@foscia/rest');
    imports.add('makeJsonRestAdapter', '@foscia/rest');

    return {
      cache: true,
      registry: await promptForRegistry(config, imports),
      deserializer: { name: 'makeJsonRestDeserializer' },
      serializer: { name: 'makeJsonRestSerializer' },
      adapter: {
        name: 'makeJsonRestAdapter',
        options: await promptForHttpAdapterConfig(usage),
      },
    };
  }

  throw new Error('invalid usage given');
}
