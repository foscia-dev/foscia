const path = require('node:path');
const fs = require('node:fs');

module.exports = function entries() {
  const packagesDir = path.resolve(__dirname, '..', 'packages');

  return fs.readdirSync(packagesDir, { withFileTypes: true })
    .filter((f) => (
      f.isDirectory()
      && fs.existsSync(path.resolve(packagesDir, f.name, 'buildOptions.json'))
    ))
    .map((f) => ({
      name: f.name,
      global: toPascalCase(`foscia-${f.name}`),
      path: `@foscia/${f.name}`,
    }));
};

function toPascalCase(str) {
  return str
    .replace(/(\w)(\w*)/g, (g0, g1, g2) => `${g1.toUpperCase()}${g2.toLowerCase()}`)
    .replace(/[-_\s]+/, '');
}
