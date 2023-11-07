import { CLIConfig } from '@foscia/cli/utils/config/config';
import resolvePath from '@foscia/cli/utils/files/resolvePath';
import writeOrPrintFile from '@foscia/cli/utils/files/writeOrPrintFile';
import promptForOverwrite from '@foscia/cli/utils/input/promptForOverwrite';

export default async function makeFile(
  config: CLIConfig,
  name: string,
  fileName: string,
  template: () => Promise<string>,
  show: boolean,
) {
  const fileExt = config.language === 'ts' ? 'ts' : 'js';
  const filePath = resolvePath(config, `${fileName}.${fileExt}`);

  if (!show) {
    await promptForOverwrite(filePath);
  }

  const content = `${(await template()).trim()}\n`;

  await writeOrPrintFile(name, filePath, content, config.language, show);
}
