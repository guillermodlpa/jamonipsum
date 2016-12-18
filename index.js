/**
 * Jamon Ipsum
 *
 * Simple code for simple purposes.
 */
(function() {
  'use strict';

  function getCount() {
    return document.getElementById('jamon-count-input').value;
  }
  function getType() {
    return document.querySelector('input[name="type"]:checked').value;
  }
  function getResultHTMLNode() {
    return document.getElementById('jamon-result');
  }
  function bindGenerateButton() {
    var button = document.getElementById('jamon-button');
    button && button.addEventListener('click', jamonIpsum);
  }

  function jamonIpsum() {
    var resultNode = getResultHTMLNode();
    var tokens = generateTokens();

    resultNode.innerHTML = tokens.join('');
  }

  function generateTokens() {
    var tokens = initialWords.slice();
    var count = getCount();

    var lastTokens = [];
    var wordsAdded = tokens.length;
    var newWord;

    var nonConnectors = 0;
    var nonArticles = 0;
    var nonStops = 0;

    while (wordsAdded < count) {
      lastTokens = tokens.slice(-20).map(function(token) { return token.trim(); });

      newWord = getRandomWord(lastTokens);

      // If last char is a `.`, uppercase.
      if (tokens[tokens.length - 1].slice(-2) === '. ') {
        newWord = newWord.charAt(0).toUpperCase() + newWord.substr(1);
      }

      wordsAdded++;

      var extraTokenType = getNextTokenType(count - wordsAdded, nonConnectors, nonArticles, nonStops);
      var extraToken;

      switch (extraTokenType) {
        case 'connector':
          extraToken = getRandomConnector() + ' ';
          nonConnectors = 0;
          nonArticles++;
          wordsAdded++;
          nonStops++;
          break;
        case 'article':
          extraToken = getRandomArticle() + ' ';
          nonArticles = 0;
          nonConnectors++;
          wordsAdded++;
          nonStops++;
          break;
        case 'stop':
          extraToken = getRandomStop() + ' ';
          nonConnectors++;
          nonArticles++;
          nonStops = 0;
          break;
        default:
          extraToken = ' ';
          nonConnectors++;
          nonArticles++;
          nonStops++;
      }

      tokens.push(newWord + extraToken);
    }

    // Remove last whitespace.
    tokens[tokens.length - 1] = tokens[tokens.length - 1].slice(0, -1);
    tokens.push('.');

    return tokens;
  }

  var minWordsBetweenStops = 3;
  var chancesOfStop = .2;
  var minWordsBetweenConnectors = 6;
  var chancesOfConnector = .2;
  var minWordsBetweenArticles = 2;
  var chancesOfArticle = .5;

  function getNextTokenType(wordsLeft, nonConnectors, nonArticles, nonStops) {
    // Article.
    if (
      wordsLeft > 2 &&
      nonArticles >= minWordsBetweenArticles &&
      Math.random() > chancesOfArticle
    ) {
      return 'article';
    // Connector.
    } else if (
      wordsLeft > 6 &&
      nonConnectors >= minWordsBetweenConnectors &&
      Math.random() > chancesOfConnector
    ) {
      return 'connector';
    // Stop.
    } else if (
      wordsLeft > 6 &&
      nonStops >= minWordsBetweenStops &&
      Math.random() > chancesOfStop
    ) {
      return 'stop';
    } else {
      return undefined; // whitespace.
    }
  }

  function getRandInt(limit) {
    return Math.floor(Math.random() * limit);
  }

  function getRandomStop() {
    var rand = getRandInt(availableStops.length);
    return availableStops[rand];
  }
  function getRandomConnector() {
    var rand = getRandInt(availableConnectors.length);
    return availableConnectors[rand];
  }
  function getRandomArticle() {
    var rand = getRandInt(availableArticles.length);
    return availableArticles[rand];
  }

  function getRandomWord(lastTokens) {
    var rand;
    var word;
    var attempts = 0;

    do {
      rand = getRandInt(availableWords.length);
      word = availableWords[rand];
      attempts++;
    } while (lastTokens.indexOf(word) !== -1 && attempts < 20)

    return word;
  }

  var availableStops = [
    '.',
    ',',
  ];

  var availableConnectors = [
    ' y',
    ' pero',
  ];

  var availableArticles = [
    ' la',
    ' el',
    ' las',
    ' los',
    ' mis',
    ' tus',
    ' sus',
    ' tu',
    ' mi',
    ' un',
    ' una',
  ];

  var initialWords = ['Jamón ', 'ipsum '];
  var availableWords = [
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
    'chollazo',
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
  ];

  bindGenerateButton();
  jamonIpsum();
}());
