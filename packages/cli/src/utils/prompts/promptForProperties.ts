import { CLIConfig } from '@foscia/cli/utils/config/config';
import resolveTransformers from '@foscia/cli/utils/context/resolveTransformers';
import validateName from '@foscia/cli/utils/files/validateName';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import promptForModelType from '@foscia/cli/utils/prompts/promptForModelType';
import promptMultiSelect from '@foscia/cli/utils/prompts/promptMultiSelect';
import promptSelect from '@foscia/cli/utils/prompts/promptSelect';
import promptText from '@foscia/cli/utils/prompts/promptText';

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
  const typology = await promptSelect({
    name: 'typology',
    message: 'what kind of property would you like to define?',
    choices: [
      {
        name: properties.length ? 'finished' : 'skip',
        value: null,
      },
      {
        name: 'attribute',
        value: 'attr',
        hint: 'attribute holding a scalar or object value.',
      },
      {
        name: 'has one relation',
        value: 'hasOne',
        hint: 'relationship to one model\'s instance.',
      },
      {
        name: 'has many relation',
        value: 'hasMany',
        hint: 'relationship to many model\'s instance.',
      },
    ] as const,
  });
  if (typology === null) {
    return null;
  }

  imports.add(typology, '@foscia/core');

  const name = await promptText({
    name: 'name',
    message: 'give a name:',
    validate: (value: string) => {
      if (validateName(value)) {
        if (properties.every((p) => p.name !== value)) {
          return true;
        }

        return `property "${value}" is already taken`;
      }

      return 'property name must be a valid object property key';
    },
  });

  const property = {
    name,
    typology,
    modifiers: await promptMultiSelect({
      name: 'specificities',
      message: 'give specificities:',
      choices: [
        { name: 'nullable', value: 'nullable' },
        { name: 'read-only', value: 'readOnly' },
      ] as const,
    }),
  } as DefinitionProperty;

  if (typology === 'attr') {
    const transformer = await promptSelect({
      name: 'transformer',
      message: 'use a transformer?',
      choices: [
        ...(await resolveTransformers(config)).map((t) => ({
          name: `${t.name} (custom)`,
          value: t,
        })),
        {
          name: 'toDateTime',
          hint: '(ISO-8601 date time to JavaScript Date)',
          value: { name: 'toDateTime', from: '@foscia/core' },
        },
        {
          name: 'toDate',
          hint: '(ISO-8601 date to JavaScript Date)',
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
          name: 'none',
          value: null,
        },
      ],
    });
    if (transformer !== null) {
      imports.add(transformer.name, transformer.from, transformer);
      property.transformer = transformer.name;
    } else if (config.language === 'ts') {
      property.type = await promptText({
        name: 'type',
        message: 'use a TypeScript type?',
        default: 'unknown',
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
