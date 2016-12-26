
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

/**
 * Jamon Ipsum
 *
 * Simple code for simple purposes.
 */

function bindGenerate() {
  var inputsHTMLCollection = getAllInputs();
  for (var i = 0; i < inputsHTMLCollection.length; i++) {
    inputsHTMLCollection[i].addEventListener('change', function() {
      if (this.name === 'type') {
        if (this.value === 'words') {
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
  logo && logo.addEventListener('click', () => {
    rotate(logo);
    readUiAndGenerate();
  });
}

const infoModal = (function(document, body) {
  const bodyClass = 'is-showing-info-modal';

  return {
    bind: function() {
      var button = getModalLink();
      button && button.addEventListener('click', this.open);

      var closeModalBtn = getModalCloseButton();
      closeModalBtn && closeModalBtn.addEventListener('click', this.close);
    },
    open: function() {
      addClass(body, bodyClass);
    },
    close: function() {
      removeClass(body, bodyClass);
    },
  }
}(document, getBody()));


function readUiAndGenerate() {
  const count = getCountInput().value;
  const type = getTypeInputValue();
  const emojis = getEmojiValue();
  const result = generator({
    count,
    type,
    emojis,
  });

  renderResult(result);
}

bindGenerate();
bindLogo();
infoModal.bind();
readUiAndGenerate();
