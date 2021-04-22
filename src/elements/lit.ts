import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  static styles = css`p { color: blue }`;

  @property()
  name = 'Somebody';

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

@customElement('fui-section')
export class FuiSectionElement extends LitElement {
  render() {
    return html`<div part="fui-section"><slot></slot></div>`;
  }
}