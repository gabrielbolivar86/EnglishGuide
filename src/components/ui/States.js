import { html } from '../../lib/preact.js';

export function Loading({ text = 'Cargando…' }) {
  return html`<div class="state"><span class="spinner"></span> ${text}</div>`;
}

export function ErrorState({ error, onRetry }) {
  return html`
    <div class="state state-error">
      <p>⚠️ ${error?.message || String(error)}</p>
      ${onRetry ? html`<button class="btn" onClick=${onRetry}>Reintentar</button>` : null}
    </div>`;
}

export function EmptyState({ icon = '📭', title, children }) {
  return html`
    <div class="state">
      <div class="state-icon">${icon}</div>
      <strong>${title}</strong>
      ${children ? html`<div class="muted">${children}</div>` : null}
    </div>`;
}
