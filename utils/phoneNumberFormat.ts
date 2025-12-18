export function phoneNumberFormat(phoneNumber: string) {
  const normalized = phoneNumber.replace(/^8/, '7');
  return `+${normalized[0]} ${normalized.slice(1, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7, 9)} ${normalized.slice(9, 11)}`;
}
