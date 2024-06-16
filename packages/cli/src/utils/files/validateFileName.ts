import output from '@foscia/cli/utils/cli/output';
import process from 'node:process';

function validateFile(value: string) {
  return /^([a-zA-Z0-9-_.]+)$/.test(value);
}

function validateFileName(value: string): string | never;
function validateFileName(value: string | undefined, defaultValue: () => string): string | never;

function validateFileName(value: string | undefined, defaultValue?: () => string): string | never {
  const name = value === undefined ? defaultValue!() : value;
  if (!validateFile(name)) {
    output.error(`given name "${name}" is not a valid file name`);
    process.exit(1);
  }

  return name;
}

export default validateFileName;
