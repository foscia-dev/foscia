import { CLIConfig } from '@foscia/cli/utils/config/config';
import resolveTransformers from '@foscia/cli/utils/context/resolveTransformers';
import validateName from '@foscia/cli/utils/files/validateName';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import promptForModelType from '@foscia/cli/utils/prompts/promptForModelType';
import { checkbox, input, select } from '@inquirer/prompts';

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
    message: 'what property would you like to define?',
    choices: [
      {
        name: properties.length
          ? 'finish properties definition'
          : 'skip properties definition',
        value: undefined,
      },
      {
        name: 'attribute',
        value: 'attr',
        description: 'attribute holding a scalar or object value.',
      },
      {
        name: 'has one relation',
        value: 'hasOne',
        description: 'relationship to one model\'s instance.',
      },
      {
        name: 'has many relation',
        value: 'hasMany',
        description: 'relationship to many model\'s instance.',
      },
    ] as const,
  });
  if (!typology) {
    return null;
  }

  imports.add(typology, '@foscia/core');

  const name = await input({
    message: 'give a name:',
    validate: (v) => {
      if (validateName(v)) {
        if (properties.every((p) => p.name !== v)) {
          return true;
        }

        return 'property name is already taken';
      }

      return 'property name must be a valid object property key';
    },
  });

  const property = {
    name,
    typology,
    modifiers: await checkbox({
      message: 'give specificities:',
      choices: [
        { name: 'nullable', value: 'nullable' },
        { name: 'read-only', value: 'readOnly' },
      ] as const,
    }),
  } as DefinitionProperty;

  if (typology === 'attr') {
    const transformer = await select({
      message: 'use a transformer?',
      choices: [
        ...(await resolveTransformers(config)).map((t) => ({
          name: `${t.name} (custom)`,
          value: t,
        })),
        {
          name: 'toDateTime (ISO-8601 date time to JavaScript Date)',
          value: { name: 'toDateTime', from: '@foscia/core' },
        },
        {
          name: 'toDate (ISO-8601 date to JavaScript Date)',
          value: { name: 'toDate', from: '@foscia/core' },
        },
        {
          name: 'toString',
          value: { name: 'toString', from: '@foscia/core' },
        },
        {
          name: 'toNumber',
          value: { name: 'toString', from: '@foscia/core' },
        },
        {
          name: 'toBoolean',
          value: { name: 'toBoolean', from: '@foscia/core' },
        },
        {
          name: 'None',
          value: undefined,
        },
      ],
    });
    if (transformer) {
      imports.add(transformer.name, transformer.from, transformer);
      property.transformer = transformer.name;
    } else if (config.language === 'ts') {
      property.type = await input({
        message: 'use a TypeScript type?',
        default: 'unknown',
        validate: (v) => validateName(v) || 'type must be a valid type name',
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
