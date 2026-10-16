import { html } from '../../lib/preact.js';

/** Vocabulario: <Vocab items=${[['Wake up','Despertarse'], …]} /> */
export function Vocab({ items }) {
  return html`
    <div class="vocab-grid">
      ${items.map(([en, es]) => html`<div class="vocab-item"><strong>${en}</strong><span>${es}</span></div>`)}
    </div>`;
}

/** Texto de lectura con borde lateral */
export function Reading({ children }) {
  return html`<blockquote class="reading-box">${children}</blockquote>`;
}

/** Panel de ejemplo */
export function Example({ label = 'Ejemplo de referencia', children }) {
  return html`<div class="example-panel"><p><em>${label}:</em> ${children}</p></div>`;
}

/** Recuadro punteado para un ejercicio */
export function Exercise({ children }) {
  return html`<div class="exercise-box">${children}</div>`;
}

/**
 * Metas de la clase:
 * <Goals clase="…" semana="…" mes="…" />
 */
export function Goals({ clase, semana, mes, mesTitulo = 'Meta General del Mes' }) {
  return html`
    ${clase ? html`<div class="meta-box"><div class="meta-title">🎯 Meta de esta Clase:</div><p>“${clase}”</p></div>` : null}
    ${semana ? html`<div class="meta-box meta-week"><div class="meta-title">📌 Meta Semanal (Fuera de clase):</div><p>“${semana}”</p></div>` : null}
    ${mes ? html`<div class="meta-box meta-month"><div class="meta-title">🏆 ${mesTitulo}:</div><p>“${mes}”</p></div>` : null}`;
}
