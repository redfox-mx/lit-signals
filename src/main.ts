import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js'
import { signal } from './signal'
import { watch } from './watch'
import { createComputed } from '@angular/core/primitives/signals'

let renderCount = 0;
const signalCount = signal(0);

@customElement('signal-demo')
export class SignalDemo extends LitElement {

  @property({ type: Number })
  count = 0

  incrementProperty() {
    this.count++;
  }

  incrementSignal() {
    signalCount.update(count => count + 1);
  }

  isEven = createComputed(() => signalCount() % 2 === 0)

  protected render(): unknown {
    renderCount++;
    return html`
    <div>
      Render count: ${renderCount}
      <div>
        <button @click="${this.incrementProperty}">Property: ${this.count}</button>
        <button @click="${this.incrementSignal}">Signal: ${watch(signalCount)}</button>
        <p>Computed is even ${watch(this.isEven)}</p>
      </div>
    </div>
    `
  }
}