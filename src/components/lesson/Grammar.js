// Código de colores gramatical (igual en todas las lecciones)
import { html } from '../../lib/preact.js';

export const GRAMMAR = {
  connector:  { cls: 'hl-connector',  label: 'Conector de Orden' },
  subject:    { cls: 'hl-subject',    label: 'Sujeto' },
  verb:       { cls: 'hl-verb',       label: 'Verbo Acción' },
  complement: { cls: 'hl-complement', label: 'Complemento / Hora' },
};

/** Resaltador: <Hl t="verb">wake up<//> */
export function Hl({ t, children }) {
  return html`<span class=${GRAMMAR[t]?.cls}>${children}</span>`;
}

/**
 * Leyenda del código de colores. Orden y textos personalizables:
 * <ColorLegend items=${['subject','verb']} labels=${{ subject: 'Sujeto (¿Quién?)' }} />
 */
export function ColorLegend({ items = Object.keys(GRAMMAR), labels = {} }) {
  return html`
    <div class="color-legend">
      ${items.map((t) => html`<${Hl} t=${t}>${labels[t] || GRAMMAR[t].label}<//>`)}
    </div>`;
}

/** Fórmula: <Formula parts=${['connector','subject','verb','complement']} /> */
export function Formula({ parts, labels = {} }) {
  const def = { connector: '[Conector]', subject: '[Sujeto]', verb: '[Verbo]', complement: '[Complemento]' };
  return html`
    <div class="formula-box">
      ${parts.map((p, i) => html`${i ? ' + ' : ''}<${Hl} t=${p}>${labels[p] || def[p] || p}<//>`)}
    </div>`;
}
