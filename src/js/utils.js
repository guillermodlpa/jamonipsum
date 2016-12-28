
export function hasClass(el, classes) {
  return (new RegExp(`\b${classes}\b`)).test(el.className);
}

export function removeClass(el, classes) {
  el.className = (el.className || '').replace(classes, '').trim();
}

export function addClass(el, classes) {
  if (!hasClass(el, classes)) {
    el.className = `${el.className || ''} ${classes}`;
  }
}

const rotateClass = 'is-rotating';

export function rotate(el) {
  if (!el || hasClass(el, rotateClass)) {
    return;
  }
  addClass(el, rotateClass);
  setTimeout(() => {
    removeClass(el, rotateClass);
  }, 500);
}

export function mandatoryParameter() {
  throw new Error('Missing parameter');
}
