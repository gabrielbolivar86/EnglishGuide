// Una pregunta del cuestionario: texto libre u opción múltiple.
import { html } from '../../lib/preact.js';

// El número se calcula según el orden mostrado (las secciones 2 y 3 se mezclan).
export function QuestionItem({ q, number, value, onChange }) {
  const texto = q.enunciado.replace(/^\d+\.\s*/, '');
  return html`
    <div class="question">
      <p class="question-text">${number}. ${texto}</p>
      ${q.ejemplo ? html`<p class="question-hint">${q.ejemplo}</p>` : null}
      ${q.tipo === 'texto'
        ? html`<textarea class="textarea" value=${value || ''} onInput=${(e) => onChange(e.currentTarget.value)}></textarea>`
        : html`
          <div class="options" role="radiogroup">
            ${Object.entries(q.opciones).map(([letra, texto]) => html`
              <label class=${'option' + (value === letra ? ' selected' : '')}>
                <input type="radio" name=${q.id} value=${letra} checked=${value === letra}
                  onChange=${() => onChange(letra)} />
                <span><b>${letra})</b> ${texto}</span>
              </label>`)}
          </div>`}
    </div>`;
}
