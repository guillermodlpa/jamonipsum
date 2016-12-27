
import generator from './generator';
import {
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
  getOpenModalLink,
  getModalEl,
} from './dom';
import Modal from './modal/index';

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
