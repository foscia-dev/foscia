export default function toKebabCase(value: string): string {
  const matches = value.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
  );
  if (matches === null) {
    return value;
  }

  return matches.map((x) => x.toLowerCase()).join('-');
}
