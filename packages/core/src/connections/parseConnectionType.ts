/**
 * Parse a connection and type string.
 *
 * @param connectionAndType
 *
 * @internal
 */
export default (connectionAndType: string): [string, string] => {
  const [connection, ...type] = connectionAndType.split(':');

  if (!type.length) {
    return ['default', connection];
  }

  return [connection, type.join('')];
};
