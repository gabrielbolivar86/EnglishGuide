// Gráfico radar en SVG puro (reemplaza Chart.js: sin dependencias).
import { html } from '../../lib/preact.js';

export function RadarChart({ labels, values, max = 5, size = 260 }) {
  const c = size / 2, r = size / 2 - 40, n = labels.length;
  const pt = (i, v) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [c + Math.cos(a) * r * (v / max), c + Math.sin(a) * r * (v / max)];
  };
  const ring = (v) => labels.map((_, i) => pt(i, v).join(',')).join(' ');
  return html`
    <svg viewBox=${`0 0 ${size} ${size}`} class="radar" role="img"
      aria-label=${labels.map((l, i) => `${l}: ${values[i]}`).join(', ')}>
      ${Array.from({ length: max }, (_, k) => html`<polygon points=${ring(k + 1)} class="radar-grid" />`)}
      ${labels.map((_, i) => { const [x, y] = pt(i, max); return html`<line x1=${c} y1=${c} x2=${x} y2=${y} class="radar-grid" />`; })}
      <polygon points=${values.map((v, i) => pt(i, v).join(',')).join(' ')} class="radar-area" />
      ${values.map((v, i) => { const [x, y] = pt(i, v); return html`<circle cx=${x} cy=${y} r="4" class="radar-dot" />`; })}
      ${labels.map((l, i) => { const [x, y] = pt(i, max + 0.9); return html`
        <text x=${x} y=${y} text-anchor="middle" dominant-baseline="middle" class="radar-label">${l} (${values[i]})</text>`; })}
    </svg>`;
}
