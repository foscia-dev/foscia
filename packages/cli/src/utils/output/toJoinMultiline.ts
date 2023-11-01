export default function toJoinMultiline(items: string[], sep = '\n') {
  return items.length ? `${items.join(sep)}${sep}` : '';
}
