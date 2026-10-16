// Ficha de un estudiante: datos, lecciones, perfil y zona de riesgo.
import { html } from '../../lib/preact.js';
import { Button, Card, Badge, QuizStatusBadge, EmptyState, useToast } from '../../components/ui/index.js';
import { StudentForm, LessonUnlockList, ProfilePanel } from '../../components/teacher/index.js';
import { teacherApi } from '../../services/api.js';
import { navigate, Link } from '../../navigation/router.js';
import { initials } from '../../utils/format.js';
import { describeSchedule } from '../../utils/schedule.js';
import { siteRoot } from '../../utils/paths.js';

export function StudentDetailScreen({ token, codigo, data, setData, patchStudent, onAuthError }) {
  const toast = useToast();
  const s = data.estudiantes.find((x) => x.codigo === codigo);
  if (!s) {
    return html`<div class="page"><${Card}>
      <${EmptyState} icon="🔎" title="Estudiante no encontrado"><${Link} to="/">Volver al panel<//><//>
    <//></div>`;
  }

  const guard = async (fn, okMsg) => {
    try { await fn(); if (okMsg) toast(okMsg); }
    catch (e) { if (!onAuthError(e)) { toast(e.message, 'error'); throw e; } }
  };

  const guardar = (datos) => guard(async () => {
    await teacherApi.actualizar(token, s.codigo, datos);
    patchStudent(s.codigo, datos);
  }, 'Cambios guardados ✓');

  const archivar = () => {
    if (!confirm('¿Archivar el cuestionario? Las respuestas se copian a la hoja "Archivo" y el estudiante podrá llenarlo de nuevo.')) return;
    guard(async () => { await teacherApi.archivar(token, s.codigo); await setData(); }, 'Intento archivado').catch(() => {});
  };

  const borrar = () => {
    if (!confirm(`¿BORRAR a ${s.nombre}? Se eliminan su registro, su código y sus respuestas. No se puede deshacer.`)) return;
    guard(async () => { await teacherApi.borrar(token, s.codigo); navigate('/'); await setData(); }, 'Estudiante eliminado').catch(() => {});
  };

  const copiar = () => navigator.clipboard?.writeText(s.codigo).then(() => toast('Código copiado'));

  return html`
    <div class="page">
      <${Link} to="/" class="back-link">← Volver al panel<//>

      <header class="detail-head card">
        <div class="avatar avatar-lg">${initials(s.nombre)}</div>
        <div class="detail-id">
          <h1>${s.nombre}</h1>
          <p class="muted">${describeSchedule(s.bloques, { largo: true })}</p>
          <div class="badge-row">
            <button class="code-pill code-pill-btn" onClick=${copiar} title="Copiar código">🔑 ${s.codigo}</button>
            <${QuizStatusBadge} estado=${s.estadoCuestionario} />
            ${s.activo ? null : html`<${Badge} tone="danger">Inactivo<//>`}
          </div>
        </div>
        <div class="detail-actions">
          <${Button} href=${`${siteRoot()}student/index.html?preview=${s.codigo}`} target="_blank" rel="noopener">👁️ Ver como estudiante<//>
          ${s.meetLink ? html`<${Button} href=${s.meetLink} target="_blank" rel="noopener">🎥 Meet<//>` : null}
        </div>
      </header>

      <div class="detail-grid">
        <div class="detail-col">
          <${LessonUnlockList} token=${token} student=${s} onAuthError=${onAuthError}
            onChanged=${(lecciones) => patchStudent(s.codigo, { lecciones })} />
          <${ProfilePanel} token=${token} student=${s} onAuthError=${onAuthError} />
        </div>
        <div class="detail-col">
          <${Card} title="Datos del estudiante" icon="✏️">
            <${StudentForm} key=${s.codigo} initial=${s} showActive onSubmit=${guardar} submitText="Guardar cambios" />
          <//>
          <${Card} title="Zona de riesgo" icon="⚠️" class="danger-zone">
            <p class="small muted"><strong>Archivar cuestionario:</strong> guarda una copia de las respuestas y deja el cuestionario en “Pendiente” para que lo vuelva a llenar.</p>
            <${Button} onClick=${archivar} disabled=${s.estadoCuestionario === 'Pendiente'}>📦 Archivar y reiniciar cuestionario<//>
            <p class="small muted"><strong>Borrar estudiante:</strong> elimina su registro, código y respuestas de forma permanente. Su carpeta de guía en el repo no se toca.</p>
            <${Button} variant="danger" onClick=${borrar}>🗑️ Borrar estudiante<//>
          <//>
        </div>
      </div>
    </div>`;
}
