import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('simple-dialog')
export class SimpleDialog extends LitElement {
  static styles = css`p { color: blue }`;

  @property({ type: Boolean, attribute: 'open' })
  open = false;

  render() {
    return html`<div part="wrapper"><div part="close" @click="${this.onClickCloseBtn}" >x</div> 
    Hello, ${this.open ? 'open' : 'closed'}!<slot></slot></div>`;
  }

  onClickCloseBtn() {
    this.open = !this.open
    console.log(' this.open = !this.open')
  }
}