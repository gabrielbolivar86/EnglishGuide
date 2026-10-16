import { html } from '../../lib/preact.js';
import { ClassCard } from './ClassCard.js';

export function WeekSection({ semana, isUnlocked }) {
  return html`
    <section class="card week">
      <h2 class="week-title">${semana.titulo}</h2>
      <div class="class-grid">
        ${(semana.clases || []).map((c) => html`
          <${ClassCard} key=${c.numero} clase=${c} unlocked=${!!c.leccion && isUnlocked(c.leccion)} />`)}
      </div>
    </section>`;
}
