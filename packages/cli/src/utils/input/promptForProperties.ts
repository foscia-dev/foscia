import { CLIConfig } from '@foscia/cli/utils/config/config';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import promptForModelType from '@foscia/cli/utils/input/promptForModelType';
import { checkbox, input, select } from '@inquirer/prompts';

const VALID_NAME_REGEX = /^(?!\d)[\w$]+$/;

export type DefinitionProperty = {
  typology: 'attr' | 'hasOne' | 'hasMany';
  name: string;
  transformer?: string;
  type?: string;
  modifiers?: ('readOnly' | 'nullable')[];
};

async function promptForProperty(
  config: CLIConfig,
  imports: ImportsList,
  properties: DefinitionProperty[] = [],
) {
  const typology = await select({
    message: 'What property would you like to add?',
    choices: [
      {
        name: 'Attribute',
        value: 'attr',
        description: 'An attribute holding a scalar or object value.',
      },
      {
        name: 'Has One',
        value: 'hasOne',
        description: 'A relationship to one model\'s instance.',
      },
      {
        name: 'Has Many',
        value: 'hasMany',
        description: 'A relationship to many model\'s instance.',
      },
      {
        name: 'None, stop property definition',
        value: undefined,
      },
    ] as const,
  });
  if (!typology) {
    return null;
  }

  imports.add(typology, '@foscia/core');

  const name = await input({
    message: 'Give a name:',
    validate: (v) => {
      if (VALID_NAME_REGEX.test(v)) {
        if (properties.every((p) => p.name !== v)) {
          return true;
        }

        return 'Property name is already taken.';
      }

      return 'Property name must be a valid object property key.';
    },
  });

  const property = {
    name,
    typology,
    modifiers: await checkbox({
      message: 'Give specificities:',
      choices: [
        { name: 'Is nullable', value: 'nullable' },
        { name: 'Is read-only', value: 'readOnly' },
      ] as const,
    }),
  } as DefinitionProperty;

  if (typology === 'attr') {
    const transformer = await select({
      message: 'Use a transformer?',
      choices: [
        {
          name: 'toDateTime (ISO-8601 date time to JavaScript Date)',
          value: 'toDateTime',
        },
        {
          name: 'toDate (ISO-8601 date to JavaScript Date)',
          value: 'toDate',
        },
        {
          name: 'toString',
          value: 'toString',
        },
        {
          name: 'toNumber',
          value: 'toString',
        },
        {
          name: 'toBoolean',
          value: 'toBoolean',
        },
        {
          name: 'None',
          value: undefined,
        },
      ],
    });
    if (transformer) {
      imports.add(transformer, '@foscia/core');
      property.transformer = transformer;
    } else if (config.language === 'ts') {
      property.type = await input({
        message: 'Use a TypeScript type?',
        default: 'unknown',
        validate: (v) => VALID_NAME_REGEX.test(v) || 'Type must be a valid type name.',
      });
    }
  } else {
    property.type = await promptForModelType(config, imports);
  }

  return property;
}

async function promptForPropertiesWhile(
  config: CLIConfig,
  imports: ImportsList,
  next: DefinitionProperty | null,
  properties: DefinitionProperty[] = [],
): Promise<DefinitionProperty[]> {
  if (!next) {
    return properties;
  }

  properties.push(next);

  return promptForPropertiesWhile(
    config,
    imports,
    await promptForProperty(config, imports, properties),
    properties,
  );
}

export default async function promptForProperties(config: CLIConfig, imports: ImportsList) {
  return promptForPropertiesWhile(config, imports, await promptForProperty(config, imports));
}
