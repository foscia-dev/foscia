import { runMakeModelsCommand } from '@foscia/cli/commands/make/makeModelsCommand';
import { AppUsage, CLIConfig, CONFIG_USAGES } from '@foscia/cli/utils/config/config';
import hasModelsList from '@foscia/cli/utils/context/hasModelsList';
import installDependencies from '@foscia/cli/utils/dependencies/installDependencies';
import usePkg from '@foscia/cli/utils/dependencies/usePkg';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import { confirm, input } from '@inquirer/prompts';

export type ActionFactoryPromptOptions = {
  usage: AppUsage;
  show: boolean;
  force: boolean;
};

export type ActionFactoryDependency = {
  name: string;
  options?: { [K: string]: unknown };
};

export type ActionFactoryOptions = {
  test?: boolean;
  cache?: boolean;
  registry?: boolean;
  deserializer?: ActionFactoryDependency;
  serializer?: ActionFactoryDependency;
  adapter?: ActionFactoryDependency;
};

async function promptForHttpAdapterConfig(usage: AppUsage) {
  const defaultBaseURL = {
    jsonapi: '/api/v1',
    jsonrest: '/api',
    http: '/',
  }[usage];
  const baseURL = await input({
    message: usage === 'http'
      ? 'what\'s the base URL of your server?'
      : 'what\'s the base URL of your API?',
    default: defaultBaseURL,
  });

  return { baseURL };
}

async function promptForRegistry(
  config: CLIConfig,
  imports: ImportsList,
  options: ActionFactoryPromptOptions,
) {
  const registry = await confirm({
    message: 'would you like a registry (useful for circular relationships)?',
    default: false,
  });
  if (registry) {
    imports.add('makeRegistry', '@foscia/core');
    imports.add('models', 'models', { isDefault: true });

    if (!(await hasModelsList(config))) {
      await runMakeModelsCommand(options);
    }
  }

  return registry;
}

export default async function promptForActionFactoryOptions(
  config: CLIConfig,
  imports: ImportsList,
  options: ActionFactoryPromptOptions,
) {
  imports.add('makeActionFactory', '@foscia/core');

  const test = await confirm({
    message: 'would you like to mock actions for unit tests?',
    default: false,
  });
  if (test) {
    const pkg = await usePkg();
    if (!pkg.findDevDependency('@foscia/test')) {
      await installDependencies(config, ['@foscia/test'], { dev: true, show: options.show });
    }

    imports.add('makeActionFactoryMockable', '@foscia/test');
  }

  if (options.usage === 'http') {
    imports.add('makeHttpAdapter', '@foscia/http');

    return {
      test,
      adapter: {
        name: 'makeHttpAdapter',
        options: await promptForHttpAdapterConfig(options.usage),
      },
    };
  }

  if (options.usage === 'jsonapi') {
    imports.add('makeCache', '@foscia/core');
    imports.add('makeJsonApiDeserializer', '@foscia/jsonapi');
    imports.add('makeJsonApiSerializer', '@foscia/jsonapi');
    imports.add('makeJsonApiAdapter', '@foscia/jsonapi');

    return {
      test,
      cache: true,
      registry: await promptForRegistry(config, imports, options),
      deserializer: { name: 'makeJsonApiDeserializer' },
      serializer: { name: 'makeJsonApiSerializer' },
      adapter: {
        name: 'makeJsonApiAdapter',
        options: await promptForHttpAdapterConfig(options.usage),
      },
    };
  }

  if (options.usage === 'jsonrest') {
    imports.add('makeCache', '@foscia/core');
    imports.add('makeJsonRestDeserializer', '@foscia/rest');
    imports.add('makeJsonRestSerializer', '@foscia/rest');
    imports.add('makeJsonRestAdapter', '@foscia/rest');

    return {
      test,
      cache: true,
      registry: await promptForRegistry(config, imports, options),
      deserializer: { name: 'makeJsonRestDeserializer' },
      serializer: { name: 'makeJsonRestSerializer' },
      adapter: {
        name: 'makeJsonRestAdapter',
        options: await promptForHttpAdapterConfig(options.usage),
      },
    };
  }

  throw new Error(`invalid usage given, choose within: ${CONFIG_USAGES.map((u) => u.value).join(', ')}`);
}
