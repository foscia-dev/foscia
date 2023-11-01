export default function isFosciaType(value: unknown, symbol: Symbol) {
  return !!value
    && (typeof value === 'object' || typeof value === 'function')
    && '$FOSCIA_TYPE' in value
    && value.$FOSCIA_TYPE === symbol;
}
