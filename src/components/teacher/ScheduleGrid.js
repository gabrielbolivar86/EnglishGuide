// Tabla semanal de disponibilidad. Se calcula a partir de:
//   - bloques de cada estudiante (Estudiantes.Bloques)
//   - bloqueos del docente (hoja Bloqueos)
// Clic en una celda libre → la bloquea. Clic en una bloqueada → la libera.
import { html } from '../../lib/preact.js';
import { SCHEDULE } from '../../config.js';
import { parseBloques } from '../../utils/schedule.js';

export function ScheduleGrid({ students, blocks, onToggle, busyCell }) {
  const ocupado = {};
  students.filter((s) => s.activo).forEach((s) =>
    parseBloques(s.bloques).forEach((k) => { (ocupado[k] ||= []).push(s.nombre); }));
  const bloqueado = {};
  blocks.forEach((b) => { bloqueado[b.dia + '-' + b.bloque] = b.motivo || 'Ocupado'; });

  return html`
    <div class="table-scroll">
      <table class="schedule">
        <thead>
          <tr>
            <th>Bloque</th>
            ${SCHEDULE.dias.map((d) => html`<th>${d.largo}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${SCHEDULE.bloques.map((b) => html`
            <tr>
              <th scope="row">
                <span class="block-name">Bloque ${b.id}</span>
                <span class="block-time">${b.inicio} - ${b.fin}</span>
              </th>
              ${SCHEDULE.dias.map((d) => {
                const key = d.id + '-' + b.id;
                const busy = busyCell === key;
                if (ocupado[key]) {
                  return html`<td><div class=${'slot slot-class' + (ocupado[key].length > 1 ? ' slot-conflict' : '')}
                    title=${ocupado[key].length > 1 ? 'Conflicto de horario' : 'Clase reservada'}>${ocupado[key].join(' / ')}</div></td>`;
                }
                if (bloqueado[key]) {
                  return html`<td><button class="slot slot-blocked" disabled=${busy}
                    title="Clic para liberar" onClick=${() => onToggle(d.id, b.id)}>${busy ? '…' : bloqueado[key]}</button></td>`;
                }
                return html`<td><button class="slot slot-free" disabled=${busy}
                  title="Clic para marcar como no disponible" onClick=${() => onToggle(d.id, b.id)}>${busy ? '…' : 'Disponible'}</button></td>`;
              })}
            </tr>`)}
        </tbody>
      </table>
    </div>
    <div class="legend">
      <span><i class="dot dot-free"></i> Disponible</span>
      <span><i class="dot dot-class"></i> Clase reservada</span>
      <span><i class="dot dot-blocked"></i> No disponible (clic para cambiar)</span>
    </div>`;
}
