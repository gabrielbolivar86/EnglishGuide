import { html } from '../../lib/preact.js';

export function ProgressBar({ value }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return html`
    <div class="progress" role="progressbar" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100">
      <div class="progress-fill" style=${{ width: pct + '%' }}></div>
    </div>`;
}
