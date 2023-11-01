import { CLIConfig } from '@foscia/cli/utils/config/config';
import promptForModelType from '@foscia/cli/utils/input/promptForModelType';
import { MAKE_PROPERTY_TYPOLOGIES, MakeProperty } from '@foscia/cli/utils/make';
import { input, select } from '@inquirer/prompts';

const VALID_NAME_REGEX = /^(?!\d)[\w$]+$/;

async function promptForProperty(
  config: CLIConfig,
  properties: MakeProperty[] = [],
) {
  const typology = await select({
    message: 'What property would you like to add?',
    choices: [
      ...MAKE_PROPERTY_TYPOLOGIES,
      {
        name: 'None, stop property definition',
        value: undefined,
      },
    ] as const,
  });
  if (!typology) {
    return null;
  }

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

  const property = { name, typology } as MakeProperty;

  if (config.language === 'ts') {
    if (typology === 'attr') {
      const type = await input({
        message: 'Give a type:',
        default: 'unknown',
        validate: (v) => VALID_NAME_REGEX.test(v) || 'Type must be a valid type name.',
      });

      property.type = { name: type };
    } else {
      property.type = await promptForModelType(config);
    }
  }

  return property;
}

async function promptForPropertiesWhile(
  config: CLIConfig,
  next: MakeProperty | null,
  properties: MakeProperty[] = [],
): Promise<MakeProperty[]> {
  if (!next) {
    return properties;
  }

  properties.push(next);

  return promptForPropertiesWhile(config, await promptForProperty(config, properties), properties);
}

export default async function promptForProperties(config: CLIConfig) {
  return promptForPropertiesWhile(config, await promptForProperty(config));
}
