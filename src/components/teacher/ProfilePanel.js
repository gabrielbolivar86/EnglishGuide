// Resultado del cuestionario de Perfil de Aprendizaje de un estudiante.
import { html } from '../../lib/preact.js';
import { Card, Loading, ErrorState, EmptyState } from '../ui/index.js';
import { RadarChart } from './RadarChart.js';
import { useAsync } from '../../hooks/useAsync.js';
import { teacherApi } from '../../services/api.js';
import { formatTime } from '../../utils/format.js';
import { PROFILES, OPEN_ANSWER_LABELS } from '../../data/profiles.js';

export function ProfilePanel({ token, student, onAuthError }) {
  const tieneRespuestas = student.estadoCuestionario !== 'Pendiente';
  const { data, error, loading, reload } = useAsync(
    () => tieneRespuestas ? teacherApi.perfil(token, student.codigo).catch((e) => { onAuthError(e); throw e; }) : null,
    [student.codigo, student.estadoCuestionario]);

  if (!tieneRespuestas) {
    return html`<${Card} title="Perfil de aprendizaje" icon="🧭">
      <${EmptyState} icon="📝" title="Aún no empezó el cuestionario">
        Comparte su código <strong>${student.codigo}</strong>: lo encuentra en la pestaña “Perfil” de su portal.
      <//>
    <//>`;
  }
  if (loading) return html`<${Card} title="Perfil de aprendizaje" icon="🧭"><${Loading} /><//>`;
  if (error) return html`<${Card} title="Perfil de aprendizaje" icon="🧭"><${ErrorState} error=${error} onRetry=${reload} /><//>`;

  const p = data.perfil;
  return html`
    <${Card} title="Perfil de aprendizaje" icon="🧭"
      actions=${student.estadoCuestionario !== 'Completado' ? html`<span class="badge badge-warn">En progreso (parcial)</span>` : null}>
      <div class="profile-grid">
        <div>
          <${RadarChart} labels=${['Visual', 'Práctico', 'Analítico']} values=${[p.conteo.V, p.conteo.P, p.conteo.A]} />
          <p class="center"><strong>${PROFILES[p.perfilDominante.letra].nombre}</strong></p>
          <p class="muted small">${p.perfilDominante.info.descripcion}</p>
          <p class="muted small">Tiempo invertido: ${formatTime(p.tiempoTotalSegundos)}</p>
        </div>
        <div>
          <h3 class="sub-title">Dinámica y metacognición</h3>
          ${Object.values(p.seccion3).filter(Boolean).map((it) => html`
            <div class="insight"><strong>${it.titulo}</strong><span>${it.detalle}</span></div>`)}
        </div>
      </div>
      <h3 class="sub-title">Respuestas abiertas</h3>
      ${Object.entries(OPEN_ANSWER_LABELS).map(([k, label]) => html`
        <div class="open-answer"><strong>${label}</strong><p>${p.respuestasAbiertas[k] || '—'}</p></div>`)}
    <//>`;
}
