import friendlyPath from '@foscia/cli/utils/files/friendlyPath';
import writeFile from '@foscia/cli/utils/files/writeFile';
import output from '@foscia/cli/utils/cli/output';
import { highlight } from 'cli-highlight';

export default async function writeOrPrintFile(
  name: string,
  path: string,
  content: string,
  language: string,
  show?: boolean,
) {
  if (show) {
    output.success(`${name} generated:`);
    console.log(highlight(content, { language }));
  } else {
    await writeFile(path, content);

    output.success(`${name} generated at "${friendlyPath(path)}"\n`);
  }
}
