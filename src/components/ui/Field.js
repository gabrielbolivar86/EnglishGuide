import { html } from '../../lib/preact.js';

/** Campo de formulario con label, ayuda y error. `multiline` usa <textarea>. */
export function Field({ label, help, error, multiline, onInput, value, id, ...rest }) {
  const fieldId = id || 'f_' + (label || '').replace(/\W+/g, '_');
  const handler = (e) => onInput && onInput(e.currentTarget.value);
  return html`
    <div class="field">
      ${label ? html`<label class="field-label" for=${fieldId}>${label}</label>` : null}
      ${multiline
        ? html`<textarea id=${fieldId} class="textarea" value=${value} onInput=${handler} ...${rest}></textarea>`
        : html`<input id=${fieldId} class="input" value=${value} onInput=${handler} ...${rest} />`}
      ${help ? html`<div class="field-help">${help}</div>` : null}
      ${error ? html`<div class="error-text">${error}</div>` : null}
    </div>`;
}
