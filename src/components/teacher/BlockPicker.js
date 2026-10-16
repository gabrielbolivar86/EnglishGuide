// Selector de bloques de horario (checkbox por día × bloque).
import { html } from '../../lib/preact.js';
import { SCHEDULE } from '../../config.js';
import { parseBloques } from '../../utils/schedule.js';

export function BlockPicker({ value, onChange }) {
  const selected = new Set(parseBloques(value));
  const toggle = (key) => {
    selected.has(key) ? selected.delete(key) : selected.add(key);
    onChange([...selected].join(','));
  };
  return html`
    <div class="block-picker">
      <div class="bp-row bp-head">
        <span></span>${SCHEDULE.dias.map((d) => html`<span>${d.corto}</span>`)}
      </div>
      ${SCHEDULE.bloques.map((b) => html`
        <div class="bp-row">
          <span class="bp-time">${b.inicio}</span>
          ${SCHEDULE.dias.map((d) => {
            const key = d.id + '-' + b.id;
            return html`<button type="button" class=${'bp-cell' + (selected.has(key) ? ' on' : '')}
              aria-pressed=${selected.has(key)} aria-label=${d.largo + ' ' + b.inicio}
              onClick=${() => toggle(key)}></button>`;
          })}
        </div>`)}
    </div>`;
}
