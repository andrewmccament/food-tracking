export const capFirstLetter = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());
