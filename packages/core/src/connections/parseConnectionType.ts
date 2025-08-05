/**
 * Parse a connection and type string.
 *
 * @param connectionAndType
 * @param defaultConnection
 *
 * @internal
 */
export default function parseConnectionType(
  connectionAndType: string,
  defaultConnection?: string,
): { connection: string; type: string; } {
  const [connection, ...type] = connectionAndType.split(':');

  if (!type.length) {
    return { connection: defaultConnection ?? 'default', type: connection };
  }

  return { connection, type: type.join('') };
}
