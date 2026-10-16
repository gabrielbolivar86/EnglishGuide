// Pestaña "Perfil de Aprendizaje": intro → cuestionario por secciones → gracias.
import { html, useMemo, useState } from '../../lib/preact.js';
import { Button, Card } from '../../components/ui/index.js';
import { QuestionItem, ProgressBar } from '../../components/student/index.js';
import { useQuestionnaire } from '../../hooks/useQuestionnaire.js';
import { SECTIONS } from '../../data/questionnaire.js';

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

const SAVE_TEXT = { saving: 'Guardando…', saved: 'Guardado ✓', offline: 'Sin conexión: guardado en este dispositivo' };

export function ProfileTab({ codigo, nombre, cuestionario, isPreview, onCompleted }) {
  const done = cuestionario.estado === 'Completado';
  const [step, setStep] = useState(done ? 'done' : 'intro'); // intro | quiz | error | thanks | done
  const [section, setSection] = useState(0);
  const [hint, setHint] = useState('');
  const q = useQuestionnaire(codigo, cuestionario.respuestas, { readOnly: isPreview });
  const sections = useMemo(() => SECTIONS.map((s) => ({ ...s, preguntas: s.mezclar ? shuffle(s.preguntas) : s.preguntas })), []);

  if (step === 'done' || step === 'thanks') {
    return html`<${Card}>
      <div class="result">
        <div class="result-icon">${step === 'thanks' ? '🏆' : '✅'}</div>
        <h2>${step === 'thanks' ? '¡Gracias, ' + nombre.split(' ')[0] + '!' : 'Cuestionario completado'}</h2>
        <p class="muted">Tu profesor ya tiene tus respuestas y las usará para adaptar tus clases a tu forma de aprender.</p>
      </div>
    <//>`;
  }

  if (step === 'intro') {
    return html`<${Card}>
      <div class="result">
        <div class="result-icon">🧭</div>
        <h2>Perfil de Aprendizaje</h2>
        <p>Son 12 preguntas sobre tu forma de aprender. No hay respuestas correctas o incorrectas: contesta con sinceridad.</p>
        <p class="muted small">Tus respuestas se guardan solas. Si se corta el internet o cierras la página, vuelve a entrar con tu código y continúas donde quedaste.</p>
        ${isPreview ? html`<p class="badge badge-warn">Vista previa del profesor: no se guardará nada</p>` : null}
        <${Button} variant="primary" size="lg" onClick=${() => { q.start(); setStep('quiz'); }}>
          ${q.progress > 0 ? 'Continuar' : 'Comenzar'}
        <//>
      </div>
    <//>`;
  }

  if (step === 'error') {
    return html`<${Card}>
      <div class="result">
        <div class="result-icon">⚠️</div>
        <h2>No se pudo enviar</h2>
        <p><strong>Tus respuestas están guardadas</strong> en este dispositivo, no las perdiste.</p>
        <p class="muted small">Código de referencia: <strong>${q.submitError?.ref}</strong><br />Detalle: ${q.submitError?.message}</p>
        <div class="btn-row">
          <${Button} onClick=${() => setStep('quiz')}>Revisar respuestas<//>
          <${Button} variant="primary" loading=${q.submitting} onClick=${send}>Reintentar envío<//>
        </div>
        <p class="muted small">Si el problema sigue, avísale a tu profesor con el código de referencia.</p>
      </div>
    <//>`;
  }

  async function send() {
    if (q.missing.length) { setHint(`Te faltan ${q.missing.length} pregunta(s) por responder.`); return; }
    setHint('');
    const ok = await q.submit();
    if (ok) { setStep('thanks'); onCompleted && onCompleted(); }
    else setStep('error');
  }

  const sec = sections[section];
  const last = section === sections.length - 1;
  const go = (i) => { setSection(i); setHint(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return html`
    <${Card}>
      <${ProgressBar} value=${q.progress} />
      <div class="quiz-head">
        <h2>${sec.titulo}</h2>
        <span class="muted small" aria-live="polite">${SAVE_TEXT[q.saveStatus] || ''}</span>
      </div>
      ${sec.preguntas.map((pq, i) => html`
        <${QuestionItem} key=${pq.id} q=${pq} number=${i + 1} value=${q.respuestas[pq.id]} onChange=${(v) => q.answer(pq.id, v)} />`)}
      <div class="quiz-nav">
        <${Button} onClick=${() => go(section - 1)} disabled=${section === 0}>◀ Anterior<//>
        <span class="muted small">Sección ${section + 1} de ${sections.length}</span>
        ${last
          ? html`<${Button} variant="primary" loading=${q.submitting} disabled=${isPreview} onClick=${send}>Enviar respuestas<//>`
          : html`<${Button} variant="primary" onClick=${() => go(section + 1)}>Siguiente ▶<//>`}
      </div>
      <div class="error-text">${hint}</div>
    <//>`;
}
