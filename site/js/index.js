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

import jamonIpsum from '../../src/generator';

/**
 * Read input values and generate random text.
 */
function readUiAndGenerate() {
  const count = parseInt(getCountInput().value, 10);
  const type = getTypeInputValue();
  const useEmojis = getEmojiValue();

  jamonIpsum({
    count,
    type,
    useEmojis,
  })
    .then((result) => {
      const paragraphs = result.split(/\n/);
      const html = [
        '<p>',
        paragraphs.join('</p></p>'),
        '</p>',
      ].join('');
      renderResult(html);
    });
}

/**
 * Do bindings that trigger random text generation.
 */
function bindGenerate() {
  const inputsHTMLCollection = getAllInputs();
  for (let i = 0; i < inputsHTMLCollection.length; i++) {
    inputsHTMLCollection[i].addEventListener('input', (e) => {
      if (e.target.name === 'type') {
        if (e.target.value === 'words') {
          getCountInput().value = getCountInput().value * 10;
        } else {
          getCountInput().value = Math.ceil(getCountInput().value / 10);
        }
      }
      if (e.target.name === 'count') {
        // Skip rendering if we have an empty value
        if (e.target.value === '') {
          return;
        }
        const countValue = parseInt(e.target.value, 10);
        if (Number.isNaN(countValue)) {
          return;
        }
        if (countValue < e.target.min) {
          e.target.value = e.target.min;
        }
        if (countValue > e.target.max) {
          e.target.value = e.target.max;
        }
        // If no match, use parsed, like with with '4e3'
        if (`${countValue}` !== countValue) {
          e.target.value = countValue;
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
