import { html, useState } from '../../lib/preact.js';
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

/**
 * Consigna en inglés con traducción al español que se muestra/oculta:
 * <Instruction es="Selecciona la opción correcta.">Select the correct option.<//>
 */
export function Instruction({ es, children }) {
  const [open, setOpen] = useState(false);
  return html`
    <div class="instruction">
      <p class="instruction-en">${children}</p>
      <button type="button" class="es-toggle" onClick=${() => setOpen(!open)}>
        ${open ? '🙈 Ocultar español / Hide Spanish' : '👁️ Ver en español / Show Spanish'}
      </button>
      ${open ? html`<p class="instruction-es">${es}</p>` : null}
    </div>`;
}

/**
 * Tarjetas de reglas:
 * <RuleCards rules=${[{ title: '+s', when: 'La mayoría', examples: [['cook','cooks']] }]} />
 * Cada ejemplo [base, resultado] se muestra "base → resultado" (resultado en color verbo).
 */
export function RuleCards({ rules, t = 'verb' }) {
  return html`
    <div class="rule-grid">
      ${rules.map((r) => html`
        <div class="rule-card">
          <h4>${r.title}</h4>
          ${r.when ? html`<div class="rule-when">${r.when}</div>` : null}
          ${(r.examples || []).map(([a, b]) => html`<span class="rule-example">${a} → <${Hl} t=${t}>${b}<//></span>`)}
        </div>`)}
    </div>`;
}

/**
 * Comparación lado a lado (literal vs. natural, o dos usos):
 * <Compare title='"Voy al trabajo"' left=${{ label: '✖ Literal', body: 'I go to the work.' }}
 *   right=${{ label: '✔ Natural', body: html`…`, note: '…' }} />
 * variant: 'fix' (rojo/verde, por defecto) | 'pair' (dos tarjetas neutras)
 */
export function Compare({ title, left, right, variant = 'fix' }) {
  const cell = (c, kind) => html`
    <div class=${'compare-cell ' + kind}>
      <div class="compare-label">${c.label}</div>
      <div>${c.body}</div>
      ${c.note ? html`<div class="compare-note">${c.note}</div>` : null}
    </div>`;
  return html`
    ${title ? html`<p class="compare-title"><strong>${title}</strong></p>` : null}
    <div class="compare-row">
      ${cell(left, variant === 'fix' ? 'literal' : 'pair')}
      ${cell(right, variant === 'fix' ? 'natural' : 'pair')}
    </div>`;
}
