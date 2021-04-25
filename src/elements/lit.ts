import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import './dialog/dialog.ts'

@customElement('fui-section')
export class FuiSectionElement extends LitElement {
  render() {
    return html`<div part="fui-section"><slot></slot></div>`;
  }
}
