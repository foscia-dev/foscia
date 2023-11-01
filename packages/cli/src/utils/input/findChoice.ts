type Choice = {
  value: unknown;
};

export default function findChoice<T extends Choice>(choices: T[] | Readonly<T[]>, value: T['value']) {
  return choices.find((c) => c.value === value)!;
}
