import { CLIConfig } from '@foscia/cli/utils/config/config';
import resolvePath from '@foscia/cli/utils/files/resolvePath';
import writeOrPrintFile from '@foscia/cli/utils/files/writeOrPrintFile';
import promptForOverwrite from '@foscia/cli/utils/prompts/promptForOverwrite';

export default async function makeFile(
  config: CLIConfig,
  name: string,
  fileName: string,
  template: () => Promise<string>,
  options: { show?: boolean; force?: boolean; external?: boolean; },
) {
  const filePath = options.external
    ? `${fileName}.${config.language}`
    : resolvePath(config, `${fileName}.${config.language}`);

  const content = `${(await template()).trim()}\n`;

  if (!options.show && !options.force) {
    await promptForOverwrite(filePath);
  }

  await writeOrPrintFile(name, filePath, content, config.language, options.show);
}
