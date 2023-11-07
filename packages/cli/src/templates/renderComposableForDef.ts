type ComposableForDefTemplateData = {
  composable: string;
};

export default function renderComposableForDef({ composable }: ComposableForDefTemplateData) {
  return `
...${composable}
`.trim();
}
