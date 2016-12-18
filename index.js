(function() {
  var initialTokens = ['Jamon', ' ', 'ipsum', ' '];

  function getCount() {
    return document.getElementById('jamon-count-input').value;
  }
  function getType() {
    return document.querySelector('input[name="type"]:checked').value;
  }
  function getResultHTMLNode() {
    return document.getElementById('jamon-result');
  }

  function jamonIpsum() {
    var resultNode = getResultHTMLNode();
    var tokens = generateTokens();

    resultNode.innerHTML = tokens.join('');
  }

  function generateTokens() {
    var tokens = initialTokens.slice();
    var count = getCount();

    var nonConnectorWords = 0;
    var minimumRealWords = 3;
    var chancesOfConnector = .1;
    var lastTokens = [];

    while (tokens.length < count) {
      lastTokens = tokens.slice(-10);

      tokens.push(getRandomWord(lastTokens));

      // Use connector or whitespace?
      if (
        nonConnectorWords >= minimumRealWords &&
        Math.random() > chancesOfConnector
      ) {
        nonConnectorWords = 0;
        tokens.push(getRandomConnector(), ' ')
      } else {
        nonConnectorWords++;
        tokens.push(' ');
      }
    }

    tokens.pop(); // last whitespace.
    tokens.push('.');

    return tokens;
  }

  function getRandInt(limit) {
    return Math.floor(Math.random() * limit);
  }

  function getRandomConnector() {
    var rand = getRandInt(availableConnectors.length);
    return availableConnectors[rand];
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

  var availableConnectors = [
    '.',
    ',',
    ' y',
    ' pero',
  ];

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
    'el',
    'la',
    'los',
    'las',
    'con',
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
  ];

  jamonIpsum();
}());
