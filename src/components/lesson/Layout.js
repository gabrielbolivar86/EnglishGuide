import { html } from '../../lib/preact.js';

/** Encabezado de la lección: <LessonHeader title="Lección 1" subtitle="…" /> */
export function LessonHeader({ title, subtitle }) {
  return html`
    <header class="lesson-header">
      <h1>${title}</h1>
      ${subtitle ? html`<div class="subtitle">${subtitle}</div>` : null}
    </header>`;
}

/** Sección numerada con etiqueta de tiempo: <Section n=${1} title="…" minutes=${15}>…<//> */
export function Section({ n, title, minutes, tag, extra, children }) {
  const label = tag || (minutes ? `${minutes} min` : null);
  return html`
    <section class="card">
      <div class="section-header">
        <h2>${n != null ? n + '. ' : ''}${title}</h2>
        ${label ? html`<span class=${'tag' + (extra ? ' tag-extra' : '')}>${label}</span>` : null}
      </div>
      ${children}
    </section>`;
}

/** Tarjeta simple sin encabezado numerado */
export function Block({ title, children }) {
  return html`<section class="card">${title ? html`<h3>${title}</h3>` : null}${children}</section>`;
}

/** Pausa activa */
export function Pause({ minutes = 10, title = '☕ Pausa de Recarga Activa', children }) {
  return html`
    <section class="card pause-card">
      <h3>${title}</h3>
      <p><strong>Tiempo: ${minutes} minutos</strong> - ${children || 'Momento de descansar la vista, estirarse o tomar agua.'}</p>
    </section>`;
}

/** Separador de ejercicios extra (práctica individual) */
export function ExtraBanner({ title = '⭐ Ejercicios de Práctica Individual (Extra)', children }) {
  return html`
    <section class="card extra-banner">
      <h3>${title}</h3>
      <p>${children || 'Estos ejercicios no se hicieron durante la clase en vivo. Son material adicional para practicar por tu cuenta.'}</p>
    </section>`;
}
