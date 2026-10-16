// Bloques interactivos de las lecciones
import { html, useContext, useState } from '../../lib/preact.js';
import { LessonContext } from './LessonContext.js';
import { local, KEYS } from '../../services/storage.js';

/** Checkbox de progreso que se recuerda en el dispositivo: <Check>¡Entendido!<//> */
export function Check({ id, children, centered }) {
  const { slug, lessonId } = useContext(LessonContext);
  const key = KEYS.lessonChecks(slug, lessonId);
  const checkId = id || String(children).slice(0, 60);
  const [on, setOn] = useState(() => !!(local.get(key, {}) || {})[checkId]);
  const toggle = (e) => {
    const v = e.currentTarget.checked;
    setOn(v);
    local.set(key, { ...(local.get(key, {}) || {}), [checkId]: v });
  };
  return html`
    <label class=${'checkbox-container' + (centered ? ' centered' : '')}>
      <input type="checkbox" checked=${on} onChange=${toggle} />
      <span>${children}</span>
    </label>`;
}

/** Línea de escritura: <WriteLine label="1. Primera acción" placeholder="Ej: …" /> */
export function WriteLine({ label, placeholder }) {
  return html`<div class="field"><label>${label}<input type="text" placeholder=${placeholder} /></label></div>`;
}

/** Área de escritura libre */
export function WriteBox({ placeholder, rows = 4 }) {
  return html`<textarea rows=${rows} placeholder=${placeholder}></textarea>`;
}

function Feedback({ result }) {
  if (!result) return null;
  return html`<div class=${'feedback-message show ' + (result.ok ? 'feedback-success' : 'feedback-error')}>${result.text}</div>`;
}

/**
 * Elegir la palabra correcta:
 * <WordPicker prompt="Haz clic en el Sujeto" options=${['Then','I','eat']} answer="I" />
 */
export function WordPicker({ prompt, options, answer }) {
  const [result, setResult] = useState(null);
  const pick = (w) => setResult(w === answer
    ? { ok: true, text: `✔ ¡Correcto! "${w}" es la opción adecuada.` }
    : { ok: false, text: `✖ Inténtalo de nuevo. "${w}" no corresponde a esta categoría.` });
  return html`
    <div class="word-picker">
      ${prompt ? html`<p>${prompt}</p>` : null}
      <div class="word-selector">
        ${options.map((w) => html`<button type="button" class="word-btn" onClick=${() => pick(w)}>${w}</button>`)}
      </div>
      <${Feedback} result=${result} />
    </div>`;
}

/**
 * Pregunta de opción múltiple con corrección inmediata:
 * <Choice question="¿…?" options=${['A) …','B) …']} answer=${0} />
 */
export function Choice({ question, options, answer }) {
  const [picked, setPicked] = useState(null);
  const ok = picked === answer;
  return html`
    <div class="choice">
      ${question ? html`<p><strong>${question}</strong></p>` : null}
      ${options.map((o, i) => html`
        <div role="button" tabindex="0"
          class=${'interactive-option' + (picked === i ? (ok ? ' correct' : ' wrong') : '')}
          onClick=${() => setPicked(i)} onKeyDown=${(e) => e.key === 'Enter' && setPicked(i)}>${o}</div>`)}
      <${Feedback} result=${picked == null ? null : ok
        ? { ok: true, text: '✔ ¡Excelente! Respuesta correcta.' }
        : { ok: false, text: '✖ Respuesta incorrecta. Lee con atención el texto e inténtalo de nuevo.' }} />
    </div>`;
}

/** Opción múltiple sin corrección (para resolver en clase con el profesor) */
export function RadioQuestion({ name, question, options }) {
  return html`
    <div>
      ${question ? html`<p>${question}</p>` : null}
      <div class="radio-list">
        ${options.map((o) => html`<label><input type="radio" name=${name} /> ${o}</label>`)}
      </div>
    </div>`;
}
