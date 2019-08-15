/**
 * A modal's simple implementation.
 */

import {
  addClass,
  removeClass,
} from '../utils';

const bodyClass = 'is-showing-modal';
const modalClass = 'is-visible';

export default class {
  constructor(el, body) {
    this.el = el;
    this.body = body;

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.bind();
  }

  open() {
    addClass(this.body, bodyClass);
    addClass(this.el, modalClass);
  }

  close() {
    removeClass(this.body, bodyClass);
    removeClass(this.el, modalClass);
  }

  bind() {
    const closeButtons = this.el.getElementsByClassName('modal-close');
    for (let i = 0; i < closeButtons.length; i++) {
      closeButtons[i].addEventListener('click', this.close);
    }
  }
}
