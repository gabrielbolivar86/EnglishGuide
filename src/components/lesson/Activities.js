// ==========================================================
// ACTIVIDADES INTERACTIVAS AVANZADAS
// ==========================================================
import { html, useEffect, useRef, useState } from '../../lib/preact.js';
import { Hl } from './Grammar.js';

const PLURAL_SUBJECTS = ['I', 'We', 'They', 'You'];

/** Conjuga el verbo en Presente Simple según el sujeto (he/she/it → +s/es/ies) */
export function conjugate(verb, subject) {
  if (PLURAL_SUBJECTS.includes(subject)) return verb;
  const words = verb.split(' ');
  let first = words[0];
  if (/(ch|sh|ss|x|o)$/.test(first)) first += 'es';
  else if (/[^aeiou]y$/.test(first)) first = first.slice(0, -1) + 'ies';
  else first += 's';
  words[0] = first;
  return words.join(' ');
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Máquina de combinar oraciones. El verbo y el predicado van SIEMPRE
 * emparejados para que toda combinación tenga sentido; solo el sujeto varía
 * y el verbo se conjuga automáticamente.
 *
 * <SentenceSlot title="🍳 Familia 1: Comida"
 *   subjects=${['I', 'My mother']}
 *   pairs=${[['eat', 'breakfast at 8:00 AM'], ['cook', 'lunch for the family']]} />
 */
export function SentenceSlot({ title, subjects, pairs, initial }) {
  const [s, setS] = useState(() => initial || { subject: subjects[0], verb: pairs[0][0], complement: pairs[0][1] });
  const [spun, setSpun] = useState(false);
  const spin = () => {
    const subject = pick(subjects);
    const [verb, complement] = pick(pairs);
    setS({ subject, verb: conjugate(verb, subject), complement });
    setSpun(true);
  };
  return html`
    <div class="slot-family">
      ${title ? html`<h4>${title}</h4>` : null}
      <div class="reel-row">
        <div class="reel-window hl-subject">${s.subject}</div>
        <div class="reel-window hl-verb">${s.verb}</div>
        <div class="reel-window hl-complement">${s.complement}</div>
      </div>
      <button type="button" class="spin-btn" onClick=${spin}>🎰 Girar</button>
      <div class="result-sentence">
        ${spun ? html`<${Hl} t="subject">${s.subject}<//> <${Hl} t="verb">${s.verb}<//> <${Hl} t="complement">${s.complement}<//>.` : null}
      </div>
    </div>`;
}

const PART_QUESTIONS = {
  subject: ['¿Cuál es el Sujeto?', '(¿Quién realiza la acción?)'],
  verb: ['¿Cuál es el Verbo?', '(¿Qué acción realiza?)'],
  complement: ['¿Cuál es el Predicado?', '(¿Qué detalle o lugar agrega?)'],
};
const PART_HINTS = {
  subject: '❓ ¿Quién es la persona que realiza la acción en esta oración?',
  verb: '❓ Lee la parte seleccionada: ¿Qué acción (palabra verde) realiza la persona? ¿Dónde está el verbo principal?',
  complement: '❓ ¿Esa palabra indica una acción o es el detalle/lugar de la oración?',
};

function PartQuestion({ ask, parts, showHint }) {
  const [result, setResult] = useState(null);
  const [q, hint] = PART_QUESTIONS[ask];
  return html`
    <div class="part-question">
      <p><strong>${q}</strong>${showHint ? ' ' + hint : ''}</p>
      <div class="word-selector">
        ${parts.map(([t, text]) => html`
          <button type="button" class="word-btn" onClick=${() => setResult(t === ask
            ? { ok: true, text: '✔ ¡Excelente! Alineaste correctamente la acción con su sujeto.' }
            : { ok: false, text: PART_HINTS[t] })}>${text}</button>`)}
      </div>
      ${result ? html`<div class=${'feedback-message show ' + (result.ok ? 'feedback-success' : 'feedback-error')}>${result.text}</div>` : null}
    </div>`;
}

/**
 * Identificar Sujeto, Verbo y Predicado de una oración (3 preguntas):
 * <PartsQuiz label="Oración 1" parts=${[['subject','My mother'],['verb','cooks'],['complement','dinner']]} hints />
 */
export function PartsQuiz({ label, parts, note, hints, ask = ['subject', 'verb', 'complement'] }) {
  const sentence = parts.map((p) => p[1]).join(' ') + '.';
  return html`
    <div class="exercise-box">
      <p class="sentence">${label ? label + ': ' : ''}<strong>"${sentence}"</strong></p>
      ${note ? html`<p class="exercise-note">${note}</p>` : null}
      ${ask.map((a) => html`<${PartQuestion} key=${a} ask=${a} parts=${parts} showHint=${hints} />`)}
    </div>`;
}

/** Cronómetro regresivo: <Timer minutes=${5} /> */
export function Timer({ minutes = 5 }) {
  const [left, setLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setLeft((v) => {
      if (v <= 1) { clearInterval(ref.current); setRunning(false); return 0; }
      return v - 1;
    }), 1000);
    return () => clearInterval(ref.current);
  }, [running]);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const reset = () => { setRunning(false); setLeft(minutes * 60); };
  return html`
    <div class="timer-bar">
      <span class="timer-display">${left === 0 ? '¡Tiempo!' : `${mm}:${ss}`}</span>
      ${running
        ? html`<button type="button" class="timer-btn" onClick=${() => setRunning(false)}>⏸ Pausar</button>`
        : html`<button type="button" class="timer-btn" onClick=${() => (left === 0 ? reset() : setRunning(true))}>
            ${left === 0 ? '↺ Reiniciar' : left < minutes * 60 ? '▶ Continuar' : '▶ Iniciar Cronómetro'}</button>`}
    </div>`;
}

/**
 * Área de escritura con "Revisión Visual": cuenta conectores y verbos usados.
 * <WritingCheck connectors=${['first','then']} verbs=${['eat','cook']} min=${3} />
 */
export function WritingCheck({ placeholder, rows = 6, connectors = [], verbs = [], min = 3 }) {
  const [text, setText] = useState('');
  const [review, setReview] = useState(null);
  const run = () => {
    const t = text.toLowerCase();
    const c = connectors.filter((x) => t.includes(x));
    const v = verbs.filter((x) => t.includes(x));
    setReview({ c, v, ok: c.length >= min && v.length >= min });
  };
  return html`
    <textarea rows=${rows} placeholder=${placeholder} value=${text} onInput=${(e) => setText(e.currentTarget.value)}></textarea>
    <button type="button" class="word-btn mt" onClick=${run}>🔎 Revisión Visual</button>
    ${review ? html`
      <div class="review-box">
        <strong>${review.ok
          ? '✔ ¡Buen trabajo! Tu párrafo tiene buena variedad de conectores y verbos.'
          : '💡 Intenta usar más conectores y verbos distintos para que tu párrafo fluya mejor.'}</strong>
        <ul>
          <li>Conectores encontrados (${review.c.length}): ${review.c.join(', ') || 'ninguno todavía'}</li>
          <li>Verbos encontrados (${review.v.length}): ${review.v.join(', ') || 'ninguno todavía'}</li>
        </ul>
      </div>` : null}`;
}

/**
 * Texto de lectura con botón para revelar su estructura gramatical.
 * `parts`: strings (texto normal) y pares [tipo, texto] (texto que se colorea).
 * <StructuredReading parts=${[['subject','Daniela'], ' ', ['verb','wakes up'], '.']} />
 */
export function StructuredReading({ parts, children }) {
  const [show, setShow] = useState(false);
  return html`
    <blockquote class="reading-box">
      ${parts.map((p) => (typeof p === 'string' ? p : show ? html`<${Hl} t=${p[0]}>${p[1]}<//>` : p[1]))}
    </blockquote>
    ${children}
    <button type="button" class="word-btn mt" onClick=${() => setShow(!show)}>
      ${show ? '🙈 Ocultar Estructura' : '👁️ Ver Estructura'}
    </button>`;
}
