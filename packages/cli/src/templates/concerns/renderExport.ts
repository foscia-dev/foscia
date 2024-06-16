import { CLIConfig } from '@foscia/cli/utils/config/config';

type ExportTemplateData = {
  config: CLIConfig;
  expr: string;
  nonClosing?: boolean;
};

function renderEsmExport(expr: string, nonClosing?: boolean) {
  return `export default ${expr}${nonClosing || expr.match(/^(class )|(function )/) ? '' : ';'}`;
}

function renderCommonJSExport(expr: string, nonClosing?: boolean) {
  return `modules.export = ${expr}${nonClosing ? '' : ';'}`;
}

export default function renderExport({ config, expr, nonClosing }: ExportTemplateData) {
  return config.modules === 'esm'
    ? renderEsmExport(expr, nonClosing)
    : renderCommonJSExport(expr, nonClosing);
}
