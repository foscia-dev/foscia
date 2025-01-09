import { runMakeModelsCommand } from '@foscia/cli/commands/make/makeModelsCommand';
import { AppFramework, AppUsage, CLIConfig, CONFIG_USAGES } from '@foscia/cli/utils/config/config';
import hasModelsList from '@foscia/cli/utils/context/hasModelsList';
import installDependencies from '@foscia/cli/utils/dependencies/installDependencies';
import usePkg from '@foscia/cli/utils/dependencies/usePkg';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import promptConfirm from '@foscia/cli/utils/prompts/promptConfirm';
import promptText from '@foscia/cli/utils/prompts/promptText';

export type ActionFactoryPromptOptions = {
  usage: AppUsage;
  framework?: AppFramework;
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

async function promptForHttpAdapterConfig(
  imports: ImportsList,
  usage: AppUsage,
  framework?: AppFramework,
) {
  const defaultBaseURL = {
    jsonapi: '/api/v1',
    jsonrest: '/api',
    http: '/',
  }[usage];
  const baseURL = await promptText({
    name: 'baseURL',
    message: usage === 'http'
      ? 'what\'s the base URL of your server?'
      : 'what\'s the base URL of your API?',
    default: defaultBaseURL,
  });

  if (framework === 'nuxt') {
    imports.add('ofetch', 'ofetch', { isDefault: true });
  }

  return {
    fetch: framework === 'nuxt' ? '!raw!ofetch.native' : undefined,
    baseURL,
  };
}

async function promptForRegistry(
  config: CLIConfig,
  imports: ImportsList,
  options: ActionFactoryPromptOptions,
) {
  const registry = await promptConfirm({
    name: 'registry',
    message: 'would you like a registry (useful for circular relationships)?',
    initial: false,
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

  const test = await promptConfirm({
    name: 'test',
    message: 'would you like to mock actions for unit tests?',
    initial: false,
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
        options: await promptForHttpAdapterConfig(imports, options.usage, options.framework),
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
        options: await promptForHttpAdapterConfig(imports, options.usage, options.framework),
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
        options: await promptForHttpAdapterConfig(imports, options.usage, options.framework),
      },
    };
  }

  throw new Error(`invalid usage given, choose within: ${CONFIG_USAGES.map((u) => u.value).join(', ')}`);
}
