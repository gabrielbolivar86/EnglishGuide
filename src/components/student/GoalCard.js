import { html } from '../../lib/preact.js';

export function GoalCard({ meta }) {
  if (!meta) return null;
  return html`
    <section class="card goal-card">
      <span class="eyebrow">🎯 Meta general del mes</span>
      <p>“${meta}”</p>
    </section>`;
}
