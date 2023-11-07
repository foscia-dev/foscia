import { DefinitionProperty } from '@foscia/cli/utils/input/promptForProperties';

type PropertyForDefTemplateData = {
  property: DefinitionProperty;
};

function renderAttributeProperty(property: DefinitionProperty) {
  return `attr${property.type ? `<${property.type}>` : ''}(${property.transformer ? `${property.transformer}()` : ''})`;
}

function renderRelationProperty(property: DefinitionProperty) {
  return `${property.typology}(() => ${property.type})`;
}

export default function renderPropertyForDef({ property }: PropertyForDefTemplateData) {
  return `
${property.name}: ${property.typology === 'attr' ? renderAttributeProperty(property) : renderRelationProperty(property)}
`.trim();
}
