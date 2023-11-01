export default function toTree(items: unknown[], modifier: (bullet: string) => string) {
  return items.map(
    (item, index) => `${modifier(index === (items.length - 1) ? '└─' : '├─')} ${item}`,
  ).join('\n');
}
