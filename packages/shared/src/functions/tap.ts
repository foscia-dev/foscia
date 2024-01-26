export default function tap<V>(value: V, callback: (value: V) => void) {
  callback(value);

  return value;
}
