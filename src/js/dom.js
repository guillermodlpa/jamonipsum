
export function getCountInput() {
  return document.getElementById('jamon-count-input');
}
export function getTypeInputValue() {
  return document.querySelector('input[name="type"]:checked').value;
}
export function getEmojiValue() {
  return !!document.querySelector('input[name="emoji"]:checked');
}
export function getBody() {
  return document.getElementsByTagName('BODY')[0];
}
export function getMainLogo() {
  const h1 = document.getElementsByTagName('H1')[0];
  return h1.getElementsByClassName('header-logo')[0];
}
export function renderResult(html) {
  const resultNode = document.getElementById('jamon-result');
  if (resultNode) {
    resultNode.innerHTML = html;
  }
}

export function getModalEl() {
  return document.getElementById('info-modal');
}
export function getOpenModalLink() {
  return document.getElementById('info-link');
}

export function getAllInputs() {
  return document.getElementsByTagName('INPUT');
}
