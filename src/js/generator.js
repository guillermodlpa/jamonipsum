
import allArticles from './fixtures/articles';
import allConnectors from './fixtures/connectors';
import allEmojis from './fixtures/emojis';
import allStops from './fixtures/stops';
import allWords from './fixtures/words';
import { mandatoryParameter } from './utils';

export default function({
  count = mandatoryParameter(),
  type = mandatoryParameter(),
  useEmojis = mandatoryParameter(),
} = {}) {
  var config = getConfig(count, type, useEmojis);
  var tokens = generateTokensMultiParagraph(config);

  return joinWithSpaces(tokens);
}

const initialTokens = [
  'Jamón',
  'ipsum',
];

function getConfig(count, type, useEmojis) {
  var config = {
    availableWords: allWords,
    availableArticles: allArticles,
    availableConnectors: allConnectors,
    availableStops: allStops,
    initialTokens: initialTokens,
    wordRepetitionThreshold: 20,
    chancesOfUsingStop: .3,
    minWordsBetweenStops: 3,
    minWordsBetweenConnectors: 6,
    chancesOfConnector: .3,
    minWordsBetweenArticles: 2,
    chancesOfArticle: .5,
    paragraphs: [],
  };

  if (useEmojis) {
    config.availableWords = config.availableWords.concat(allEmojis);
  }

  if (type === 'words') {
    config.paragraphs[0] = count;
  } else {
    config.paragraphs = [];
    for (var i = 0; i < count; i++) {
      config.paragraphs[i] = getRandInt(100, 50);
    }
  }

  return config;
}

function generateTokensMultiParagraph(config) {
  var tokens = [];

  for (var i = 0; i < config.paragraphs.length; i++) {
    var wordsInParagraph = config.paragraphs[i];

    config.wordLimit = wordsInParagraph;

    tokens = tokens.concat(
      '<p>',
      generateTokens(config),
      '</p>'
    );
  }
  return tokens;
}

function generateTokens(config) {
  var availableWords = config.availableWords;
  var availableArticles = config.availableArticles
  var availableConnectors = config.availableConnectors
  var availableStops = config.availableStops;
  var wordRepetitionThreshold = config.wordRepetitionThreshold;
  var wordLimit = config.wordLimit;

  var tokens = config.initialTokens.slice();

  var lastTokens = [];
  var wordsAdded = tokens.length;
  var newWord;

  var nonConnectors = 0;
  var nonArticles = 0;
  var nonStops = 0;

  while (wordsAdded < wordLimit) {
    lastTokens = tokens.slice(-wordRepetitionThreshold).map(function(token) { return token.trim(); });

    newWord = getRandomValue(availableWords, lastTokens, wordRepetitionThreshold);

    // If last char is a `.`, uppercase.
    if (tokens[tokens.length - 1].slice(-2) === '.') {
      newWord = newWord.charAt(0).toUpperCase() + newWord.substr(1);
    }

    var extraTokenType = getNextExtraTokenType(
      config,
      wordLimit - wordsAdded,
      nonConnectors,
      nonArticles,
      nonStops
    );
    var extraToken = null;

    switch (extraTokenType) {
      case 'connector':
        extraToken = getRandomValue(availableConnectors);
        nonConnectors = 0;
        nonArticles++;
        nonStops++;
        break;
      case 'article':
        extraToken = getRandomValue(availableArticles);
        nonArticles = 0;
        nonConnectors++;
        nonStops++;
        break;
      case 'stop':
        extraToken = getRandomValue(availableStops);
        nonConnectors++;
        nonArticles++;
        nonStops = 0;
        break;
      default:
        nonArticles++;
        nonConnectors++;
        nonStops++;
    }

    var addedCount = countWordsInString(newWord);
    if (addedCount > wordLimit - wordsAdded) {
      continue;
    }
    wordsAdded += countWordsInString(newWord);
    tokens.push(newWord);

    if (extraToken) {
      addedCount = countWordsInString(extraToken);
      if (addedCount > wordLimit - wordsAdded) {
        continue;
      }
      wordsAdded += countWordsInString(extraToken);
      tokens.push(extraToken);
    }
  }

  tokens.push('.');

  return tokens;
}

function getNextExtraTokenType(config, wordsLeft, nonConnectors, nonArticles, nonStops) {
  var possibilities = [];
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

function getRandInt(upperLimit, lowerLimit) {
  lowerLimit || (lowerLimit = 0);
  return lowerLimit + Math.floor(Math.random() * (upperLimit + 1 - lowerLimit));
}

function getRandomValue(array, lastChoicesArray, limit) {
  var rand;
  var word;
  var attempts = 0;

  do {
    rand = getRandInt(array.length - 1);
    word = array[rand];
    attempts++;
  } while (lastChoicesArray && lastChoicesArray.indexOf(word) !== -1 && attempts < limit)

  return word;
}

function countWordsInString(string) {
  return string.replace(/\.\,/, '').split(' ').length;
}

function joinWithSpaces(tokens) {
  var result = '';
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i] === '.' || tokens[i] === ',') {
      result += tokens[i];
    } else {
      result += ' ' + tokens[i];
    }
  }
  return result;
}
