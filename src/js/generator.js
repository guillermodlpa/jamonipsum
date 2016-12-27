
import allArticles from './fixtures/articles';
import allConnectors from './fixtures/connectors';
import allEmojis from './fixtures/emojis';
import allStops from './fixtures/stops';
import allWords from './fixtures/words';
import {
  mandatoryParameter,
  getRandInt,
  countWords,
} from './utils';

const initialTokens = [
  'Jamón',
  'ipsum',
];

function getConfig(count, type, useEmojis) {
  const config = {
    availableWords: allWords,
    availableArticles: allArticles,
    availableConnectors: allConnectors,
    availableStops: allStops,
    initialTokens,
    wordRepetitionThreshold: 20,
    chancesOfUsingStop: 0.3,
    minWordsBetweenStops: 3,
    minWordsBetweenConnectors: 6,
    chancesOfConnector: 0.3,
    minWordsBetweenArticles: 2,
    chancesOfArticle: 0.5,
    paragraphs: [],
  };

  if (useEmojis) {
    config.availableWords = config.availableWords.concat(allEmojis);
  }

  if (type === 'words') {
    config.paragraphs[0] = count;
  } else {
    config.paragraphs = [];
    for (let i = 0; i < count; i++) {
      config.paragraphs[i] = getRandInt(100, 50);
    }
  }

  return config;
}

function getRandomToken(array, lastChoicesArray, limit) {
  let rand;
  let word;
  let attempts = 0;

  do {
    rand = getRandInt(array.length - 1);
    word = array[rand];
    attempts++;
  } while (lastChoicesArray && lastChoicesArray.indexOf(word) !== -1 && attempts < limit);

  return word;
}

function getNextExtraTokenType(config, wordsLeft, nonConnectors, nonArticles, nonStops) {
  const possibilities = [];
  if (
    wordsLeft > 2 &&
    nonArticles >= config.minWordsBetweenArticles &&
    Math.random() > config.chancesOfArticle
  ) {
    possibilities.push('article');
  } else if (
    wordsLeft > 6 &&
    nonConnectors >= config.minWordsBetweenConnectors &&
    Math.random() > config.chancesOfConnector
  ) {
    possibilities.push('connector');
  } else if (
    wordsLeft > 6 &&
    nonStops >= config.minWordsBetweenStops &&
    Math.random() > config.chancesOfStop
  ) {
    possibilities.push('stop');
  }

  return (possibilities.length
    ? possibilities[getRandInt(possibilities.length - 1)]
    : null
  );
}

function generateTokens(config) {
  const availableWords = config.availableWords;
  const availableArticles = config.availableArticles;
  const availableConnectors = config.availableConnectors;
  const availableStops = config.availableStops;
  const wordRepetitionThreshold = config.wordRepetitionThreshold;
  const wordLimit = config.wordLimit;

  const tokens = config.initialTokens.slice();

  let lastTokens = [];
  let wordsAdded = tokens.length;
  let newWord;

  let nonConnectors = 0;
  let nonArticles = 0;
  let nonStops = 0;

  while (wordsAdded < wordLimit) {
    lastTokens = tokens.slice(-wordRepetitionThreshold).map(token => (token.trim()));

    newWord = getRandomToken(availableWords, lastTokens, wordRepetitionThreshold);

    // If last char is a `.`, uppercase.
    if (tokens[tokens.length - 1].slice(-2) === '.') {
      newWord = newWord.charAt(0).toUpperCase() + newWord.substr(1);
    }

    const extraTokenType = getNextExtraTokenType(
      config,
      wordLimit - wordsAdded,
      nonConnectors,
      nonArticles,
      nonStops,
    );
    let extraToken = null;

    switch (extraTokenType) {
      case 'connector':
        extraToken = getRandomToken(availableConnectors);
        nonConnectors = 0;
        nonArticles++;
        nonStops++;
        break;
      case 'article':
        extraToken = getRandomToken(availableArticles);
        nonArticles = 0;
        nonConnectors++;
        nonStops++;
        break;
      case 'stop':
        extraToken = getRandomToken(availableStops);
        nonConnectors++;
        nonArticles++;
        nonStops = 0;
        break;
      default:
        nonArticles++;
        nonConnectors++;
        nonStops++;
    }

    let addedCount = countWords(newWord);
    if (addedCount > wordLimit - wordsAdded) {
      continue;
    }
    wordsAdded += countWords(newWord);
    tokens.push(newWord);

    if (extraToken) {
      addedCount = countWords(extraToken);
      if (addedCount > wordLimit - wordsAdded) {
        continue;
      }
      wordsAdded += countWords(extraToken);
      tokens.push(extraToken);
    }
  }

  tokens.push('.');

  return tokens;
}

function generateTokensMultiParagraph(config) {
  let tokens = [];

  for (let i = 0; i < config.paragraphs.length; i++) {
    const wordsInParagraph = config.paragraphs[i];

    const thisConfig = Object.assign({}, config);
    thisConfig.wordLimit = wordsInParagraph;

    tokens = tokens.concat(
      '<p>',
      generateTokens(thisConfig),
      '</p>',
    );
  }
  return tokens;
}

function joinWithSpaces(tokens) {
  let result = '';
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '.' || tokens[i] === ',') {
      result = `${result}${tokens[i]}`;
    } else {
      result = `${result} ${tokens[i]}`;
    }
  }
  return result;
}

export default function ({
  count = mandatoryParameter(),
  type = mandatoryParameter(),
  useEmojis = mandatoryParameter(),
} = {}) {
  const config = getConfig(count, type, useEmojis);
  const tokens = generateTokensMultiParagraph(config);

  return joinWithSpaces(tokens);
}
