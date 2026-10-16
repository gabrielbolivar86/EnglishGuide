import { html } from '../../lib/preact.js';
import { describeSchedule } from '../../utils/schedule.js';

export function MeetCard({ meetLink, bloques }) {
  return html`
    <section class="card meet-card">
      <div>
        <span class="eyebrow">Clase en vivo</span>
        <h2>Google Meet</h2>
        <p class="muted">${describeSchedule(bloques, { largo: true })}</p>
      </div>
      ${meetLink
        ? html`<a class="btn btn-primary btn-lg" href=${meetLink} target="_blank" rel="noopener noreferrer">🎥 Entrar a la clase</a>`
        : html`<span class="muted small">Tu profesor aún no configuró el enlace.</span>`}
    </section>`;
}
