/**
 * Some utility functions.
 */

export function mandatoryParameter() {
  throw new Error('Missing parameter');
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
export function isEndOfSentence(string) {
  return /\.|!/.test(string.slice(-1));
}
export function countWords(string) {
  const matches = string.match(/\w+/g);
  return matches ? matches.length : 0;
}
export function getRandInt(upperLimit, lowerLimit) {
  if (!lowerLimit) {
    lowerLimit = 0;
  }
  return lowerLimit + Math.floor(Math.random() * (upperLimit - lowerLimit + 1));
}
