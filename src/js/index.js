
import generator from './generator';

/**
 * Jamon Ipsum
 *
 * Simple code for simple purposes.
 */

function getCountInput() {
  return document.getElementById('jamon-count-input');
}
function getTypeInputValue() {
  return document.querySelector('input[name="type"]:checked').value;
}
function getEmojiValue() {
  return !!document.querySelector('input[name="emoji"]:checked');
}
function getBody() {
  return document.getElementsByTagName('BODY')[0];
}
function renderResult(html) {
  const resultNode = document.getElementById('jamon-result');
  resultNode && (resultNode.innerHTML = html);
}

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
      readUiAndGenerate();
    });
  }
}

const infoModal = (function(document, body) {
  return {
    bind: function() {
      var button = document.getElementById('info-link');
      button && button.addEventListener('click', this.open);

      var closeModalBtn = document.getElementById('info-modal-close');
      closeModalBtn && closeModalBtn.addEventListener('click', this.close);
    },
    open: function() {
      if (!/is-showing-info-modal/.test(body.className)) {
        body.className = (body.className || '') + ' is-showing-info-modal';
      }
    },
    close: function() {
      body.className = (body.className || '').replace('is-showing-info-modal', '');
    },
  }
}(document, getBody()))


function readUiAndGenerate() {
  const count = getCountInput().value;
  const type = getTypeInputValue();
  const emojis = getEmojiValue();
  const result = generator({
    count: count,
    type: type,
    emojis: emojis,
  });

  renderResult(result);
}

bindGenerate();
infoModal.bind();
readUiAndGenerate();
