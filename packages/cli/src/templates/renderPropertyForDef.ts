import { DefinitionProperty } from '@foscia/cli/utils/input/promptForProperties';

type PropertyForDefTemplateData = {
  property: DefinitionProperty;
};

function renderPropertyModifiers(property: DefinitionProperty) {
  const modifiers = (property.modifiers ?? []);
  modifiers.sort();

  return modifiers.map((m) => `.${m}()`).join('');
}

function renderAttributeProperty(property: DefinitionProperty) {
  return `attr${property.type ? `<${property.type}>` : ''}(${property.transformer ? `${property.transformer}()` : ''})`;
}

function renderRelationProperty(property: DefinitionProperty) {
  return `${property.typology}(() => ${property.type})`;
}

export default function renderPropertyForDef({ property }: PropertyForDefTemplateData) {
  const propertyDefinition = property.typology === 'attr'
    ? renderAttributeProperty(property)
    : renderRelationProperty(property);
  const propertyModifiers = renderPropertyModifiers(property);

  return `
${property.name}: ${propertyDefinition}${propertyModifiers}
`.trim();
}
