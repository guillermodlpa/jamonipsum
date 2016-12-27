
import generator from './generator';
import {
  addClass,
  removeClass,
  rotate,
} from './utils';
import {
  getCountInput,
  getTypeInputValue,
  getEmojiValue,
  getBody,
  getMainLogo,
  renderResult,
  getAllInputs,
  getModalCloseButton,
  getModalLink,
} from './dom';

function readUiAndGenerate() {
  const count = getCountInput().value;
  const type = getTypeInputValue();
  const useEmojis = getEmojiValue();
  const result = generator({
    count,
    type,
    useEmojis,
  });

  renderResult(result);
}

/**
 * Jamon Ipsum
 *
 * Simple code for simple purposes.
 */

function bindGenerate() {
  const inputsHTMLCollection = getAllInputs();
  for (let i = 0; i < inputsHTMLCollection.length; i++) {
    inputsHTMLCollection[i].addEventListener('change', (e) => {
      if (e.target.name === 'type') {
        if (e.target.value === 'words') {
          getCountInput().value = getCountInput().value * 10;
        } else {
          getCountInput().value = Math.ceil(getCountInput().value / 10);
        }
      }
      readUiAndGenerate();
    });
  }
}

function bindLogo() {
  const logo = getMainLogo();
  logo.addEventListener('click', () => {
    rotate(logo);
    readUiAndGenerate();
  });
}

const infoModal = ((document, body) => {
  const bodyClass = 'is-showing-info-modal';

  return {
    bind: () => {
      const button = getModalLink();
      button.addEventListener('click', infoModal.open);

      const closeModalBtn = getModalCloseButton();
      closeModalBtn.addEventListener('click', infoModal.close);
    },
    open: () => {
      addClass(body, bodyClass);
    },
    close: () => {
      removeClass(body, bodyClass);
    },
  };
})(document, getBody());

bindGenerate();
bindLogo();
infoModal.bind();
readUiAndGenerate();
