// Lista de clases del plan del estudiante con interruptor para desbloquear.
// Las lecciones se escriben por adelantado en el repo; aquí decides cuándo
// las ve el estudiante (se guarda en el Sheet, sin necesidad de git push).
import { html, useState } from '../../lib/preact.js';
import { Card, Loading, ErrorState, useToast } from '../ui/index.js';
import { useAsync } from '../../hooks/useAsync.js';
import { loadPlan, flattenClasses } from '../../services/plans.js';
import { teacherApi } from '../../services/api.js';
import { siteRoot } from '../../utils/paths.js';

export function LessonUnlockList({ token, student, onChanged, onAuthError }) {
  const toast = useToast();
  const [pending, setPending] = useState(null);
  const { data: plan, error, loading, reload } = useAsync(() => loadPlan(student.slug), [student.slug]);

  async function toggle(id, value) {
    setPending(id);
    try {
      const res = await teacherApi.setLeccion(token, student.codigo, id, value);
      onChanged(res.lecciones);
      toast(value ? 'Lección desbloqueada ✓' : 'Lección ocultada');
    } catch (e) {
      if (!onAuthError(e)) toast(e.message, 'error');
    } finally { setPending(null); }
  }

  const preview = (id) => `${siteRoot()}student/index.html?preview=${student.codigo}#/leccion/${id}`;

  let body;
  if (!student.slug) body = html`<p class="muted">Asigna una carpeta de guía en “Datos del estudiante”.</p>`;
  else if (loading) body = html`<${Loading} />`;
  else if (error) body = html`<${ErrorState} error=${error} onRetry=${reload} />`;
  else {
    const clases = flattenClasses(plan);
    body = html`
      <ul class="unlock-list">
        ${clases.map((c) => {
          const on = c.leccion && student.lecciones.includes(c.leccion);
          return html`
            <li class=${'unlock-item' + (on ? ' on' : '')}>
              <div class="unlock-info">
                <span class="unlock-num">Clase ${c.numero}</span>
                <strong>${c.tema}</strong>
                <span class="muted small">Semana ${c.semana} · ${c.dia}</span>
              </div>
              ${c.leccion ? html`
                <div class="unlock-actions">
                  <a class="btn btn-ghost" href=${preview(c.leccion)} target="_blank" rel="noopener">Vista previa</a>
                  <label class="toggle" title=${on ? 'Visible para el estudiante' : 'Oculta'}>
                    <input type="checkbox" checked=${on} disabled=${pending === c.leccion}
                      onChange=${(e) => toggle(c.leccion, e.currentTarget.checked)} />
                    <span class="toggle-track"><span class="toggle-thumb"></span></span>
                    <span class="toggle-text">${on ? 'Visible' : 'Oculta'}</span>
                  </label>
                </div>`
              : html`<span class="badge badge-muted">Sin contenido aún</span>`}
            </li>`;
        })}
      </ul>`;
  }

  return html`<${Card} title="Lecciones" icon="📚">${body}<//>`;
}
