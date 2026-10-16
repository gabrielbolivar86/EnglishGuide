// Carga dinámicamente students/<slug>/lessons/<id>.js y lo muestra.
// Solo si la lección está desbloqueada (o en vista previa del profesor).
import { html } from '../../lib/preact.js';
import { Card, Loading, ErrorState, EmptyState } from '../../components/ui/index.js';
import { useAsync } from '../../hooks/useAsync.js';
import { loadLesson } from '../../services/plans.js';
import { Link } from '../../navigation/router.js';
import { LessonContext } from '../../components/lesson/LessonContext.js';

export function LessonScreen({ estudiante, lessonId, isUnlocked, isPreview }) {
  const allowed = isUnlocked(lessonId);
  const { data: mod, error, loading } = useAsync(
    () => (allowed ? loadLesson(estudiante.slug, lessonId) : null), [estudiante.slug, lessonId, allowed]);

  let body;
  if (!allowed) {
    body = html`<${Card}><${EmptyState} icon="🔒" title="Esta lección todavía no está disponible">
      Tu profesor la desbloqueará pronto.<//><//>`;
  } else if (loading) body = html`<${Loading} text="Cargando lección…" />`;
  else if (error) body = html`<${ErrorState} error=${new Error('No se pudo cargar la lección: ' + error.message)} />`;
  else {
    const Lesson = mod.default;
    body = html`
      <${LessonContext.Provider} value=${{ slug: estudiante.slug, lessonId }}>
        <${Lesson} />
      <//>`;
  }

  return html`
    <div class="lesson">
      <div class="lesson-topbar">
        <${Link} to="/" class="btn-back">← Volver a mi guía<//>
        ${isPreview && !estudiante.lecciones.includes(lessonId)
          ? html`<span class="badge badge-warn">Vista previa · oculta para el estudiante</span>` : null}
      </div>
      ${body}
    </div>`;
}
