
import allArticles from './fixtures/articles';
import allConnectors from './fixtures/connectors';
import allEmojis from './fixtures/emojis';
import allStops from './fixtures/stops';
import allWords from './fixtures/words';
import {
  mandatoryParameter,
} from './utils';

const initialTokens = [
  'Jamón',
  'ipsum',
];

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
function endsWithDot(string) {
  return /\./.test(string.slice(-1));
}
function countWords(string) {
  const matches = string.match(/\w+/g);
  return matches ? matches.length : 0;
}
function getRandInt(upperLimit, lowerLimit) {
  if (!lowerLimit) {
    lowerLimit = 0;
  }
  return lowerLimit + Math.floor(Math.random() * (upperLimit - lowerLimit + 1));
}

function getConfig(count, type, useEmojis) {
  const config = {
    initialTokens,
    paragraphs: [],
    wordRepetitionThreshold: 20,

    word: {
      list: (useEmojis
        ? allWords.concat(allEmojis)
        : allWords
      ),
      minWordsInBetween: 0,
      probability: 1,
      lastWordsThreshold: 0,
      repetitionThreshold: 20,
    },

    stop: {
      list: allStops,
      minWordsInBetween: 3,
      probability: 0.3,
      lastWordsThreshold: 6,
      repetitionThreshold: 0,
    },

    connector: {
      list: allConnectors,
      minWordsInBetween: 6,
      probability: 0.5,
      lastWordsThreshold: 6,
      repetitionThreshold: 0,
    },

    article: {
      list: allArticles,
      minWordsInBetween: 2,
      probability: 0.5,
      lastWordsThreshold: 2,
      repetitionThreshold: 0,
    },
  };

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

function chooseTokenFromArray(array, wordsLeft, threshold, lastTokens) {
  let rand;
  let word;
  let attempts = 0;

  do {
    rand = getRandInt(array.length - 1);
    word = array[rand];
    attempts++;
  } while (
    lastTokens &&
    lastTokens.indexOf(word) !== -1 && attempts < threshold &&
    wordsLeft > countWords(word)
  );

  return word;
}

function getRandomTokenFromConfig(config, {
  iterationsWithoutIt = 0,
  wordsLeft = mandatoryParameter(),
  lastTokens = [],
}) {
  if (
    wordsLeft > config.lastWordsThreshold &&
    iterationsWithoutIt >= config.minWordsInBetween &&
    Math.random() < config.probability
  ) {
    return chooseTokenFromArray(config.list, wordsLeft, config.repetitionThreshold, lastTokens);
  }
  return undefined;
}

function capitalizeTokens(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (i === 0 || endsWithDot(tokens[i - 1])) {
      tokens[i] = capitalize(tokens[i]);
    }
  }
}

function generateTokens(config) {
  const tokens = config.initialTokens ? config.initialTokens.slice() : [];
  const wordLimit = config.wordLimit;
  let wordsAddedCount = tokens.length;

  const cacheData = {
    word: {
      notUsedStreak: 0,
    },
    connector: {
      notUsedStreak: 0,
    },
    article: {
      notUsedStreak: 0,
    },
    stop: {
      notUsedStreak: 0,
    },
  };

  const keys = [
    'connector',
    'article',
    'word',
    'stop',
  ];

  let iterations = 0;
  const hardIterationsLimit = 1000;

  while (wordsAddedCount < wordLimit) {
    const lastTokens = tokens.slice(-config.word.repetitionThreshold).map(token => (token.trim()));
    const wordsLeft = wordLimit - wordsAddedCount;

    const newTokens = [];

    keys.forEach((key) => {
      const token = getRandomTokenFromConfig(config[key], {
        iterationsWithoutIt: cacheData[key].notUsedStreak,
        wordsLeft,
        lastTokens,
      });
      cacheData[key].notUsedStreak = !token ? cacheData[key].notUsedStreak + 1 : 0;

      if (token) {
        newTokens.push(token);
        cacheData[key].notUsedStreak = 0;
      } else {
        cacheData[key].notUsedStreak += 1;
      }
    });

    // Incrementing word count.
    wordsAddedCount += newTokens.reduce((accumulator, token) => (
      accumulator + countWords(token)
    ), 0);

    tokens.push(...newTokens);

    iterations++;
    if (iterations > hardIterationsLimit) {
      break;
    }
  }

  capitalizeTokens(tokens);

  tokens.push('.');

  return tokens;
}

function generateTokensMultiParagraph(config) {
  let tokens = [];

  for (let i = 0; i < config.paragraphs.length; i++) {
    const wordsInParagraph = config.paragraphs[i];

    const thisConfig = Object.assign({}, config);
    thisConfig.wordLimit = wordsInParagraph;

    if (i > 0) {
      delete thisConfig.initialTokens;
    }

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
    const thisToken = tokens[i];

    if (/^\.|,$/.test(thisToken)) {
      result = `${result}${thisToken}`;
    } else {
      result = `${result} ${thisToken}`;
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
