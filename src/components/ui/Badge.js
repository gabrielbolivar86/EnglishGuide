import { html } from '../../lib/preact.js';

/** <Badge tone="ok|warn|danger|muted|perfil-V">Texto<//> */
export function Badge({ tone = 'muted', title, children }) {
  return html`<span class=${'badge badge-' + tone} title=${title}>${children}</span>`;
}

export function QuizStatusBadge({ estado }) {
  const tone = { 'Completado': 'ok', 'En Progreso': 'warn' }[estado] || 'muted';
  return html`<${Badge} tone=${tone}>Cuestionario: ${estado || 'Pendiente'}<//>`;
}
