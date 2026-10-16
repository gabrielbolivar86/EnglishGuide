// Pantalla principal del docente: estudiantes + disponibilidad.
import { html, useState } from '../../lib/preact.js';
import { Button, Card, Modal, EmptyState, useToast } from '../../components/ui/index.js';
import { StudentCard, ScheduleGrid, StudentForm } from '../../components/teacher/index.js';
import { teacherApi } from '../../services/api.js';
import { navigate } from '../../navigation/router.js';

export function DashboardScreen({ token, data, setData, onAuthError }) {
  const toast = useToast();
  const [creating, setCreating] = useState(false);
  const [busyCell, setBusyCell] = useState(null);
  const [filter, setFilter] = useState('activos');

  const lista = data.estudiantes.filter((s) => filter === 'todos' || s.activo);
  const activos = data.estudiantes.filter((s) => s.activo).length;

  async function crear(datos) {
    try {
      const res = await teacherApi.crear(token, datos);
      setCreating(false);
      toast(`Estudiante creado. Código: ${res.codigo}`);
      await setData();
      navigate('/estudiante/' + res.codigo);
    } catch (e) { if (!onAuthError(e)) throw e; }
  }

  async function toggleBlock(dia, bloque) {
    const key = dia + '-' + bloque;
    setBusyCell(key);
    try { await teacherApi.toggleBloqueo(token, dia, bloque); await setData(); }
    catch (e) { if (!onAuthError(e)) toast(e.message, 'error'); }
    finally { setBusyCell(null); }
  }

  return html`
    <div class="page">
      <${Card} title="Estudiantes" icon="👥"
        actions=${html`
          <select class="select select-sm" value=${filter} onChange=${(e) => setFilter(e.currentTarget.value)} aria-label="Filtro">
            <option value="activos">Activos (${activos})</option>
            <option value="todos">Todos (${data.estudiantes.length})</option>
          </select>
          <${Button} variant="primary" onClick=${() => setCreating(true)}>+ Nuevo estudiante<//>`}>
        ${lista.length
          ? html`<div class="student-grid">${lista.map((s) => html`<${StudentCard} key=${s.codigo} student=${s} />`)}</div>`
          : html`<${EmptyState} icon="🧑‍🎓" title="Todavía no hay estudiantes">Crea el primero con “Nuevo estudiante”.<//>`}
      <//>

      <${Card} title="Disponibilidad de horarios" icon="🗓️">
        <${ScheduleGrid} students=${data.estudiantes} blocks=${data.bloqueos} onToggle=${toggleBlock} busyCell=${busyCell} />
      <//>

      <${Modal} open=${creating} title="Nuevo estudiante" onClose=${() => setCreating(false)}>
        <${StudentForm} submitText="Crear y generar código" onSubmit=${crear} />
      <//>
    </div>`;
}
