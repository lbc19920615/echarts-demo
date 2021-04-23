import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('simple-dialog')
export class SimpleDialog extends LitElement {
  static styles = css``;

  @property({ type: Boolean, attribute: 'open', reflect: true  })
  open = false;

  render() {
    return html`<div part="wrapper" class="wrapper">
      <div part="header"><div part="close" @click="${this.onClickCloseBtn}" >x</div></div>
    <div part="body"><slot></slot></div>
    </div>`;
  }

  onClickCloseBtn() {
    this.open = false
    // console.log(' this.open = !this.open')
    let myEvent = new CustomEvent('closed', {
      detail: { },
      bubbles: true,
      composed: true });
    this.dispatchEvent(myEvent);
  }
}
