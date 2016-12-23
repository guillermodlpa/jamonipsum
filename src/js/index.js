/**
 * Jamon Ipsum
 *
 * Simple code for simple purposes.
 */
(function () {
  'use strict';

  function getConfig() {
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

    if (document.querySelector('input[name="emoji"]:checked')) {
      config.availableWords = config.availableWords.concat(allEmojis);
    }

    var count = getCountInput().value;

    if (document.querySelector('input[name="type"]:checked').value === 'words') {
      config.paragraphs[0] = count;
    } else {
      config.paragraphs = [];
      for (var i = 0; i < count; i++) {
        config.paragraphs[i] = getRandInt(100, 50);
      }
    }

    return config;
  }
  function getCountInput() {
    return document.getElementById('jamon-count-input');
  }

  function jamonIpsum() {
    var resultNode = document.getElementById('jamon-result');

    var config = getConfig();
    var tokens = generateTokensMultiParagraph(config);

    resultNode.innerHTML = joinWithSpaces(tokens);
  }
  // function cloneArray(array) {
  //   return array.slice();
  // }
  // function cloneObject(object) {
  //   return JSON.parse(JSON.stringify(object));
  // }

  function getCount() {
    return document.getElementById('jamon-count-input').value;
  }
  function getType() {
    return document.querySelector('input[name="type"]:checked').value;
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
      var extraToken;

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

  var allStops = [
    '.',
    ',',
  ];

  var allConnectors = [
    'y',
    'pero',
  ];

  var allArticles = [
    'la',
    'el',
    'las',
    'los',
    'mis',
    'tus',
    'sus',
    'tu',
    'mi',
    'un',
    'una',
    'a',
    'con',
    'mucho de',
  ];

  var initialTokens = [
    'Jamón',
    'ipsum',
  ];
  var allWords = [
    'jamón',
    'estopa',
    'tortilla',
    'patata',
    'dolores',
    'calimocho',
    'salmorejo',
    'canción',
    'señor',
    'amiga',
    'estupendo',
    'croquetas',
    'hormiguero',
    'guitarra',
    'Quijote',
    'señorita',
    'tapas',
    'caña',
    'copazo',
    'reconquista',
    'charanga',
    'chiringuito',
    'playita',
    'persiana',
    'bocadillo',
    'fregona',
    'tomatito',
    'colacao',
    'café con leche',
    'turrón',
    'pipas',
    'tío',
    'tía',
    'botellón',
    'vaya chollazo',
    'flipado',
    'mola mazo',
    'cocido',
    'al tun tun',
    'fútbol',
    'más fútbol',
    'quinto pino',
    'piripi',
    'ligar',
    'vale',
    'canturreando',
    'vagueando',
    'haciéndose el loco',
    'no pega ojo',
    'está pan comido',
    'tócate',
    'enchufe',
    'flamenco',
    'Almodóvar',
    'Penélope Cruz',
    'Rey',
    'jodido',
    'fiesta',
    'siesta',
    'comino',
    'lia',
    'nuestra comunidad',
    'vecinos',
    'chulapo',
    'escanciando sidra',
    'cabra',
    'epa',
    'corral',
    'lacasitos',
    'movida',
    'bingo',
    'chinchón',
    'rumbeo',
    'año',
  ];

  var allEmojis = [
    '🍕',
    '🇪🇸',
    '🍊',
    '🍻',
    '🍳',
    '🍷',
    '🎾',
    '🏁',
    '🎊',
    '🐣',
    '👍',
    '✌',
    '🌟',
    '👀 ',
    '👅',
    '💪',
    '💩',
    '😎',
    '😴',
    '😱',
    '😘',
    '😻',
  ];

  function bindGenerate() {
    var button = document.getElementById('jamon-button');
    button && button.addEventListener('click', jamonIpsum);

    var inputsHTMLCollection = document.getElementsByTagName('INPUT');
    for (var i = 0; i < inputsHTMLCollection.length; i++) {
      inputsHTMLCollection[i].addEventListener('change', function() {
        if (this.name === 'type') {
          if (this.value === 'words') {
            getCountInput().value = getCountInput().value * 10;
          } else {
            getCountInput().value = Math.ceil(getCountInput().value / 10);
          }
        }
        jamonIpsum();
      });
    }
  }

  function bindInfoModal() {
    var button = document.getElementById('info-link');
    button && button.addEventListener('click', openInfoModal);

    var closeModalBtn = document.getElementById('info-modal-close');
    closeModalBtn && closeModalBtn.addEventListener('click', closeInfoModal);
  }
  function openInfoModal() {
    var body = document.getElementsByTagName('BODY')[0];
    if (!/is-showing-info-modal/.test(body.className)) {
      body.className = (body.className || '') + ' is-showing-info-modal';
    }
  }
  function closeInfoModal() {
    var body = document.getElementsByTagName('BODY')[0];
    body.className = (body.className || '').replace('is-showing-info-modal', '');
  }

  bindGenerate();
  bindInfoModal();
  jamonIpsum();
}());
