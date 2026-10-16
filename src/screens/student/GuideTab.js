// Pestaña "Mi Guía": Meet, meta del mes y semanas con sus clases.
import { html } from '../../lib/preact.js';
import { Loading, ErrorState } from '../../components/ui/index.js';
import { MeetCard, GoalCard, WeekSection } from '../../components/student/index.js';
import { useAsync } from '../../hooks/useAsync.js';
import { loadPlan } from '../../services/plans.js';

export function GuideTab({ estudiante, isUnlocked }) {
  const { data: plan, error, loading, reload } = useAsync(() => loadPlan(estudiante.slug), [estudiante.slug]);

  return html`
    <${MeetCard} meetLink=${estudiante.meetLink} bloques=${estudiante.bloques} />
    ${loading ? html`<${Loading} text="Cargando tu guía…" />`
      : error ? html`<${ErrorState} error=${estudiante.slug ? error : new Error('Tu guía todavía no está lista. Vuelve pronto.')} onRetry=${estudiante.slug ? reload : null} />`
      : html`
        <${GoalCard} meta=${plan.meta} />
        ${plan.semanas.map((s, i) => html`<${WeekSection} key=${i} semana=${s} isUnlocked=${isUnlocked} />`)}`}`;
}
