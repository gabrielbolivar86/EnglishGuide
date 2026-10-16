import { html } from '../../lib/preact.js';
import { Badge, QuizStatusBadge } from '../ui/index.js';
import { Link } from '../../navigation/router.js';
import { initials } from '../../utils/format.js';
import { describeSchedule } from '../../utils/schedule.js';
import { PROFILES } from '../../data/profiles.js';

export function StudentCard({ student: s }) {
  return html`
    <article class=${'student-card' + (s.activo ? '' : ' is-inactive')}>
      <div class="student-card-top">
        <div class="avatar">${initials(s.nombre)}</div>
        <div class="student-card-id">
          <h3>${s.nombre}</h3>
          <span class="code-pill" title="Código de acceso">${s.codigo}</span>
        </div>
        ${s.activo ? null : html`<${Badge} tone="danger">Inactivo<//>`}
      </div>

      <dl class="meta-list">
        <div><dt>Horario</dt><dd>${describeSchedule(s.bloques)}</dd></div>
        <div><dt>Lecciones visibles</dt><dd>${s.lecciones.length}</dd></div>
      </dl>

      <div class="badge-row">
        <${QuizStatusBadge} estado=${s.estadoCuestionario} />
        ${s.perfilDominante ? html`
          <${Badge} tone=${'perfil-' + s.perfilDominante}>${PROFILES[s.perfilDominante].nombre}<//>` : null}
      </div>

      <${Link} to=${'/estudiante/' + s.codigo} class="btn btn-primary btn-block">Gestionar →<//>
    </article>`;
}
