# ![logo](https://cloud.githubusercontent.com/assets/1557348/21552909/1ffda86a-ce05-11e6-9dea-81ea062e7009.png "Logo") Jamón Ipsum

![CircleCI build status](https://circleci.com/gh/guillermodlpa/jamonipsum.svg?style=shield)
[![npm version](https://img.shields.io/npm/v/jamonipsum.svg?style=flat-square)](https://www.npmjs.com/package/jamonipsum)

Generador de texto aleatorio en español. Con humor. Las contribuciones son bienvenidas.

*Random text generator in Spanish. Humorous. Contributions are welcome*

https://jamonipsum.es

Ejemplo:

> Jamón ipsum bingo botellón enróllate vergüenza vale y un máxima Torrente. Tortilla torraera pero tu lo suyo nuestra comunidad mucho de miedo a volar. Vale sus como Camarón canturreando tu flipado litrona mi calimocho, vaya chollazo.

Captura de pantalla:

![screenshot v1](https://cloud.githubusercontent.com/assets/1557348/21552977/9c52b77a-ce05-11e6-902b-76743c5ad715.png "Screenshot jamonipsum.es")

## Instalación

```
npm install jamonipsum --save
```

## Uso

```js
const jamonipsum = require('jamonipsum');

jamonipsum({
    // número de palabras o párrafos a generar
    count: 100,
    // 'words' o 'paragraphs'
    type: 'words',
    // 👍 o 👎
    useEmojis: false,
})
    .then((generatedText) => { console.log(generatedText); });
```

## Contribuir

Issues y Pull Requests son más que bienvenidas.

### Desarrollo local

Para desarrollar con la interfaz de jamonipsum.es, utiliza `yarn dev` y abre en tu navegador el fichero generado `dist/index.html`.

Para desarrollar con tests, ejectuta `yarn test --watch` or `npm run test -- --watch`.
