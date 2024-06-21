import kernel from '@foscia/cli/kernel';
import c from 'ansi-colors';
import process from 'node:process';

(async () => {
  const colorsEnabled = !process.env.NO_COLOR && process.env.FORCE_COLOR !== '0';
  if (!colorsEnabled) {
    c.enabled = false;
  }

  await kernel(process.argv);
})();
