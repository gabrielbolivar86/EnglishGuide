import { html } from '../../lib/preact.js';

export function Card({ title, icon, actions, class: extra, children }) {
  return html`
    <section class=${'card ' + (extra || '')}>
      ${title ? html`
        <header class="card-head">
          <h2 class="card-title">${icon ? html`<span aria-hidden="true">${icon}</span>` : null} ${title}</h2>
          ${actions ? html`<div class="card-actions">${actions}</div>` : null}
        </header>` : null}
      ${children}
    </section>`;
}
