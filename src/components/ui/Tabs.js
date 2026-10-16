import { html } from '../../lib/preact.js';

/** <Tabs items=${[{id, label}]} value=${id} onChange=${fn} /> */
export function Tabs({ items, value, onChange }) {
  return html`
    <div class="tabs" role="tablist">
      ${items.map((it) => html`
        <button role="tab" class="tab" aria-selected=${it.id === value} onClick=${() => onChange(it.id)}>
          ${it.icon ? html`<span aria-hidden="true">${it.icon} </span>` : null}${it.label}
        </button>`)}
    </div>`;
}
