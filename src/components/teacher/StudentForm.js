// Formulario de alta/edición de estudiante (nombre, carpeta, horario, Meet).
import { html, useState } from '../../lib/preact.js';
import { Button, Field } from '../ui/index.js';
import { BlockPicker } from './BlockPicker.js';
import { slugify } from '../../utils/format.js';
import { describeSchedule } from '../../utils/schedule.js';
import { CONFIG } from '../../config.js';

export function StudentForm({ initial = {}, submitText = 'Guardar', onSubmit, showActive }) {
  const [f, setF] = useState({
    nombre: initial.nombre || '',
    slug: initial.slug || '',
    bloques: initial.bloques || '',
    meetLink: initial.meetLink || '',
    notas: initial.notas || '',
    activo: initial.activo !== false,
  });
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!f.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    setSaving(true); setError('');
    try { await onSubmit({ ...f, slug: slugify(f.slug || f.nombre) }); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return html`
    <form onSubmit=${submit} class="student-form">
      <${Field} label="Nombre completo" value=${f.nombre} required
        onInput=${(v) => setF((p) => ({ ...p, nombre: v, slug: slugTouched ? p.slug : slugify(v) }))} />
      <${Field} label="Carpeta de la guía" value=${f.slug}
        help=${`Contenido en ${CONFIG.STUDENTS_DIR}/${slugify(f.slug || f.nombre) || '…'}/`}
        onInput=${(v) => { setSlugTouched(true); set('slug')(v); }} />
      <div class="field">
        <span class="field-label">Horario de clases</span>
        <${BlockPicker} value=${f.bloques} onChange=${set('bloques')} />
        <div class="field-help">${describeSchedule(f.bloques, { largo: true })}</div>
      </div>
      <${Field} label="Link de Google Meet" type="url" placeholder="https://meet.google.com/…"
        value=${f.meetLink} onInput=${set('meetLink')} />
      <${Field} label="Notas privadas" multiline rows="3" value=${f.notas} onInput=${set('notas')} />
      ${showActive ? html`
        <label class="switch-row">
          <input type="checkbox" checked=${f.activo} onChange=${(e) => set('activo')(e.currentTarget.checked)} />
          <span>Acceso activo (si lo desactivas, el código deja de funcionar)</span>
        </label>` : null}
      <div class="error-text">${error}</div>
      <${Button} variant="primary" type="submit" loading=${saving}>${submitText}<//>
    </form>`;
}
