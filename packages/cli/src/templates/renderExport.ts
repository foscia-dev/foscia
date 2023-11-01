import { CLIConfig } from '@foscia/cli/utils/config/config';

type ExportTemplateData = {
  config: CLIConfig;
  expr: string;
};

function renderEsmExport(expr: string) {
  return `export default ${expr}${expr.match(/^(class )|(function )/) ? '' : ';'}`;
}

function renderCommonJSExport(expr: string) {
  return `modules.export = ${expr};`;
}

export default function renderExport({ config, expr }: ExportTemplateData) {
  return config.modules === 'esm'
    ? renderEsmExport(expr)
    : renderCommonJSExport(expr);
}
