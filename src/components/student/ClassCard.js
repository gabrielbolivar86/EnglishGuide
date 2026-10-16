import { html } from '../../lib/preact.js';
import { Link } from '../../navigation/router.js';

export function ClassCard({ clase, unlocked }) {
  return html`
    <article class=${'class-card' + (unlocked ? ' is-open' : '')}>
      <div>
        <span class="class-num">Clase ${clase.numero}${clase.dia ? ' · ' + clase.dia : ''}</span>
        <h3>${clase.tema}</h3>
        <p>${clase.descripcion}</p>
      </div>
      ${unlocked
        ? html`<${Link} to=${'/leccion/' + clase.leccion} class="btn btn-primary btn-block">Ver lección →<//>`
        : html`<span class="locked">🔒 Lección pendiente</span>`}
    </article>`;
}
