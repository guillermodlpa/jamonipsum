/**
 * @returns {Node}
 */
export function getCountInput() {
  return document.getElementById('jamon-count-input');
}

/**
 * @returns {string}
 */
export function getTypeInputValue() {
  return document.querySelector('input[name="type"]:checked').value;
}

/**
 * @returns {bool}
 */
export function getEmojiValue() {
  return Boolean(document.querySelector('input[name="emoji"]:checked'));
}

/**
 * @returns {Node}
 */
export function getBody() {
  return document.getElementsByTagName('BODY')[0];
}

/**
 * @returns {Node}
 */
export function getMainLogo() {
  const h1 = document.getElementsByTagName('H1')[0];
  return h1.getElementsByClassName('header-logo')[0];
}

/**
 * @param {string} html
 */
export function renderResult(html) {
  const resultNode = document.getElementById('jamon-result');
  if (resultNode) {
    resultNode.innerHTML = html;
  }
}

/**
 * @returns {Node}
 */
export function getModalEl() {
  return document.getElementById('info-modal');
}

/**
 * @returns {Node}
 */
export function getOpenModalLink() {
  return document.getElementById('info-link');
}

/**
 * @returns {Node[]}
 */
export function getAllInputs() {
  return document.getElementsByTagName('INPUT');
}

/**
 * @param {Node} el
 * @param {string} classes
 */
export function hasClass(el, classes) {
  return (new RegExp(`\b${classes}\b`)).test(el.className);
}

/**
 * @param {Node} el
 * @param {string} classes
 */
export function removeClass(el, classes) {
  el.className = (el.className || '').replace(classes, '').trim();
}

/**
 * @param {Node} el
 * @param {string} classes
 */
export function addClass(el, classes) {
  if (!hasClass(el, classes)) {
    el.className = `${el.className || ''} ${classes}`;
  }
}

/**
 * @param {Node} el
 */
export function rotate(el) {
  const rotateClass = 'is-rotating';

  if (!el || hasClass(el, rotateClass)) {
    return;
  }
  addClass(el, rotateClass);
  setTimeout(() => {
    removeClass(el, rotateClass);
  }, 500);
}
