export default (value: unknown, symbol: Symbol) => !!value
  && (typeof value === 'object' || typeof value === 'function')
  && '$FOSCIA_TYPE' in value
  && value.$FOSCIA_TYPE === symbol;
