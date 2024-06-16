export default function validateName(value: string) {
  return /^(?!\d)[\w$]+$/.test(value);
}
