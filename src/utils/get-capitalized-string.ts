export function getCapitalizedString(str: string) {
  if (!str) return "";
  return str.length === 1
    ? str.toUpperCase()
    : str.charAt(0).toUpperCase() + str.slice(1);
}
