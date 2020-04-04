
import {
  getCountInput,
  getTypeInputValue,
  getEmojiValue,
  getBody,
  getMainLogo,
  renderResult,
  getAllInputs,
  getOpenModalLink,
  getModalEl,
  rotate,
} from './dom';
import Modal from './modal/index';

import generator from '../../src/generator';

/**
 * Read input values and generate random text.
 */
function readUiAndGenerate() {
  const count = getCountInput().value;
  const type = getTypeInputValue();
  const useEmojis = getEmojiValue();

  generator({
    count,
    type,
    useEmojis,
  })
    .then((result) => renderResult(result));
}

/**
 * Do bindings that trigger random text generation.
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

/**
 * Woah. Logo is magical.
 */
function bindLogo() {
  const logo = getMainLogo();
  logo.addEventListener('click', () => {
    rotate(logo);
    readUiAndGenerate();
  });
}

/**
 * Initialize modal with extra info.
 */
function setUpInfoModal() {
  const modalEl = getModalEl();
  const modal = new Modal(modalEl, getBody());
  const link = getOpenModalLink();
  link.addEventListener('click', modal.open);
}

bindGenerate();
bindLogo();
setUpInfoModal();
readUiAndGenerate();
