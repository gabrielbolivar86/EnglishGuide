import { html } from '../../lib/preact.js';
import { Hl } from './Grammar.js';

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
export function Goals({
  clase, semana, mes,
  claseTitulo = 'Meta de esta Clase', semanaTitulo = 'Meta Semanal (Fuera de clase)', mesTitulo = 'Meta General del Mes',
}) {
  return html`
    ${clase ? html`<div class="meta-box"><div class="meta-title">🎯 ${claseTitulo}:</div><p>“${clase}”</p></div>` : null}
    ${semana ? html`<div class="meta-box meta-week"><div class="meta-title">📌 ${semanaTitulo}:</div><p>“${semana}”</p></div>` : null}
    ${mes ? html`<div class="meta-box meta-month"><div class="meta-title">🏆 ${mesTitulo}:</div><p>“${mes}”</p></div>` : null}`;
}

/** Meta destacada al inicio de la clase: <ClassGoal>Comprender…<//> */
export function ClassGoal({ title = '🎯 Meta de la Clase de Hoy', children }) {
  return html`
    <section class="card class-goal">
      <div class="class-goal-title">${title}</div>
      <p>“${children}”</p>
    </section>`;
}

/** Recuadro de nota / dato nuevo: <Tip title="🔗 Un conector nuevo">…<//> */
export function Tip({ title, children }) {
  return html`
    <div class="tip-box">
      ${title ? html`<div class="tip-title">${title}</div>` : null}
      <div class="tip-body">${children}</div>
    </div>`;
}

/**
 * Vocabulario en columnas por categoría gramatical:
 * <VocabColumns columns=${[{ title: 'Sujetos', t: 'subject', items: ['I', 'We'] }]} />
 */
export function VocabColumns({ columns }) {
  return html`
    <div class="vocab-columns">
      ${columns.map((c) => html`
        <div class="vocab-column">
          <h4>${c.title}</h4>
          ${c.items.map((it) => html`<${Hl} t=${c.t}>${it}<//>`)}
        </div>`)}
    </div>`;
}

/** Guía de pasos: <StepsGuide title="🗺️ Guía Fácil" steps=${[{ title, body }]} /> */
export function StepsGuide({ title, steps }) {
  return html`
    <section class="card steps-guide">
      ${title ? html`<div class="section-header"><h2>${title}</h2></div>` : null}
      <div class="steps-grid">
        ${steps.map((st) => html`<div class="step"><strong>${st.title}</strong><p>${st.body}</p></div>`)}
      </div>
    </section>`;
}
