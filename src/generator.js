/**
 * Generator of random text.
 * Exports function that produces it.
 */

import allArticles from './fixtures/articles';
import allConnectors from './fixtures/connectors';
import allEmojis from './fixtures/emojis';
import allStops from './fixtures/stops';
import allWords from './fixtures/words';

const initialTokens = [
  'Jamón',
  'ipsum',
];

/**
 *
 * @param {string[]} paragraph
 * @returns {string}
 */
export const joinTokens = (paragraph) => paragraph
  .reduce((memo, token, index) => {
    if (index === 0) {
      return `${token}`;
    }
    if (/^\.|,$/.test(token)) {
      return `${memo}${token}`;
    }
    return `${memo} ${token}`;
  }, '');

/**
 * @param {string} string
 * @returns {int}
 */
const countWords = (value) => value.split(/\s/).filter((s) => s !== '').length;

/**
 * @param {string[]} tokens
 * @returns {int}
 */
export const countWordsInTokens = (tokens) => countWords(joinTokens(tokens));

/**
 * @param {int} upperLimit
 * @param {int} lowerLimit
 * @returns {int}
 */
const getRandInt = (upperLimit, lowerLimit) => (
  lowerLimit + Math.floor(Math.random() * (upperLimit - lowerLimit + 1))
);

/**
 * @param {int} length
 * @param {Function} getValue
 * @return {Array}
 */
const createArray = (length, getValue) => {
  const array = [];
  // For some reason, I can't get methods like Array.from to work properly on the  minified code
  for (let i = 0; i < length; i++) {
    array[i] = getValue(i);
  }
  return array;
};

/**
 * @param {int} count
 * @param {string} type
 * @param {bool} useEmojis
 * @return {Object}
 */
const getConfig = (count, type, useEmojis) => {
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
      repetitionThreshold: 2,
    },
  };

  if (type === 'words') {
    config.paragraphs[0] = count;
  } else if (type === 'paragraphs') {
    config.paragraphs = createArray(count, () => getRandInt(100, 50));
  } else {
    throw new Error(`Unknown type: ${type}`);
  }

  return config;
};

/**
 * @param {string[]} array
 * @param {int} wordsLeft
 * @param {int} threshold
 * @param {string[]} lastTokens
 * @returns {string}
 */
const chooseTokenFromArray = (array, wordsLeft, threshold, lastTokens) => {
  let rand;
  let word;
  let attempts = 0;

  do {
    rand = getRandInt(array.length - 1, 0);
    word = array[rand];
    attempts++;
  } while (
    // Re-attempt to pick a word in the following conditions
    attempts < threshold && (
      lastTokens.includes(word)
      || countWords(word) > wordsLeft
    )
  );

  return word;
};

/**
 *
 * @param {Object} config
 * @param {Object} param1
 * @param {int} param1.iterationsWithoutIt
 * @param {int} param1.wordsLeft
 * @param {string[]} param1.lastTokens
 * @return {string|undefined}
 */
const getRandomTokenFromConfig = (config, {
  iterationsWithoutIt = 0,
  wordsLeft = () => { throw new Error('wordsLeft is required'); },
  lastTokens = [],
}) => {
  if (
    wordsLeft > config.lastWordsThreshold
    && iterationsWithoutIt >= config.minWordsInBetween
    && Math.random() < config.probability
  ) {
    return chooseTokenFromArray(config.list, wordsLeft, config.repetitionThreshold, lastTokens);
  }
  return undefined;
};

/**
 * @param {string} string
 * @returns {string}
 */
const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

/**
 * @param {string} string
 * @returns {bool}
 */
const isEndOfSentence = (string) => /\.|!/.test(string.slice(-1));

/**
 * @param {string[]} tokens
 * @returns {string[]}
 */
const capitalizeTokens = (tokens) => tokens.map((token, i) => (
  (i === 0 || isEndOfSentence(tokens[i - 1]))
    ? capitalize(token)
    : token
));

/**
 * @param {Object} config
 * @return {string[]}
 */
const generateTokens = (config) => {
  const tokens = [...(config.initialTokens || [])];

  const { wordLimit } = config;

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

  const tokenTypes = [
    'connector',
    'article',
    'word',
    'stop',
  ];

  let iterations = 0;
  const hardIterationsLimit = 1000;

  while (countWordsInTokens(tokens) < wordLimit) {
    const lastTokens = tokens
      .slice(-config.word.repetitionThreshold)
      .map((token) => (token.trim()));

    const newTokens = [];

    tokenTypes.forEach((tokenType) => {
      const token = getRandomTokenFromConfig(config[tokenType], {
        iterationsWithoutIt: cacheData[tokenType].notUsedStreak,
        wordsLeft: wordLimit - countWordsInTokens(tokens) - countWordsInTokens(newTokens),
        lastTokens,
      });

      cacheData[tokenType].notUsedStreak = !token
        ? cacheData[tokenType].notUsedStreak + 1
        : 0;

      if (token) {
        newTokens.push(token);
      }
    });

    // Incrementing word count.
    tokens.push(...newTokens);

    iterations++;
    if (iterations > hardIterationsLimit) {
      break;
    }
  }

  const capitalizedTokens = [
    ...capitalizeTokens(tokens),
    '.', // end of paragraph
  ];

  return capitalizedTokens;
};

/**
 * @param {Object} config
 * @return {string}
 */
const generateTokensMultiParagraph = (config) => {
  const paragraphs = config.paragraphs.map((paragraphConfig, index) => {
    const wordsInParagraph = paragraphConfig;

    const thisConfig = {
      ...config,
      wordLimit: wordsInParagraph,
      initialTokens: index === 0 ? config.initialTokens : undefined,
    };

    return generateTokens(thisConfig);
  });
  return paragraphs;
};

/**
 * @param {string[][]} paragraphs
 * @return {string}
 */
const joinTokenParagraphs = (paragraphs) => paragraphs
  .map((paragraph) => joinTokens(paragraph))
  .reduce((memo, paragraph) => `${memo}${paragraph}\n`, '')
  .trim();

/**
 * @param {Object} config
 * @param {int} config.count
 * @param {string} config.type
 * @param {bool} config.useEmojis
 * @returns {Promise}
 */
export default ({
  count = () => { throw new Error('count is required'); },
  type = () => { throw new Error('type is required'); },
  useEmojis = () => { throw new Error('useEmojis is required'); },
} = {}) => (
  new Promise((resolve) => {
    const config = getConfig(count, type, useEmojis);
    const tokens = generateTokensMultiParagraph(config);

    resolve(joinTokenParagraphs(tokens));
  })
);
