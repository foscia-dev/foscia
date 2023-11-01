import { MakeProperty } from '@foscia/cli/utils/make';

type PropertyForDefTemplateData = {
  property: MakeProperty;
};

export default function renderPropertyForDef({ property }: PropertyForDefTemplateData) {
  return `
${property.name}: ${property.typology}${property.type ? `<${property.type.name}>` : ''}()
`.trim();
}
