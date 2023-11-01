import { MakeType } from '@foscia/cli/utils/make';

type ComposableForDefTemplateData = {
  composable: MakeType;
};

export default function renderComposableForDef({ composable }: ComposableForDefTemplateData) {
  return `
...${composable.name}
`.trim();
}
